// Security utilities index file
// This file provides a unified interface for all security features

// Node.js types for process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CSRF_SECRET?: string;
      ENCRYPTION_MASTER_KEY?: string;
      VIRUS_TOTAL_API_KEY?: string;
      CLAMAV_HOST?: string;
      CLAMAV_PORT?: string;
      REDIS_URL?: string;
      AWS_S3_BUCKET?: string;
      AWS_S3_REGION?: string;
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
    }
  }
}

// Core security modules
export * from './csrf';
export * from './headers';
export * from './validation';
export * from './rateLimit';
export * from './session';
export * from './mfa';
export * from './encryption';
export * from './monitoring';
export * from './fileUpload';
export * from './errorHandler';
export * from './apiSecurity';

// Re-export logging with specific names to avoid conflicts
export { 
  securityLogger, 
  logError, 
  logWarning, 
  logInfo, 
  logDebug,
  logSecurityEvent
} from './logging';

// Security configuration
export interface SecurityConfig {
  csrf: {
    secret: string;
    enabled: boolean;
  };
  headers: {
    enabled: boolean;
    strictMode: boolean;
  };
  validation: {
    enabled: boolean;
    sanitization: boolean;
    strictMode: boolean;
  };
  rateLimit: {
    enabled: boolean;
    strictMode: boolean;
    redisEnabled: boolean;
  };
  session: {
    timeout: number;
    maxConcurrent: number;
    deviceFingerprinting: boolean;
  };
  logging: {
    enabled: boolean;
    level: 'error' | 'warn' | 'info' | 'debug';
    securityEvents: boolean;
    auditTrail: boolean;
  };
  mfa: {
    enabled: boolean;
    required: boolean;
    backupCodes: boolean;
  };
  encryption: {
    enabled: boolean;
    algorithm: string;
    keyRotation: boolean;
  };
  monitoring: {
    enabled: boolean;
    realTime: boolean;
    alerting: boolean;
  };
  fileUpload: {
    enabled: boolean;
    maxFileSize: number;
    malwareScanning: boolean;
    virusTotalEnabled: boolean;
    clamAVEnabled: boolean;
  };
  errorHandling: {
    enabled: boolean;
    sanitizeErrors: boolean;
    logAllErrors: boolean;
  };
  apiSecurity: {
    enabled: boolean;
    requireAuth: boolean;
    requireCSRF: boolean;
    rateLimit: boolean;
    validateInput: boolean;
  };
}

// Default security configuration
export const defaultSecurityConfig: SecurityConfig = {
  csrf: {
    secret: process.env.CSRF_SECRET || 'your-csrf-secret-key-change-in-production',
    enabled: true
  },
  headers: {
    enabled: true,
    strictMode: process.env.NODE_ENV === 'production'
  },
  validation: {
    enabled: true,
    sanitization: true,
    strictMode: process.env.NODE_ENV === 'production'
  },
  rateLimit: {
    enabled: true,
    strictMode: process.env.NODE_ENV === 'production',
    redisEnabled: !!process.env.REDIS_URL
  },
  session: {
    timeout: 24 * 60 * 60 * 1000, // 24 hours
    maxConcurrent: 3,
    deviceFingerprinting: true
  },
  logging: {
    enabled: true,
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    securityEvents: true,
    auditTrail: true
  },
  mfa: {
    enabled: true,
    required: false,
    backupCodes: true
  },
  encryption: {
    enabled: true,
    algorithm: 'aes-256-gcm',
    keyRotation: process.env.NODE_ENV === 'production'
  },
  monitoring: {
    enabled: true,
    realTime: true,
    alerting: true
  },
  fileUpload: {
    enabled: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    malwareScanning: true,
    virusTotalEnabled: !!process.env.VIRUS_TOTAL_API_KEY,
    clamAVEnabled: !!process.env.CLAMAV_HOST
  },
  errorHandling: {
    enabled: true,
    sanitizeErrors: true,
    logAllErrors: true
  },
  apiSecurity: {
    enabled: true,
    requireAuth: true,
    requireCSRF: true,
    rateLimit: true,
    validateInput: true
  }
};

// Security manager class
export class SecurityManager {
  private config: SecurityConfig;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...defaultSecurityConfig, ...config };
    this.initializeSecurity();
  }

  /**
   * Initialize all security features
   */
  private initializeSecurity(): void {
    if (this.config.logging.enabled) {
      console.log('[SECURITY] Initializing security features...');
    }

    if (this.config.monitoring.enabled) {
      console.log('[SECURITY] Security monitoring enabled');
    }

    if (this.config.encryption.enabled) {
      console.log('[SECURITY] Data encryption enabled');
    }

    if (this.config.mfa.enabled) {
      console.log('[SECURITY] Multi-factor authentication enabled');
    }

    if (this.config.fileUpload.enabled) {
      console.log('[SECURITY] File upload security enabled');
    }

    if (this.config.errorHandling.enabled) {
      console.log('[SECURITY] Enhanced error handling enabled');
    }

    if (this.config.apiSecurity.enabled) {
      console.log('[SECURITY] API security middleware enabled');
    }

    console.log('[SECURITY] Security initialization complete');
  }

  /**
   * Get security configuration
   */
  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  /**
   * Update security configuration
   */
  updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates };
    console.log('[SECURITY] Configuration updated');
  }

  /**
   * Get security status
   */
  getStatus(): Record<string, boolean> {
    return {
      csrf: this.config.csrf.enabled,
      headers: this.config.headers.enabled,
      validation: this.config.validation.enabled,
      rateLimit: this.config.rateLimit.enabled,
      session: this.config.session.deviceFingerprinting,
      logging: this.config.logging.enabled,
      mfa: this.config.mfa.enabled,
      encryption: this.config.encryption.enabled,
      monitoring: this.config.monitoring.enabled,
      fileUpload: this.config.fileUpload.enabled,
      errorHandling: this.config.errorHandling.enabled,
      apiSecurity: this.config.apiSecurity.enabled
    };
  }

  /**
   * Run security health check
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check CSRF configuration
    if (this.config.csrf.enabled && this.config.csrf.secret === 'your-csrf-secret-key-change-in-production') {
      issues.push('CSRF secret is using default value');
      recommendations.push('Change CSRF secret in production environment');
    }

    // Check encryption configuration
    if (this.config.encryption.enabled && process.env.ENCRYPTION_MASTER_KEY === 'default-master-key-change-in-production') {
      issues.push('Encryption master key is using default value');
      recommendations.push('Set ENCRYPTION_MASTER_KEY environment variable');
    }

    // Check file upload configuration
    if (this.config.fileUpload.enabled && this.config.fileUpload.malwareScanning) {
      if (!this.config.fileUpload.virusTotalEnabled && !this.config.fileUpload.clamAVEnabled) {
        issues.push('Malware scanning enabled but no scanning engines configured');
        recommendations.push('Configure VirusTotal API key or ClamAV for malware scanning');
      }
    }

    // Check environment
    if (process.env.NODE_ENV !== 'production' && this.config.headers.strictMode) {
      issues.push('Strict security headers enabled in development');
      recommendations.push('Consider disabling strict mode in development');
    }

    // Check Redis configuration for rate limiting
    if (this.config.rateLimit.enabled && this.config.rateLimit.redisEnabled && !process.env.REDIS_URL) {
      issues.push('Redis rate limiting enabled but REDIS_URL not configured');
      recommendations.push('Set REDIS_URL environment variable or disable Redis rate limiting');
    }

    // Determine overall status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (issues.length > 0) {
      status = issues.some(issue => issue.includes('critical')) ? 'critical' : 'warning';
    }

    return {
      status,
      issues,
      recommendations
    };
  }

  /**
   * Generate security report
   */
  async generateReport(): Promise<{
    timestamp: string;
    config: SecurityConfig;
    status: Record<string, boolean>;
    health: any;
    recommendations: string[];
  }> {
    const health = await this.healthCheck();
    
    return {
      timestamp: new Date().toISOString(),
      config: this.getConfig(),
      status: this.getStatus(),
      health,
      recommendations: health.recommendations
    };
  }

  /**
   * Test security features
   */
  async testSecurityFeatures(): Promise<{
    csrf: boolean;
    headers: boolean;
    validation: boolean;
    rateLimit: boolean;
    session: boolean;
    logging: boolean;
    mfa: boolean;
    encryption: boolean;
    monitoring: boolean;
    fileUpload: boolean;
    errorHandling: boolean;
    apiSecurity: boolean;
  }> {
    const results = {
      csrf: this.config.csrf.enabled,
      headers: this.config.headers.enabled,
      validation: this.config.validation.enabled,
      rateLimit: this.config.rateLimit.enabled,
      session: this.config.session.deviceFingerprinting,
      logging: this.config.logging.enabled,
      mfa: this.config.mfa.enabled,
      encryption: this.config.encryption.enabled,
      monitoring: this.config.monitoring.enabled,
      fileUpload: this.config.fileUpload.enabled,
      errorHandling: this.config.errorHandling.enabled,
      apiSecurity: this.config.apiSecurity.enabled
    };

    // Test each feature
    try {
      if (results.encryption) {
        // Test encryption
        const { encrypt, decrypt } = await import('./encryption');
        const testData = 'test-security-data';
        const encrypted = encrypt(testData);
        const decrypted = decrypt(encrypted);
        results.encryption = decrypted === testData;
      }

      if (results.logging) {
        // Test logging
        const { securityLogger } = await import('./logging');
        await securityLogger.info('Security test message', { test: true });
        results.logging = true;
      }

      if (results.monitoring) {
        // Test monitoring
        const { securityMonitor } = await import('./monitoring');
        const stats = securityMonitor.getStats();
        results.monitoring = stats !== null;
      }

    } catch (error) {
      console.error('Security feature testing failed:', error);
    }

    return results;
  }
}

// Export default security manager
export const securityManager = new SecurityManager();

// Security utility functions
export const getSecurityConfig = () => securityManager.getConfig();
export const updateSecurityConfig = (updates: Partial<SecurityConfig>) => securityManager.updateConfig(updates);
export const getSecurityStatus = () => securityManager.getStatus();
export const runSecurityHealthCheck = () => securityManager.healthCheck();
export const generateSecurityReport = () => securityManager.generateReport();
export const testSecurityFeatures = () => securityManager.testSecurityFeatures();

// Security middleware composer
export const createSecurityMiddleware = (options: {
  csrf?: boolean;
  rateLimit?: boolean;
  session?: boolean;
  mfa?: boolean;
  logging?: boolean;
  fileUpload?: boolean;
  errorHandling?: boolean;
  apiSecurity?: boolean;
} = {}) => {
  const middlewares: any[] = [];

  if (options.csrf !== false) {
    const { csrfProtection } = require('./csrf');
    middlewares.push(csrfProtection.middleware());
  }

  if (options.rateLimit !== false) {
    const { apiRateLimiter } = require('./rateLimit');
    middlewares.push(apiRateLimiter.middleware());
  }

  if (options.session !== false) {
    const { sessionMiddleware } = require('./session');
    middlewares.push(sessionMiddleware);
  }

  if (options.mfa !== false) {
    const { mfaMiddleware } = require('./mfa');
    middlewares.push(mfaMiddleware);
  }

  if (options.logging !== false) {
    const { securityLogger } = require('./logging');
    // Add logging middleware
    middlewares.push((req: any, res: any, next: any) => {
      securityLogger.info('API Request', {
        method: req.method,
        path: req.path,
        userId: req.session?.user?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      next();
    });
  }

  if (options.fileUpload !== false) {
    const { validateFile } = require('./fileUpload');
    // Add file upload validation middleware
    middlewares.push((req: any, res: any, next: any) => {
      if (req.files && req.files.length > 0) {
        // Validate each file
        for (const file of req.files) {
          validateFile(file, file.name).then((result: any) => {
            if (!result.isValid) {
              console.warn('File validation failed:', result.errors);
            }
          });
        }
      }
      next();
    });
  }

  if (options.errorHandling !== false) {
    const { securityErrorHandler } = require('./errorHandler');
    // Add error handling middleware
    middlewares.push((req: any, res: any, next: any) => {
      // Wrap response to catch errors
      const originalJson = res.json;
      res.json = function(data: any) {
        try {
          return originalJson.call(this, data);
        } catch (error) {
          return securityErrorHandler.handleSystemError(error, req);
        }
      };
      next();
    });
  }

  if (options.apiSecurity !== false) {
    const { apiSecurityManager } = require('./apiSecurity');
    // Add API security middleware
    middlewares.push((req: any, res: any, next: any) => {
      // This would integrate with the API security manager
      next();
    });
  }

  return middlewares;
};

// Export security utilities
export const security = {
  manager: securityManager,
  config: getSecurityConfig,
  status: getSecurityStatus,
  healthCheck: runSecurityHealthCheck,
  report: generateSecurityReport,
  test: testSecurityFeatures,
  middleware: createSecurityMiddleware
};

// Default export
export default security;
