export interface RateLimitConfig {
  windowMs?: number;
  max?: number;
  message?: string;
  statusCode?: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
  handler?: (req: any, res: any) => void;
  onLimitReached?: (req: any, res: any) => void;
}

export interface RateLimitStore {
  get: (key: string) => Promise<{ totalHits: number; resetTime: number } | null>;
  increment: (key: string) => Promise<{ totalHits: number; resetTime: number }>;
  decrement: (key: string) => Promise<void>;
  resetKey: (key: string) => Promise<void>;
}

// In-memory store (for development)
class MemoryStore implements RateLimitStore {
  private store = new Map<string, { totalHits: number; resetTime: number }>();

  async get(key: string) {
    const data = this.store.get(key);
    if (!data) return null;
    
    if (Date.now() > data.resetTime) {
      this.store.delete(key);
      return null;
    }
    
    return data;
  }

  async increment(key: string) {
    const now = Date.now();
    const data = this.store.get(key);
    
    if (!data || now > data.resetTime) {
      const newData = { totalHits: 1, resetTime: now + 15 * 60 * 1000 }; // 15 minutes
      this.store.set(key, newData);
      return newData;
    }
    
    data.totalHits++;
    this.store.set(key, data);
    return data;
  }

  async decrement(key: string) {
    const data = this.store.get(key);
    if (data && data.totalHits > 0) {
      data.totalHits--;
      this.store.set(key, data);
    }
  }

  async resetKey(key: string) {
    this.store.delete(key);
  }
}

// Redis store (for production)
class RedisStore implements RateLimitStore {
  private client: any;
  private prefix: string;

  constructor(redisClient: any, prefix: string = 'rate-limit:') {
    this.client = redisClient;
    this.prefix = prefix;
  }

  async get(key: string) {
    try {
      const data = await this.client.get(`${this.prefix}${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis rate limit get error:', error);
      return null;
    }
  }

  async increment(key: string) {
    try {
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutes
      const resetTime = now + windowMs;
      
      const multi = this.client.multi();
      multi.incr(`${this.prefix}${key}`);
      multi.expire(`${this.prefix}${key}`, Math.ceil(windowMs / 1000));
      
      const results = await multi.exec();
      const totalHits = results[0][1] as number;
      
      return { totalHits, resetTime };
    } catch (error) {
      console.error('Redis rate limit increment error:', error);
      return { totalHits: 1, resetTime: Date.now() + 15 * 60 * 1000 };
    }
  }

  async decrement(key: string) {
    try {
      await this.client.decr(`${this.prefix}${key}`);
    } catch (error) {
      console.error('Redis rate limit decrement error:', error);
    }
  }

  async resetKey(key: string) {
    try {
      await this.client.del(`${this.prefix}${key}`);
    } catch (error) {
      console.error('Redis rate limit reset error:', error);
    }
  }
}

// Rate limiter class
export class RateLimiter {
  private config: Required<RateLimitConfig>;
  private store: RateLimitStore;

  constructor(config: RateLimitConfig, store?: RateLimitStore) {
    this.config = {
      windowMs: 15 * 60 * 1000, // 15 minutes default
      max: 100,
      message: 'Too many requests from this IP, please try again later.',
      statusCode: 429,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: (req: any) => req.ip || req.connection.remoteAddress || 'unknown',
      handler: (req: any, res: any) => {
        res.status(this.config.statusCode).json({
          error: this.config.message,
          retryAfter: Math.ceil(this.config.windowMs / 1000),
          code: 'RATE_LIMIT_EXCEEDED'
        });
      },
      onLimitReached: () => {},
      ...config
    };

    this.store = store || new MemoryStore();
  }

  // Create middleware function
  middleware() {
    return async (req: any, res: any, next: any) => {
      try {
        // Skip rate limiting for certain requests
        if (this.shouldSkipRequest(req, res)) {
          return next();
        }

        const key = this.config.keyGenerator!(req);
        const { totalHits, resetTime } = await this.store.increment(key);

        // Set rate limit headers
        res.set({
          'X-RateLimit-Limit': this.config.max.toString(),
          'X-RateLimit-Remaining': Math.max(0, this.config.max - totalHits).toString(),
          'X-RateLimit-Reset': new Date(resetTime).toISOString(),
          'Retry-After': Math.ceil(this.config.windowMs / 1000).toString()
        });

        // Check if limit exceeded
        if (totalHits > this.config.max) {
          this.config.onLimitReached!(req, res);
          return this.config.handler!(req, res);
        }

        // Progressive delay for high usage
        if (totalHits > this.config.max * 0.8) {
          const delay = Math.min(1000, (totalHits - this.config.max * 0.8) * 100);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        next();
      } catch (error) {
        console.error('Rate limiter error:', error);
        // On error, allow request to proceed
        next();
      }
    };
  }

  private shouldSkipRequest(req: any, res: any): boolean {
    // Skip successful requests if configured
    if (this.config.skipSuccessfulRequests && res.statusCode < 400) {
      return true;
    }

    // Skip failed requests if configured
    if (this.config.skipFailedRequests && res.statusCode >= 400) {
      return true;
    }

    // Skip health checks
    if (req.path === '/api/health' || req.path === '/health') {
      return true;
    }

    // Skip static assets
    if (req.path.startsWith('/_next/') || req.path.startsWith('/static/')) {
      return true;
    }

    return false;
  }

  // Create different rate limiters for different endpoints
  static createStrictLimiter() {
    return new RateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50, // More restrictive
      message: 'Too many requests. Please slow down.',
    });
  }

  static createAuthLimiter() {
    return new RateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Very restrictive for auth
      message: 'Too many authentication attempts. Please try again later.',
      statusCode: 429,
    });
  }

  static createAPILimiter() {
    return new RateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200, // More permissive for API
      message: 'API rate limit exceeded. Please try again later.',
    });
  }
}

// Export default instances
export const strictRateLimiter = RateLimiter.createStrictLimiter();
export const authRateLimiter = RateLimiter.createAuthLimiter();
export const apiRateLimiter = RateLimiter.createAPILimiter();

// Export store classes for external use
export { MemoryStore, RedisStore };
