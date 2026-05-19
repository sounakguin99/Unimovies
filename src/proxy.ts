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
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const key = `${ip}:${isApi ? "api" : "general"}`;
  const limit = isApi ? API_RATE_LIMIT : GENERAL_RATE_LIMIT;
  const windowMs = isApi ? API_WINDOW_MS : GENERAL_WINDOW_MS;

  const entry = ipRequestCounts.get(key);

  if (!entry || now > entry.resetTime) {
    ipRequestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, retryAfter: 0 };
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

/**
 * Generate a beautifully styled, responsive rate limit HTML page matching
 * the premium Dark Cinema theme.
 */
function generateRateLimitHtml(retryAfter: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Too Many Requests - UNIMOVIES</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #3b82f6;
            --secondary: #8b5cf6;
            --accent: #ec4899;
            --bg-color: #030712;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-color);
            color: #ffffff;
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }

        /* Ambient background glows */
        .glow-bg {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 35%, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.05), transparent 60%);
            z-index: 0;
            pointer-events: none;
        }
        
        .glow-circle-1 {
            position: absolute;
            top: -10%;
            right: -10%;
            width: 50vw;
            height: 50vw;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
            filter: blur(100px);
            pointer-events: none;
        }

        .glow-circle-2 {
            position: absolute;
            bottom: -10%;
            left: -10%;
            width: 40vw;
            height: 40vw;
            background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
            filter: blur(100px);
            pointer-events: none;
        }

        .card {
            background: rgba(17, 24, 39, 0.45);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 28px;
            padding: 3.5rem 2.5rem;
            width: 90%;
            max-width: 520px;
            text-align: center;
            position: relative;
            z-index: 10;
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7);
            animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .icon-container {
            width: 80px;
            height: 80px;
            margin: 0 auto 2.5rem;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
            border: 1px solid rgba(239, 68, 68, 0.25);
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f87171;
            box-shadow: 0 10px 30px rgba(239, 68, 68, 0.15);
            position: relative;
        }

        .icon-container svg {
            width: 38px;
            height: 38px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2.2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(to right, #60a5fa, #a78bfa, #f472b6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1.25rem;
            letter-spacing: -0.03em;
        }

        p {
            color: #9ca3af;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2.25rem;
            font-weight: 400;
        }

        .countdown-box {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            padding: 0.8rem 1.6rem;
            border-radius: 9999px;
            color: #e2e8f0;
            font-weight: 600;
            margin-bottom: 2.5rem;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .countdown-num {
            color: #60a5fa;
            font-size: 1.25rem;
            font-weight: 800;
        }

        .button-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 1.1rem 2.2rem;
            border-radius: 18px;
            font-weight: 700;
            font-size: 1.05rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none;
            letter-spacing: -0.01em;
        }

        .btn-primary {
            background: linear-gradient(to right, #2563eb, #4f46e5, #7c3aed);
            color: white;
            border: none;
            box-shadow: 0 6px 24px rgba(79, 70, 229, 0.35);
        }

        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 35px rgba(79, 70, 229, 0.55);
        }

        .btn-primary:disabled {
            background: rgba(255, 255, 255, 0.04);
            color: #4b5563;
            border: 1px solid rgba(255, 255, 255, 0.05);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.02);
            color: #e5e7eb;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.15);
            color: #ffffff;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="glow-bg"></div>
    <div class="glow-circle-1"></div>
    <div class="glow-circle-2"></div>

    <div class="card">
        <div class="icon-container">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        </div>
        <h1>Too Many Requests</h1>
        <p>You've triggered our security rate limiting. Please take a brief intermission. We'll be ready for your return shortly.</p>
        
        <div class="countdown-box">
            Retry available in <span class="countdown-num" id="timer">${retryAfter}</span>s
        </div>

        <div class="button-group">
            <button id="retry-btn" class="btn btn-primary" disabled onclick="window.location.reload()">
                Try Again
            </button>
            <a href="/" class="btn btn-secondary">
                Return Home
            </a>
        </div>
    </div>

    <script>
        let seconds = ${retryAfter};
        const timerEl = document.getElementById('timer');
        const retryBtn = document.getElementById('retry-btn');
        
        const interval = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(interval);
                timerEl.parentElement.style.display = 'none';
                retryBtn.removeAttribute('disabled');
            } else {
                timerEl.textContent = seconds;
            }
        }, 1000);
    </script>
</body>
</html>`;
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
  const { allowed, remaining, retryAfter } = checkRateLimit(ip, isApi);

  if (!allowed) {
    const waitTime = retryAfter || 60;
    
    if (isApi) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests. Please try again later.",
          retryAfter: waitTime,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(waitTime),
            "X-RateLimit-Limit": String(isApi ? API_RATE_LIMIT : GENERAL_RATE_LIMIT),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    } else {
      // Return beautiful HTML page
      const html = generateRateLimitHtml(waitTime);
      return new NextResponse(html, {
        status: 429,
        headers: {
          "Content-Type": "text/html",
          "Retry-After": String(waitTime),
          "X-RateLimit-Limit": String(GENERAL_RATE_LIMIT),
          "X-RateLimit-Remaining": "0",
        },
      });
    }
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
