import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global rate limiter for DDoS protection.
 * Tracks requests per IP within a sliding window.
 */
const ipRequestCounts = new Map<
  string,
  { count: number; resetTime: number }
>();

// Rate limit: 100 requests per minute per IP for general browsing
const GENERAL_RATE_LIMIT = 100;
const GENERAL_WINDOW_MS = 60 * 1000; // 1 minute

// API rate limit: 30 requests per minute per IP
const API_RATE_LIMIT = 30;
const API_WINDOW_MS = 60 * 1000;

function checkRateLimit(
  ip: string,
  isApi: boolean
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = `${ip}:${isApi ? "api" : "general"}`;
  const limit = isApi ? API_RATE_LIMIT : GENERAL_RATE_LIMIT;
  const windowMs = isApi ? API_WINDOW_MS : GENERAL_WINDOW_MS;

  const entry = ipRequestCounts.get(key);

  if (!entry || now > entry.resetTime) {
    ipRequestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

// Clean up old entries every 2 minutes
if (typeof globalThis !== "undefined") {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of ipRequestCounts.entries()) {
      if (now > value.resetTime) {
        ipRequestCounts.delete(key);
      }
    }
  }, 120000);

  // Prevent memory leak in dev mode
  if (process.env.NODE_ENV === "development") {
    (globalThis as any).__rateLimitCleanup?.();
    (globalThis as any).__rateLimitCleanup = () => clearInterval(cleanupInterval);
  }
}

/**
 * Detect suspicious bot patterns in User-Agent strings.
 */
function isSuspiciousBot(userAgent: string): boolean {
  if (!userAgent) return true; // No UA = suspicious

  const suspiciousPatterns = [
    /curl/i,
    /wget/i,
    /python-requests/i,
    /python-urllib/i,
    /scrapy/i,
    /httpclient/i,
    /java\//i,
    /libwww/i,
    /\bbot\b(?!.*(?:google|bing|yahoo|baidu|yandex|duckduck|facebook|twitter|linkedin|slack|discord|whatsapp|telegram|apple|microsoft))/i,
    /spider(?!.*(?:google|bing|yahoo|baidu|yandex))/i,
    /crawler(?!.*(?:google|bing|yahoo|baidu|yandex))/i,
    /phantom/i,
    /headless/i,
    /selenium/i,
    /puppeteer/i,
    /playwright/i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(userAgent));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/icons/") ||
    pathname === "/favicon.ico" ||
    pathname === "/logo.svg" ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp")
  ) {
    return NextResponse.next();
  }

  // Get client IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const userAgent = request.headers.get("user-agent") || "";
  const isApi = pathname.startsWith("/api/");

  // 1. Block suspicious bots (but not on API routes they won't reach anyway)
  if (!isApi && isSuspiciousBot(userAgent)) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
        "X-Block-Reason": "suspicious-agent",
      },
    });
  }

  // 2. Rate limiting
  const { allowed, remaining } = checkRateLimit(ip, isApi);

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests. Please slow down.",
        retryAfter: 60,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          "X-RateLimit-Limit": String(isApi ? API_RATE_LIMIT : GENERAL_RATE_LIMIT),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // 3. Add security headers to the response
  const response = NextResponse.next();

  // Rate limit headers
  response.headers.set(
    "X-RateLimit-Limit",
    String(isApi ? API_RATE_LIMIT : GENERAL_RATE_LIMIT)
  );
  response.headers.set("X-RateLimit-Remaining", String(remaining));

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
