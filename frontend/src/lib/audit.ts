import mongoose from 'mongoose';

// Audit log interface
export interface IAuditLog {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'other';
  outcome: 'success' | 'failure' | 'partial';
  metadata: Record<string, any>;
}

// Audit log schema
const auditLogSchema = new mongoose.Schema<IAuditLog>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  resource: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  resourceId: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
    required: true,
    trim: true,
  },
  userAgent: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
    index: true,
  },
  category: {
    type: String,
    enum: ['authentication', 'authorization', 'data_access', 'data_modification', 'system', 'other'],
    default: 'other',
    index: true,
  },
  outcome: {
    type: String,
    enum: ['success', 'failure', 'partial'],
    default: 'success',
    index: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Indexes for better query performance
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ category: 1, timestamp: -1 });
auditLogSchema.index({ outcome: 1, timestamp: -1 });

// Create and export the model
const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

// Audit logging functions
export const logAudit = async (
  userId: mongoose.Types.ObjectId,
  action: string,
  resource: string,
  resourceId: string,
  details: Record<string, any> = {},
  ipAddress: string = 'unknown',
  userAgent: string = 'unknown',
  severity: IAuditLog['severity'] = 'low',
  category: IAuditLog['category'] = 'other',
  outcome: IAuditLog['outcome'] = 'success',
  metadata: Record<string, any> = {}
): Promise<void> => {
  try {
    const auditLog = new AuditLog({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      severity,
      category,
      outcome,
      metadata,
    });

    await auditLog.save();
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw - audit logging should not break the main application flow
  }
};

// Get audit logs with filtering
export const getAuditLogs = async (
  filter: {
    userId?: mongoose.Types.ObjectId;
    action?: string;
    resource?: string;
    resourceId?: string;
    severity?: IAuditLog['severity'];
    category?: IAuditLog['category'];
    outcome?: IAuditLog['outcome'];
    startDate?: Date;
    endDate?: Date;
  } = {},
  limit: number = 100,
  skip: number = 0
): Promise<IAuditLog[]> => {
  try {
    const query: any = {};

    if (filter.userId) query.userId = filter.userId;
    if (filter.action) query.action = filter.action;
    if (filter.resource) query.resource = filter.resource;
    if (filter.resourceId) query.resourceId = filter.resourceId;
    if (filter.severity) query.severity = filter.severity;
    if (filter.category) query.category = filter.category;
    if (filter.outcome) query.outcome = filter.outcome;

    if (filter.startDate || filter.endDate) {
      query.timestamp = {};
      if (filter.startDate) query.timestamp.$gte = filter.startDate;
      if (filter.endDate) query.timestamp.$lte = filter.endDate;
    }

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .populate('userId', 'name email')
      .lean();

    return logs as IAuditLog[];
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    throw new Error('Failed to retrieve audit logs');
  }
};

// Get audit statistics
export const getAuditStats = async (
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalLogs: number;
  logsBySeverity: Record<string, number>;
  logsByCategory: Record<string, number>;
  logsByOutcome: Record<string, number>;
  logsByAction: Record<string, number>;
}> => {
  try {
    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;
    }

    const matchStage = dateFilter.$gte || dateFilter.$lte ? { timestamp: dateFilter } : {};

    const stats = await AuditLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalLogs: { $sum: 1 },
          logsBySeverity: {
            $push: '$severity'
          },
          logsByCategory: {
            $push: '$category'
          },
          logsByOutcome: {
            $push: '$outcome'
          },
          logsByAction: {
            $push: '$action'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return {
        totalLogs: 0,
        logsBySeverity: {},
        logsByCategory: {},
        logsByOutcome: {},
        logsByAction: {},
      };
    }

    const result = stats[0];
    
    // Count occurrences
    const countOccurrences = (arr: string[]) => {
      return arr.reduce((acc: Record<string, number>, val: string) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
    };

    return {
      totalLogs: result.totalLogs,
      logsBySeverity: countOccurrences(result.logsBySeverity),
      logsByCategory: countOccurrences(result.logsByCategory),
      logsByOutcome: countOccurrences(result.logsByOutcome),
      logsByAction: countOccurrences(result.logsByAction),
    };
  } catch (error) {
    console.error('Failed to get audit stats:', error);
    throw new Error('Failed to retrieve audit statistics');
  }
};

// Clean old audit logs
export const cleanOldAuditLogs = async (daysToKeep: number = 90): Promise<number> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await AuditLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    return result.deletedCount || 0;
  } catch (error) {
    console.error('Failed to clean old audit logs:', error);
    throw new Error('Failed to clean old audit logs');
  }
};

// Export the model and functions
export default AuditLog;
