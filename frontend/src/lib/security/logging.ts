export interface LogLevel {
  error: 0;
  warn: 1;
  info: 2;
  debug: 3;
}

export interface LogEntry {
  timestamp: string;
  level: keyof LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  error?: Error;
  metadata?: Record<string, any>;
}

export interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'data_access' | 'system' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  event: string;
  description: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface LogTransport {
  log(entry: LogEntry): Promise<void>;
  logSecurityEvent(event: SecurityEvent): Promise<void>;
}

// Console transport for development
class ConsoleTransport implements LogTransport {
  async log(entry: LogEntry): Promise<void> {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = entry.level.toUpperCase();
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const userId = entry.userId ? ` [User: ${entry.userId}]` : '';
    
    console.log(`[${timestamp}] ${level}${userId}: ${entry.message}${context}`);
    
    if (entry.error) {
      console.error('Error details:', entry.error);
    }
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const timestamp = new Date(event.timestamp).toISOString();
    const severity = event.severity.toUpperCase();
    const userId = event.userId ? ` [User: ${event.userId}]` : '';
    
    console.warn(`[${timestamp}] SECURITY ${severity}${userId}: ${event.event} - ${event.description}`);
    console.warn('Event details:', event.details);
  }
}

// File transport for production
class FileTransport implements LogTransport {
  private logQueue: (LogEntry | SecurityEvent)[] = [];
  private isProcessing = false;

  constructor() {
    // Set up periodic log flushing
    setInterval(() => this.flushLogs(), 5000);
  }

  async log(entry: LogEntry): Promise<void> {
    this.logQueue.push(entry);
    
    if (this.logQueue.length >= 100) {
      await this.flushLogs();
    }
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    this.logQueue.push(event);
    
    // Immediately flush security events
    await this.flushLogs();
  }

  private async flushLogs(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    
    try {
      const logs = [...this.logQueue];
      this.logQueue = [];

      // In a real implementation, this would write to files or send to a log service
      for (const log of logs) {
        if ('level' in log) {
          // Regular log entry
          await this.writeToFile('application.log', JSON.stringify(log) + '\n');
        } else {
          // Security event
          await this.writeToFile('security.log', JSON.stringify(log) + '\n');
        }
      }
    } catch (error) {
      console.error('Failed to flush logs:', error);
      // Put logs back in queue
      this.logQueue.unshift(...this.logQueue);
    } finally {
      this.isProcessing = false;
    }
  }

  private async writeToFile(filename: string, content: string): Promise<void> {
    // In a real implementation, this would write to the filesystem
    // For now, we'll just simulate it
    console.log(`[FILE] Writing to ${filename}:`, content.trim());
  }
}

// Main logger class
export class SecurityLogger {
  private transports: LogTransport[] = [];
  private requestIdCounter = 0;

  constructor(transports: LogTransport[] = [new ConsoleTransport()]) {
    this.transports = transports;
  }

  /**
   * Add a new transport
   */
  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  /**
   * Generate a unique request ID
   */
  generateRequestId(): string {
    return `req_${Date.now()}_${++this.requestIdCounter}`;
  }

  /**
   * Log a message
   */
  async log(
    level: keyof LogLevel,
    message: string,
    context?: Record<string, any>,
    metadata?: {
      userId?: string;
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
      requestId?: string;
      error?: Error;
    }
  ): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      ...metadata
    };

    await Promise.all(
      this.transports.map(transport => transport.log(entry))
    );
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    type: SecurityEvent['type'],
    severity: SecurityEvent['severity'],
    event: string,
    description: string,
    details: Record<string, any>,
    metadata?: {
      userId?: string;
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
      requestId?: string;
    }
  ): Promise<void> {
    const securityEvent: SecurityEvent = {
      type,
      severity,
      event,
      description,
      details,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    await Promise.all(
      this.transports.map(transport => transport.logSecurityEvent(securityEvent))
    );
  }

  /**
   * Convenience methods for different log levels
   */
  async error(message: string, context?: Record<string, any>, metadata?: any): Promise<void> {
    return this.log('error', message, context, metadata);
  }

  async warn(message: string, context?: Record<string, any>, metadata?: any): Promise<void> {
    return this.log('warn', message, context, metadata);
  }

  async info(message: string, context?: Record<string, any>, metadata?: any): Promise<void> {
    return this.log('info', message, context, metadata);
  }

  async debug(message: string, context?: Record<string, any>, metadata?: any): Promise<void> {
    return this.log('debug', message, context, metadata);
  }

  /**
   * Log authentication events
   */
  async logAuthentication(
    event: 'login_success' | 'login_failure' | 'logout' | 'password_change' | 'mfa_enabled' | 'mfa_disabled',
    userId: string,
    details: Record<string, any>,
    metadata?: any
  ): Promise<void> {
    const severity = event.includes('failure') ? 'high' : 'low';
    const description = `Authentication event: ${event}`;
    
    await this.logSecurityEvent('authentication', severity, event, description, details, {
      userId,
      ...metadata
    });
  }

  /**
   * Log authorization events
   */
  async logAuthorization(
    event: 'access_granted' | 'access_denied' | 'role_change' | 'permission_update',
    userId: string,
    resource: string,
    details: Record<string, any>,
    metadata?: any
  ): Promise<void> {
    const severity = event.includes('denied') ? 'medium' : 'low';
    const description = `Authorization event: ${event} for resource ${resource}`;
    
    await this.logSecurityEvent('authorization', severity, event, description, {
      resource,
      ...details
    }, {
      userId,
      ...metadata
    });
  }

  /**
   * Log data access events
   */
  async logDataAccess(
    event: 'data_read' | 'data_write' | 'data_delete' | 'data_export',
    userId: string,
    resource: string,
    details: Record<string, any>,
    metadata?: any
  ): Promise<void> {
    const severity = event.includes('delete') || event.includes('export') ? 'medium' : 'low';
    const description = `Data access event: ${event} on resource ${resource}`;
    
    await this.logSecurityEvent('data_access', severity, event, description, {
      resource,
      ...details
    }, {
      userId,
      ...metadata
    });
  }

  /**
   * Log system events
   */
  async logSystemEvent(
    event: 'startup' | 'shutdown' | 'maintenance' | 'backup' | 'update',
    details: Record<string, any>
  ): Promise<void> {
    const severity = event.includes('shutdown') || event.includes('update') ? 'medium' : 'low';
    const description = `System event: ${event}`;
    
    await this.logSecurityEvent('system', severity, event, description, details);
  }

  /**
   * Log security incidents
   */
  async logSecurityIncident(
    event: 'suspicious_activity' | 'brute_force_attempt' | 'data_breach' | 'malware_detected',
    severity: 'high' | 'critical',
    description: string,
    details: Record<string, any>,
    metadata?: any
  ): Promise<void> {
    await this.logSecurityEvent('security', severity, event, description, details, metadata);
  }
}

// Export default logger instance
export const securityLogger = new SecurityLogger();

// Export convenience functions
export const logError = (message: string, context?: Record<string, any>, metadata?: any) =>
  securityLogger.error(message, context, metadata);

export const logWarning = (message: string, context?: Record<string, any>, metadata?: any) =>
  securityLogger.warn(message, context, metadata);

export const logInfo = (message: string, context?: Record<string, any>, metadata?: any) =>
  securityLogger.info(message, context, metadata);

export const logDebug = (message: string, context?: Record<string, any>, metadata?: any) =>
  securityLogger.debug(message, context, metadata);

export const logSecurityEvent = (
  type: SecurityEvent['type'],
  severity: SecurityEvent['severity'],
  event: string,
  description: string,
  details: Record<string, any>,
  metadata?: any
) => securityLogger.logSecurityEvent(type, severity, event, description, details, metadata);
