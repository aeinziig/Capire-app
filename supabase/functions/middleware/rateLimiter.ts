// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

/**
 * Rate limiter implementation with the following limitations:
 * - Instance-specific: Memory store is not shared between instances
 * - IP-based: Uses IP address as the rate limit key (can be circumvented by changing IPs)
 * - Fail-open: If rate limiter encounters an error, requests are allowed to proceed
 */
class RateLimiter {
  private storage: Map<string, RateLimitInfo> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    // Start automatic cleanup every minute
    this.startCleanup();
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup() {
    // Cleanup every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // 1 minute
  }

  /**
   * Stop periodic cleanup
   */
  public stopCleanup() {
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Check if the request is within rate limit
   * @param key Unique identifier for the requester (IP, user ID, etc.)
   * @returns Object with allowed boolean and optional retryAfter seconds
   */
  consume(key: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = this.storage.get(key);

    if (!record) {
      // First request from this key
      this.storage.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return { allowed: true };
    }

    // Reset if window has passed
    if (now > record.resetTime) {
      this.storage.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return { allowed: true };
    }

    // Increment count
    record.count++;

    // Check if over limit
    if (record.count > this.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return { allowed: false, retryAfter };
    }

    return { allowed: true };
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.storage.entries()) {
      if (now > record.resetTime) {
        this.storage.delete(key);
      }
    }
  }
}

// Export a singleton instance for shared use
export const rateLimiter = new RateLimiter(
  parseInt(Deno.env.get('RATE_LIMIT_WINDOW_MS') || '60000'), // 1 minute default
  parseInt(Deno.env.get('RATE_LIMIT_MAX_REQUESTS') || '10')  // 10 requests default
);

/**
 * Middleware function to apply rate limiting
 * @param key Function to extract key from request (e.g., IP, user ID)
 * @returns Response if rate limited, null if allowed
 */
export function rateLimitMiddleware(
  keyExtractor: (req: any) => string
): (req: any) => Response | null {
  return (req: any) => {
    try {
      const key = keyExtractor(req);
      const result = rateLimiter.consume(key);

      if (!result.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            retryAfter: result.retryAfter
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(result.retryAfter)
            }
          }
        );
      }
      return null;
    } catch (error) {
      // If rate limiter fails, allow request to proceed (fail open)
      console.error('Rate limiter error:', error);
      return null;
    }
  };
}