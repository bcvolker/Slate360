import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { securityLogger } from './logging';
import { securityErrorHandler } from './errorHandler';
import { validateFile } from './fileUpload';
import { z } from 'zod';

export interface APISecurityConfig {
  requireAuth: boolean;
  requireCSRF: boolean;
  rateLimit: boolean;
  validateInput: boolean;
  sanitizeOutput: boolean;
  logRequests: boolean;
  allowedMethods: string[];
  allowedOrigins: string[];
  maxRequestSize: number;
  timeout: number;
}

export interface APIRouteConfig {
  path: string;
  method: string;
  requireAuth: boolean;
  requireCSRF: boolean;
  rateLimit: boolean;
  roles?: string[];
  tiers?: string[];
  validateSchema?: z.ZodSchema;
  customValidation?: (req: NextRequest, session: any) => Promise<boolean>;
}

export interface SecurityMiddleware {
  name: string;
  priority: number;
  handler: (req: NextRequest, config: APIRouteConfig) => Promise<NextResponse | null>;
}

export class APISecurityManager {
  private static instance: APISecurityManager;
  private routeConfigs = new Map<string, APIRouteConfig>();
  private middlewares: SecurityMiddleware[] = [];

  private constructor() {
    this.initializeDefaultMiddlewares();
  }

  static getInstance(): APISecurityManager {
    if (!APISecurityManager.instance) {
      APISecurityManager.instance = new APISecurityManager();
    }
    return APISecurityManager.instance;
  }

  /**
   * Initialize default security middlewares
   */
  private initializeDefaultMiddlewares(): void {
    // Authentication middleware (highest priority)
    this.addMiddleware({
      name: 'authentication',
      priority: 1,
      handler: this.authenticateRequest.bind(this)
    });

    // CSRF protection middleware
    this.addMiddleware({
      name: 'csrf',
      priority: 2,
      handler: this.validateCSRF.bind(this)
    });

    // Rate limiting middleware
    this.addMiddleware({
      name: 'rateLimit',
      priority: 3,
      handler: this.checkRateLimit.bind(this)
    });

    // Input validation middleware
    this.addMiddleware({
      name: 'inputValidation',
      priority: 4,
      handler: this.validateInput.bind(this)
    });

    // Authorization middleware
    this.addMiddleware({
      name: 'authorization',
      priority: 5,
      handler: this.authorizeRequest.bind(this)
    });

    // Request logging middleware
    this.addMiddleware({
      name: 'logging',
      priority: 6,
      handler: this.logRequest.bind(this)
    });
  }

  /**
   * Add security middleware
   */
  addMiddleware(middleware: SecurityMiddleware): void {
    this.middlewares.push(middleware);
    // Sort by priority (lowest number = highest priority)
    this.middlewares.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Register API route configuration
   */
  registerRoute(config: APIRouteConfig): void {
    const key = `${config.method}:${config.path}`;
    this.routeConfigs.set(key, config);
  }

  /**
   * Get route configuration
   */
  getRouteConfig(method: string, path: string): APIRouteConfig | undefined {
    const key = `${method}:${path}`;
    return this.routeConfigs.get(key);
  }

  /**
   * Apply security middleware to API route
   */
  async secureRoute(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      const method = request.method;
      const path = request.nextUrl.pathname;
      const config = this.getRouteConfig(method, path);

      if (!config) {
        // Default configuration for unregistered routes
        const defaultConfig: APIRouteConfig = {
          path,
          method,
          requireAuth: true,
          requireCSRF: true,
          rateLimit: true,
          validateInput: true
        };
        return this.applySecurityMiddleware(request, defaultConfig, handler);
      }

      return this.applySecurityMiddleware(request, config, handler);

    } catch (error) {
      console.error('API security error:', error);
      return securityErrorHandler.handleSystemError(
        'API security check failed',
        request
      );
    }
  }

  /**
   * Apply security middleware chain
   */
  private async applySecurityMiddleware(
    request: NextRequest,
    config: APIRouteConfig,
    handler: (req: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      // Apply each middleware in priority order
      for (const middleware of this.middlewares) {
        // Skip middleware if not required for this route
        if (!this.shouldApplyMiddleware(middleware, config)) {
          continue;
        }

        const result = await middleware.handler(request, config);
        if (result) {
          // Middleware blocked the request
          return result;
        }
      }

      // All middleware passed, execute the handler
      return await handler(request);

    } catch (error) {
      console.error('Security middleware error:', error);
      return securityErrorHandler.handleSystemError(
        'Security middleware failed',
        request
      );
    }
  }

  /**
   * Check if middleware should be applied
   */
  private shouldApplyMiddleware(middleware: SecurityMiddleware, config: APIRouteConfig): boolean {
    switch (middleware.name) {
      case 'authentication':
        return config.requireAuth;
      case 'csrf':
        return config.requireCSRF;
      case 'rateLimit':
        return config.rateLimit;
      case 'inputValidation':
        return config.validateInput;
      case 'authorization':
        return config.roles || config.tiers;
      case 'logging':
        return true; // Always log
      default:
        return true;
    }
  }

  /**
   * Authentication middleware
   */
  private async authenticateRequest(
    request: NextRequest,
    config: APIRouteConfig
  ): Promise<NextResponse | null> {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return securityErrorHandler.handleAuthError(
          'Authentication required',
          request
        );
      }

      // Add session to request for other middleware
      (request as any).session = session;
      return null;

    } catch (error) {
      return securityErrorHandler.handleAuthError(
        'Authentication failed',
        request
      );
    }
  }

  /**
   * CSRF validation middleware
   */
  private async validateCSRF(
    request: NextRequest,
    config: APIRouteConfig
  ): Promise<NextResponse | null> {
    try {
      // Skip CSRF for GET requests
      if (request.method === 'GET') {
        return null;
      }

      const token = request.headers.get('x-csrf-token') || 
                   (await request.json())._csrf;

      if (!token) {
        return securityErrorHandler.handleValidationError(
          'CSRF token required',
          request,
          undefined,
          'csrf'
        );
      }

      // Validate CSRF token (implement actual validation)
      const isValid = await this.validateCSRFToken(token, request);
      if (!isValid) {
        return securityErrorHandler.handleValidationError(
          'Invalid CSRF token',
          request,
          undefined,
          'csrf'
        );
      }

      return null;

    } catch (error) {
      return securityErrorHandler.handleValidationError(
        'CSRF validation failed',
        request,
        undefined,
        'csrf'
      );
    }
  }

  /**
   * Rate limiting middleware
   */
  private async checkRateLimit(
    request: NextRequest,
    config: APIRouteConfig
  ): Promise<NextResponse | null> {
    try {
      const clientIP = this.getClientIP(request);
      const userId = (request as any).session?.user?.id;
      
      // Check rate limit (implement actual rate limiting)
      const isAllowed = await this.checkRateLimit(clientIP, userId, config);
      if (!isAllowed) {
        return securityErrorHandler.handleValidationError(
          'Rate limit exceeded',
          request,
          userId
        );
      }

      return null;

    } catch (error) {
      return securityErrorHandler.handleSystemError(
        'Rate limit check failed',
        request
      );
    }
  }

  /**
   * Input validation middleware
   */
  private async validateInput(
    request: NextRequest,
    config: APIRouteConfig
  ): Promise<NextResponse | null> {
    try {
      if (!config.validateSchema) {
        return null;
      }

      let body;
      try {
        body = await request.json();
      } catch {
        // No body to validate
        return null;
      }

      const result = config.validateSchema.safeParse(body);
      if (!result.success) {
        return securityErrorHandler.handleValidationError(
          'Invalid input data',
          request,
          (request as any).session?.user?.id,
          'input'
        );
      }

      // Add validated data to request
      (request as any).validatedData = result.data;
      return null;

    } catch (error) {
      return securityErrorHandler.handleValidationError(
        'Input validation failed',
        request,
        (request as any).session?.user?.id
      );
    }
  }

  /**
   * Authorization middleware
   */
  private async authorizeRequest(
    request: NextRequest,
    config: APIRouteConfig
  ): Promise<NextResponse | null> {
    try {
      const session = (request as any).session;
      if (!session) {
        return null; // Let authentication middleware handle this
      }

      // Check role-based access
      if (config.roles && !config.roles.includes(session.user.role)) {
        return securityErrorHandler.handleAuthzError(
          'Insufficient permissions',
          request,
          session.user.id,
          'role'
        );
      }

      // Check tier-based access
      if (config.tiers && !config.tiers.includes(session.user.tier)) {
        return securityErrorHandler.handleAuthzError(
          'Subscription tier required',
          request,
          session.user.id,
          'tier'
        );
      }

      // Custom validation
      if (config.customValidation) {
        const isValid = await config.customValidation(request, session);
        if (!isValid) {
          return securityErrorHandler.handleAuthzError(
            'Custom validation failed',
            request,
            session.user.id,
            'custom'
          );
        }
      }

      return null;

    } catch (error) {
      return securityErrorHandler.handleAuthzError(
        'Authorization check failed',
        request,
        (request as any).session?.user?.id
      );
    }
  }

  /**
   * Request logging middleware
   */
  private async logRequest(
    request: NextRequest,
    config: APIRouteConfig
  ): Promise<NextResponse | null> {
    try {
      const session = (request as any).session;
      const clientIP = this.getClientIP(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';

      await securityLogger.info('API Request', {
        method: request.method,
        path: request.nextUrl.pathname,
        userId: session?.user?.id,
        ipAddress: clientIP,
        userAgent,
        timestamp: new Date().toISOString(),
        config: {
          requireAuth: config.requireAuth,
          requireCSRF: config.requireCSRF,
          rateLimit: config.rateLimit,
          roles: config.roles,
          tiers: config.tiers
        }
      });

      return null;

    } catch (error) {
      console.error('Request logging failed:', error);
      return null; // Don't block request for logging failures
    }
  }

  /**
   * Validate CSRF token
   */
  private async validateCSRFToken(token: string, request: NextRequest): Promise<boolean> {
    // Implement actual CSRF validation
    // This is a placeholder implementation
    try {
      // In production, validate against stored token
      return token.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Check rate limit
   */
  private async checkRateLimit(clientIP: string, userId?: string, config?: APIRouteConfig): Promise<boolean> {
    // Implement actual rate limiting
    // This is a placeholder implementation
    try {
      // In production, check against rate limit store
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
           request.headers.get('x-real-ip') ||
           request.ip ||
           'unknown';
  }

  /**
   * Create secure API response
   */
  createSecureResponse(data: any, status: number = 200): NextResponse {
    const response = NextResponse.json(data, { status });
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  }

  /**
   * Validate file upload
   */
  async validateFileUpload(
    file: File,
    request: NextRequest
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    try {
      const result = await validateFile(file, file.name);
      
      if (!result.isValid) {
        await securityLogger.warn('File upload validation failed', {
          filename: file.name,
          errors: result.errors,
          warnings: result.warnings,
          ipAddress: this.getClientIP(request),
          userId: (request as any).session?.user?.id
        });
      }

      return {
        isValid: result.isValid,
        errors: result.errors,
        warnings: result.warnings
      };

    } catch (error) {
      await securityLogger.error('File validation error', {
        filename: file.name,
        error: error instanceof Error ? error.message : 'Unknown error',
        ipAddress: this.getClientIP(request)
      });

      return {
        isValid: false,
        errors: ['File validation failed'],
        warnings: []
      };
    }
  }

  /**
   * Get security statistics
   */
  getStats() {
    return {
      registeredRoutes: this.routeConfigs.size,
      activeMiddlewares: this.middlewares.length,
      middlewareNames: this.middlewares.map(m => m.name),
      routeConfigs: Array.from(this.routeConfigs.values()).map(config => ({
        path: config.path,
        method: config.method,
        requireAuth: config.requireAuth,
        requireCSRF: config.requireCSRF,
        rateLimit: config.rateLimit,
        roles: config.roles,
        tiers: config.tiers
      }))
    };
  }
}

// Export singleton instance
export const apiSecurityManager = APISecurityManager.getInstance();

// Export convenience functions
export const secureAPI = (
  config: APIRouteConfig,
  handler: (req: NextRequest) => Promise<NextResponse>
) => {
  // Register the route configuration
  apiSecurityManager.registerRoute(config);
  
  // Return wrapped handler
  return async (req: NextRequest) => {
    return apiSecurityManager.secureRoute(req, handler);
  };
};

export const createSecureResponse = (data: any, status?: number) =>
  apiSecurityManager.createSecureResponse(data, status);

export const validateFileUpload = (file: File, request: NextRequest) =>
  apiSecurityManager.validateFileUpload(file, request);

export const getAPISecurityStats = () => apiSecurityManager.getStats();

// Predefined route configurations
export const authRequired = (roles?: string[], tiers?: string[]) => ({
  path: '/api/route',
  method: 'GET',
  requireAuth: true,
  requireCSRF: true,
  rateLimit: true,
  roles,
  tiers
});

export const publicRoute = () => ({
  path: '/api/route',
  method: 'GET',
  requireAuth: false,
  requireCSRF: false,
  rateLimit: true
});

export const adminOnly = () => ({
  path: '/api/route',
  method: 'GET',
  requireAuth: true,
  requireCSRF: true,
  rateLimit: true,
  roles: ['admin', 'ceo']
});

export const premiumOnly = () => ({
  path: '/api/route',
  method: 'GET',
  requireAuth: true,
  requireCSRF: true,
  rateLimit: true,
  tiers: ['premium', 'enterprise']
});
