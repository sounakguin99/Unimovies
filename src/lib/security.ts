/**
 * Security utilities for input sanitization and validation.
 * Protects against XSS, SQL injection patterns, and malicious input.
 */

/**
 * Sanitize a string by removing HTML tags and dangerous characters.
 * Prevents XSS attacks when user input is displayed.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Strip all HTML tags from a string.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Detect and block common SQL injection patterns.
 * Returns true if the input contains suspicious patterns.
 */
export function containsSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|FETCH|DECLARE|TRUNCATE|CAST)\b)/i,
    /(--|;|\/\*|\*\/|xp_|sp_)/i,
    /('|"|`)\s*(OR|AND)\s*('|"|`)/i,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(1\s*=\s*1|1\s*=\s*'1')/i,
    /(\bSLEEP\s*\()/i,
    /(\bBENCHMARK\s*\()/i,
    /(\bLOAD_FILE\s*\()/i,
    /(\bINTO\s+OUTFILE\b)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Detect common XSS attack patterns.
 * Returns true if the input contains suspicious patterns.
 */
export function containsXSS(input: string): boolean {
  const xssPatterns = [
    /<script[\s>]/i,
    /javascript\s*:/i,
    /on\w+\s*=\s*["']/i, // onclick, onerror, etc.
    /eval\s*\(/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /import\s*\(/i,
    /data\s*:\s*text\/html/i,
    /vbscript\s*:/i,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate an email address format.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate all form fields for malicious content.
 * Returns an error message if validation fails, null if valid.
 */
export function validateContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string | null {
  // Check for empty fields
  if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
    return "All fields are required.";
  }

  // Length limits
  if (data.name.length > 100) return "Name is too long (max 100 characters).";
  if (data.email.length > 254) return "Email is too long.";
  if (data.subject.length > 200) return "Subject is too long (max 200 characters).";
  if (data.message.length > 5000) return "Message is too long (max 5000 characters).";

  // Email validation
  if (!isValidEmail(data.email)) {
    return "Please enter a valid email address.";
  }

  // SQL injection checks
  const allInputs = [data.name, data.email, data.subject, data.message];
  for (const input of allInputs) {
    if (containsSQLInjection(input)) {
      return "Your message contains suspicious content. Please revise and try again.";
    }
    if (containsXSS(input)) {
      return "Your message contains invalid characters. Please revise and try again.";
    }
  }

  return null;
}

/**
 * Rate limiting configuration for client-side form submission.
 * Prevents rapid-fire form submissions.
 */
export class RateLimiter {
  private timestamps: number[] = [];
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 3, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    if (this.timestamps.length >= this.maxAttempts) {
      return false;
    }
    this.timestamps.push(now);
    return true;
  }

  getTimeUntilReset(): number {
    if (this.timestamps.length === 0) return 0;
    const oldest = this.timestamps[0];
    return Math.max(0, this.windowMs - (Date.now() - oldest));
  }
}
