import { AuditLog, IAuditLog } from '../models/AuditLog';
import { connectToDatabase } from './mongodb';

export interface AuditLogOptions {
  // User information
  userId: string;
  userEmail?: string;
  userRole?: string;
  
  // Action details
  action: string;
  details: Record<string, any>;
  
  // Resource information
  resourceType?: string;
  resourceId?: string;
  
  // Severity and category
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category?: 'user' | 'system' | 'security' | 'data' | 'billing' | 'project';
  
  // Request context
  ipAddress?: string;
  userAgent?: string;
  
  // Additional metadata
  metadata?: Record<string, any>;
  
  // Performance options
  skipDatabase?: boolean; // For testing or when DB is unavailable
  logToConsole?: boolean; // For development debugging
}

export interface AuditLogResult {
  success: boolean;
  auditLogId?: string;
  error?: string;
  timestamp: Date;
}

/**
 * Log an audit event to MongoDB
 * @param options - Audit log options
 * @returns Promise<AuditLogResult>
 */
export async function logAudit(options: AuditLogOptions): Promise<AuditLogResult> {
  const {
    userId,
    userEmail,
    userRole,
    action,
    details,
    resourceType,
    resourceId,
    severity,
    category,
    ipAddress,
    userAgent,
    metadata,
    skipDatabase = false,
    logToConsole = false
  } = options;

  const timestamp = new Date();
  const auditLogId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Console logging for development
  if (logToConsole) {
    console.log('🔍 AUDIT LOG:', {
      id: auditLogId,
      timestamp: timestamp.toISOString(),
      userId,
      action,
      details,
      severity: severity || 'low',
      category: category || 'user'
    });
  }

  // Skip database if requested (useful for testing)
  if (skipDatabase) {
    return {
      success: true,
      auditLogId,
      timestamp
    };
  }

  try {
    // Connect to database
    await connectToDatabase();

    // Create audit log entry
    const auditLog = new AuditLog({
      userId,
      userEmail,
      userRole,
      action,
      details,
      resourceType,
      resourceId,
      severity: severity || 'low',
      category: category || 'user',
      ipAddress,
      userAgent,
      metadata,
      timestamp
    });

    // Save to database
    await auditLog.save();

    return {
      success: true,
      auditLogId: auditLog._id.toString(),
      timestamp
    };

  } catch (error) {
    console.error('Failed to log audit event:', error);
    
    // Return error but don't throw to avoid breaking application flow
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp
    };
  }
}

/**
 * Convenience function for logging user actions
 */
export async function logUserAction(
  userId: string,
  action: string,
  details: Record<string, any>,
  options?: Partial<AuditLogOptions>
): Promise<AuditLogResult> {
  return logAudit({
    userId,
    action,
    details,
    category: 'user',
    ...options
  });
}

/**
 * Convenience function for logging security events
 */
export async function logSecurityEvent(
  userId: string,
  action: string,
  details: Record<string, any>,
  options?: Partial<AuditLogOptions>
): Promise<AuditLogResult> {
  return logAudit({
    userId,
    action,
    details,
    category: 'security',
    severity: 'high',
    ...options
  });
}

/**
 * Convenience function for logging project actions
 */
export async function logProjectAction(
  userId: string,
  action: string,
  projectId: string,
  details: Record<string, any>,
  options?: Partial<AuditLogOptions>
): Promise<AuditLogResult> {
  return logAudit({
    userId,
    action,
    details,
    resourceType: 'project',
    resourceId: projectId,
    category: 'project',
    ...options
  });
}

/**
 * Convenience function for logging billing events
 */
export async function logBillingEvent(
  userId: string,
  action: string,
  details: Record<string, any>,
  options?: Partial<AuditLogOptions>
): Promise<AuditLogResult> {
  return logAudit({
    userId,
    action,
    details,
    category: 'billing',
    ...options
  });
}

/**
 * Convenience function for logging system events
 */
export async function logSystemEvent(
  action: string,
  details: Record<string, any>,
  options?: Partial<AuditLogOptions>
): Promise<AuditLogResult> {
  return logAudit({
    userId: 'system',
    action,
    details,
    category: 'system',
    ...options
  });
}

/**
 * Batch log multiple audit events
 */
export async function logAuditBatch(
  auditEvents: Omit<AuditLogOptions, 'skipDatabase' | 'logToConsole'>[]
): Promise<AuditLogResult[]> {
  const results: AuditLogResult[] = [];
  
  for (const event of auditEvents) {
    try {
      const result = await logAudit(event);
      results.push(result);
    } catch (error) {
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  }
  
  return results;
}

/**
 * Get audit logs with filtering and pagination
 */
export async function getAuditLogs(options: {
  userId?: string;
  action?: string;
  category?: string;
  severity?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
}): Promise<{ logs: IAuditLog[]; total: number }> {
  try {
    await connectToDatabase();
    
    const {
      userId,
      action,
      category,
      severity,
      resourceType,
      resourceId,
      startDate,
      endDate,
      limit = 100,
      skip = 0
    } = options;

    // Build query
    const query: any = {};
    
    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (resourceType) query.resourceType = resourceType;
    if (resourceId) query.resourceId = resourceId;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }

    // Get total count
    const total = await AuditLog.countDocuments(query);
    
    // Get logs with pagination
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return { logs, total };
    
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    throw error;
  }
}

/**
 * Get audit statistics
 */
export async function getAuditStats(startDate?: Date, endDate?: Date) {
  try {
    await connectToDatabase();
    const stats = await AuditLog.getAuditStats(startDate, endDate);
    return stats[0] || {
      totalLogs: 0,
      uniqueUsers: 0,
      uniqueActions: 0,
      uniqueCategories: 0,
      uniqueSeverities: 0
    };
  } catch (error) {
    console.error('Failed to get audit stats:', error);
    throw error;
  }
}

/**
 * Clean old audit logs
 */
export async function cleanOldAuditLogs(daysOld: number = 90): Promise<{ deletedCount: number }> {
  try {
    await connectToDatabase();
    const result = await AuditLog.cleanOldLogs(daysOld);
    return { deletedCount: result.deletedCount || 0 };
  } catch (error) {
    console.error('Failed to clean old audit logs:', error);
    throw error;
  }
}

/**
 * Export audit logs to JSON (for compliance/backup)
 */
export async function exportAuditLogs(
  startDate: Date,
  endDate: Date,
  format: 'json' | 'csv' = 'json'
): Promise<string> {
  try {
    await connectToDatabase();
    
    const logs = await AuditLog.find({
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .sort({ timestamp: -1 })
    .lean();

    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    } else {
      // Simple CSV export
      const headers = ['timestamp', 'userId', 'action', 'category', 'severity', 'details'];
      const csvRows = [
        headers.join(','),
        ...logs.map(log => [
          log.timestamp.toISOString(),
          log.userId,
          log.action,
          log.category,
          log.severity,
          JSON.stringify(log.details)
        ].join(','))
      ];
      return csvRows.join('\n');
    }
    
  } catch (error) {
    console.error('Failed to export audit logs:', error);
    throw error;
  }
}

// Export types
export type { AuditLogOptions, AuditLogResult };
