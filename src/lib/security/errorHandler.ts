import { NextRequest, NextResponse } from 'next/server';
import { securityLogger } from './logging';

export interface SecurityError {
  code: string;
  message: string;
  status: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'validation' | 'system' | 'security';
  details?: Record<string, any>;
  timestamp: string;
  requestId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  path: string;
  method: string;
}

export interface ErrorResponse {
  error: string;
  code: string;
  requestId: string;
  timestamp: string;
}

export class SecurityErrorHandler {
  private static instance: SecurityErrorHandler;
  private errorCounts = new Map<string, number>();
  private lastReset = Date.now();

  private constructor() {
    // Reset error counts every hour
    setInterval(() => {
      this.errorCounts.clear();
      this.lastReset = Date.now();
    }, 60 * 60 * 1000);
  }

  static getInstance(): SecurityErrorHandler {
    if (!SecurityErrorHandler.instance) {
      SecurityErrorHandler.instance = new SecurityErrorHandler();
    }
    return SecurityErrorHandler.instance;
  }

  /**
   * Handle and log security errors
   */
  async handleError(
    error: Error | string,
    request: NextRequest,
    context: {
      userId?: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      category?: 'authentication' | 'authorization' | 'validation' | 'system' | 'security';
      details?: Record<string, any>;
    } = {}
  ): Promise<NextResponse<ErrorResponse>> {
    const requestId = this.generateRequestId();
    const timestamp = new Date().toISOString();
    
    // Determine error severity and category
    const severity = this.determineSeverity(error, context);
    const category = this.determineCategory(error, context);
    const status = this.determineStatus(severity, category);
    
    // Create security error object
    const securityError: SecurityError = {
      code: this.generateErrorCode(error, category),
      message: this.sanitizeErrorMessage(error),
      status,
      severity,
      category,
      details: context.details,
      timestamp,
      requestId,
      userId: context.userId,
      ipAddress: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      path: request.nextUrl.pathname,
      method: request.method
    };

    // Log the security error
    await this.logSecurityError(securityError);

    // Check for potential security threats
    await this.analyzeSecurityThreat(securityError);

    // Return sanitized error response
    return this.createErrorResponse(securityError);
  }

  /**
   * Handle authentication errors
   */
  async handleAuthError(
    error: Error | string,
    request: NextRequest,
    userId?: string
  ): Promise<NextResponse<ErrorResponse>> {
    return this.handleError(error, request, {
      userId,
      severity: 'high',
      category: 'authentication',
      details: { authAttempt: true }
    });
  }

  /**
   * Handle authorization errors
   */
  async handleAuthzError(
    error: Error | string,
    request: NextRequest,
    userId?: string,
    resource?: string
  ): Promise<NextResponse<ErrorResponse>> {
    return this.handleError(error, request, {
      userId,
      severity: 'medium',
      category: 'authorization',
      details: { resource, accessDenied: true }
    });
  }

  /**
   * Handle validation errors
   */
  async handleValidationError(
    error: Error | string,
    request: NextRequest,
    userId?: string,
    field?: string
  ): Promise<NextResponse<ErrorResponse>> {
    return this.handleError(error, request, {
      userId,
      severity: 'low',
      category: 'validation',
      details: { field, validationFailed: true }
    });
  }

  /**
   * Handle system errors
   */
  async handleSystemError(
    error: Error | string,
    request: NextRequest,
    userId?: string
  ): Promise<NextResponse<ErrorResponse>> {
    return this.handleError(error, request, {
      userId,
      severity: 'medium',
      category: 'system',
      details: { systemError: true }
    });
  }

  /**
   * Determine error severity
   */
  private determineSeverity(
    error: Error | string,
    context: { severity?: 'low' | 'medium' | 'high' | 'critical' }
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (context.severity) return context.severity;

    const errorMessage = error instanceof Error ? error.message : error;
    const lowerMessage = errorMessage.toLowerCase();

    // Critical security issues
    if (lowerMessage.includes('sql injection') || 
        lowerMessage.includes('xss') || 
        lowerMessage.includes('csrf') ||
        lowerMessage.includes('authentication bypass')) {
      return 'critical';
    }

    // High priority issues
    if (lowerMessage.includes('unauthorized') || 
        lowerMessage.includes('forbidden') ||
        lowerMessage.includes('authentication failed')) {
      return 'high';
    }

    // Medium priority issues
    if (lowerMessage.includes('validation') || 
        lowerMessage.includes('invalid input') ||
        lowerMessage.includes('rate limit')) {
      return 'medium';
    }

    // Default to low
    return 'low';
  }

  /**
   * Determine error category
   */
  private determineCategory(
    error: Error | string,
    context: { category?: 'authentication' | 'authorization' | 'validation' | 'system' | 'security' }
  ): 'authentication' | 'authorization' | 'validation' | 'system' | 'security' {
    if (context.category) return context.category;

    const errorMessage = error instanceof Error ? error.message : error;
    const lowerMessage = errorMessage.toLowerCase();

    if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('password')) {
      return 'authentication';
    }

    if (lowerMessage.includes('permission') || lowerMessage.includes('access') || lowerMessage.includes('role')) {
      return 'authorization';
    }

    if (lowerMessage.includes('validation') || lowerMessage.includes('invalid') || lowerMessage.includes('format')) {
      return 'validation';
    }

    if (lowerMessage.includes('security') || lowerMessage.includes('threat') || lowerMessage.includes('attack')) {
      return 'security';
    }

    return 'system';
  }

  /**
   * Determine HTTP status code
   */
  private determineStatus(
    severity: 'low' | 'medium' | 'high' | 'critical',
    category: 'authentication' | 'authorization' | 'validation' | 'system' | 'security'
  ): number {
    // Critical security issues
    if (severity === 'critical') return 500;

    // Authentication errors
    if (category === 'authentication') return 401;

    // Authorization errors
    if (category === 'authorization') return 403;

    // Validation errors
    if (category === 'validation') return 400;

    // High severity system errors
    if (severity === 'high') return 500;

    // Medium severity errors
    if (severity === 'medium') return 422;

    // Low severity errors
    return 400;
  }

  /**
   * Generate error code
   */
  private generateErrorCode(
    error: Error | string,
    category: 'authentication' | 'authorization' | 'validation' | 'system' | 'security'
  ): string {
    const prefix = category.toUpperCase().substring(0, 3);
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Sanitize error message to prevent information leakage
   */
  private sanitizeErrorMessage(error: Error | string): string {
    const message = error instanceof Error ? error.message : error;
    
    // Remove sensitive information
    let sanitized = message
      .replace(/password\s*=\s*['"][^'"]*['"]/gi, 'password=***')
      .replace(/token\s*=\s*['"][^'"]*['"]/gi, 'token=***')
      .replace(/secret\s*=\s*['"][^'"]*['"]/gi, 'secret=***')
      .replace(/key\s*=\s*['"][^'"]*['"]/gi, 'key=***')
      .replace(/api[_-]?key\s*=\s*['"][^'"]*['"]/gi, 'api_key=***')
      .replace(/database\s*=\s*['"][^'"]*['"]/gi, 'database=***')
      .replace(/host\s*=\s*['"][^'"]*['"]/gi, 'host=***')
      .replace(/port\s*=\s*\d+/gi, 'port=***');

    // Remove stack traces and internal paths
    sanitized = sanitized
      .replace(/at\s+.*\s+\(.*\)/g, '')
      .replace(/\/[^\/]*\/node_modules\/[^\/]*/g, '')
      .replace(/\/[^\/]*\/src\/[^\/]*/g, '')
      .replace(/\/[^\/]*\/dist\/[^\/]*/g, '');

    // Truncate very long messages
    if (sanitized.length > 200) {
      sanitized = sanitized.substring(0, 200) + '...';
    }

    return sanitized.trim() || 'An error occurred';
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
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Log security error
   */
  private async logSecurityError(error: SecurityError): Promise<void> {
    try {
      // Log to security logger
      await securityLogger.logSecurityEvent(
        error.category,
        error.severity,
        error.code,
        error.message,
        {
          status: error.status,
          path: error.path,
          method: error.method,
          requestId: error.requestId,
          details: error.details
        },
        {
          userId: error.userId,
          ipAddress: error.ipAddress,
          userAgent: error.userAgent,
          requestId: error.requestId
        }
      );

      // Track error counts for threat analysis
      this.trackError(error);

    } catch (logError) {
      console.error('Failed to log security error:', logError);
    }
  }

  /**
   * Track error for threat analysis
   */
  private trackError(error: SecurityError): void {
    const key = `${error.category}_${error.severity}_${error.ipAddress}`;
    const count = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, count + 1);
  }

  /**
   * Analyze security threats
   */
  private async analyzeSecurityThreat(error: SecurityError): Promise<void> {
    try {
      // Check for brute force attempts
      if (error.category === 'authentication' && error.severity === 'high') {
        const key = `auth_high_${error.ipAddress}`;
        const count = this.errorCounts.get(key) || 0;
        
        if (count > 5) {
          await securityLogger.logSecurityEvent(
            'security',
            'critical',
            'brute_force_detected',
            `Multiple authentication failures from IP ${error.ipAddress}`,
            {
              failureCount: count,
              ipAddress: error.ipAddress,
              timeWindow: '1 hour'
            },
            {
              ipAddress: error.ipAddress,
              requestId: error.requestId
            }
          );
        }
      }

      // Check for suspicious patterns
      if (error.severity === 'critical' || error.category === 'security') {
        await securityLogger.logSecurityEvent(
          'security',
          'critical',
          'security_threat_detected',
          `Critical security error: ${error.message}`,
          {
            errorCode: error.code,
            category: error.category,
            severity: error.severity,
            path: error.path,
            method: error.method
          },
          {
            userId: error.userId,
            ipAddress: error.ipAddress,
            requestId: error.requestId
          }
        );
      }

    } catch (analysisError) {
      console.error('Failed to analyze security threat:', analysisError);
    }
  }

  /**
   * Create error response
   */
  private createErrorResponse(error: SecurityError): NextResponse<ErrorResponse> {
    const response: ErrorResponse = {
      error: error.message,
      code: error.code,
      requestId: error.requestId,
      timestamp: error.timestamp
    };

    return NextResponse.json(response, { status: error.status });
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    
    const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
    const recentErrors = Array.from(this.errorCounts.entries())
      .filter(([key, count]) => {
        // This is a simplified check - in production you'd track timestamps
        return count > 0;
      })
      .reduce((sum, [key, count]) => sum + count, 0);

    return {
      totalErrors,
      recentErrors,
      errorCounts: Object.fromEntries(this.errorCounts),
      lastReset: new Date(this.lastReset).toISOString()
    };
  }
}

// Export singleton instance
export const securityErrorHandler = SecurityErrorHandler.getInstance();

// Export convenience functions
export const handleSecurityError = (
  error: Error | string,
  request: NextRequest,
  context?: {
    userId?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    category?: 'authentication' | 'authorization' | 'validation' | 'system' | 'security';
    details?: Record<string, any>;
  }
) => securityErrorHandler.handleError(error, request, context);

export const handleAuthError = (error: Error | string, request: NextRequest, userId?: string) =>
  securityErrorHandler.handleAuthError(error, request, userId);

export const handleAuthzError = (error: Error | string, request: NextRequest, userId?: string, resource?: string) =>
  securityErrorHandler.handleAuthzError(error, request, userId, resource);

export const handleValidationError = (error: Error | string, request: NextRequest, userId?: string, field?: string) =>
  securityErrorHandler.handleValidationError(error, request, userId, field);

export const handleSystemError = (error: Error | string, request: NextRequest, userId?: string) =>
  securityErrorHandler.handleSystemError(error, request, userId);

export const getErrorStats = () => securityErrorHandler.getErrorStats();
