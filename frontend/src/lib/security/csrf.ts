import crypto from 'crypto';

export interface CSRFConfig {
  secret: string;
  tokenLength?: number;
  cookieName?: string;
  cookieOptions?: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge?: number;
  };
}

export class CSRFProtection {
  private config: Required<CSRFConfig>;

  constructor(config: CSRFConfig) {
    this.config = {
      tokenLength: 32,
      cookieName: 'csrf-token',
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      },
      ...config
    };
  }

  /**
   * Generate a new CSRF token
   */
  generateToken(): string {
    return crypto.randomBytes(this.config.tokenLength).toString('hex');
  }

  /**
   * Validate a CSRF token
   */
  validateToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) {
      return false;
    }
    
    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(storedToken, 'hex')
    );
  }

  /**
   * Get cookie configuration
   */
  getCookieConfig() {
    return {
      name: this.config.cookieName,
      options: this.config.cookieOptions
    };
  }

  /**
   * Create middleware for CSRF protection
   */
  middleware() {
    return async (req: any, res: any, next: any) => {
      try {
        // Skip CSRF check for GET requests
        if (req.method === 'GET') {
          return next();
        }

        const token = req.headers['x-csrf-token'] || req.body._csrf;
        const storedToken = req.cookies?.[this.config.cookieName];

        if (!this.validateToken(token, storedToken)) {
          return res.status(403).json({
            error: 'CSRF token validation failed',
            code: 'CSRF_ERROR'
          });
        }

        next();
      } catch (error) {
        console.error('CSRF middleware error:', error);
        return res.status(500).json({
          error: 'Internal server error',
          code: 'CSRF_ERROR'
        });
      }
    };
  }
}

// Default CSRF instance
export const csrfProtection = new CSRFProtection({
  secret: process.env.CSRF_SECRET || 'your-csrf-secret-key-change-in-production'
});

// Utility functions
export const generateCSRFToken = () => csrfProtection.generateToken();
export const validateCSRFToken = (token: string, storedToken: string) => 
  csrfProtection.validateToken(token, storedToken);
