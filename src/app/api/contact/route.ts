import { NextRequest, NextResponse } from "next/server";
import {
  validateContactForm,
  sanitizeInput,
  stripHtml,
} from "@/lib/security";

// In-memory rate limiter for the API route (per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max 5 submissions
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // Per 15 minutes

function getRateLimitInfo(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Every minute

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimit = getRateLimitInfo(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const { name, email, subject, message, recaptchaToken, _honeypot } = body;

    // 3. Honeypot check — bots fill hidden fields
    if (_honeypot) {
      // Silently accept but don't process (makes bot think it succeeded)
      return NextResponse.json({ success: true, message: "Message sent successfully!" });
    }

    // 4. Validate reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: "reCAPTCHA verification required." },
        { status: 400 }
      );
    }

    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      console.error("RECAPTCHA_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json(
        {
          error: "reCAPTCHA verification failed. Please try again.",
          score: recaptchaData.score,
        },
        { status: 403 }
      );
    }

    // 5. Sanitize inputs
    const sanitizedData = {
      name: stripHtml(sanitizeInput(name || "")),
      email: stripHtml(sanitizeInput(email || "")),
      subject: stripHtml(sanitizeInput(subject || "")),
      message: stripHtml(sanitizeInput(message || "")),
    };

    // 6. Validate form data (SQL injection, XSS, length, format checks)
    const validationError = validateContactForm(sanitizedData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // 7. Process the form submission
    // In production, you would:
    // - Send an email via SendGrid/Resend/Nodemailer
    // - Store in a database
    // - Send to a Slack/Discord webhook
    // For now, log it server-side
    console.log("📧 Contact form submission:", {
      timestamp: new Date().toISOString(),
      ip,
      recaptchaScore: recaptchaData.score,
      ...sanitizedData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been received. We'll get back to you soon.",
      },
      {
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// Block all other methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
