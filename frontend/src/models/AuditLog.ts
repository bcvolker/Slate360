import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  userId: string;
  userEmail?: string;
  userRole?: string;
  action: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  resourceType?: string;
  resourceId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'user' | 'system' | 'security' | 'data' | 'billing' | 'project';
  timestamp: Date;
  metadata?: Record<string, any>;
}

const auditLogSchema = new Schema<IAuditLog>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    index: true
  },
  userRole: {
    type: String,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  details: {
    type: Schema.Types.Mixed,
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  resourceType: {
    type: String,
    index: true
  },
  resourceId: {
    type: String,
    index: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
    index: true
  },
  category: {
    type: String,
    enum: ['user', 'system', 'security', 'data', 'billing', 'project'],
    default: 'user',
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Compound indexes for common queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ category: 1, severity: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1, timestamp: -1 });

// TTL index to automatically delete old logs (optional)
// auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// Virtual for formatted timestamp
auditLogSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toISOString();
});

// Instance method to get human-readable action description
auditLogSchema.methods.getActionDescription = function(): string {
  const actionMap: Record<string, string> = {
    'user.login': 'User logged in',
    'user.logout': 'User logged out',
    'user.register': 'User registered',
    'user.update': 'User profile updated',
    'user.delete': 'User deleted',
    'user.role_change': 'User role changed',
    'user.tier_change': 'User tier changed',
    'project.create': 'Project created',
    'project.update': 'Project updated',
    'project.delete': 'Project deleted',
    'project.status_change': 'Project status changed',
    'billing.subscription_created': 'Subscription created',
    'billing.subscription_updated': 'Subscription updated',
    'billing.subscription_cancelled': 'Subscription cancelled',
    'billing.payment_success': 'Payment successful',
    'billing.payment_failed': 'Payment failed',
    'system.backup': 'System backup performed',
    'system.maintenance': 'System maintenance',
    'security.login_attempt': 'Login attempt',
    'security.password_reset': 'Password reset',
    'security.permission_denied': 'Permission denied',
    'data.export': 'Data exported',
    'data.import': 'Data imported',
    'data.sync': 'Data synchronized'
  };
  
  return actionMap[this.action] || this.action;
};

// Static method to get audit logs by user
auditLogSchema.statics.getUserAuditLogs = function(
  userId: string,
  limit: number = 100,
  skip: number = 0
) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get audit logs by action
auditLogSchema.statics.getActionAuditLogs = function(
  action: string,
  limit: number = 100,
  skip: number = 0
) {
  return this.find({ action })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get audit logs by category and severity
auditLogSchema.statics.getCategoryAuditLogs = function(
  category: string,
  severity?: string,
  limit: number = 100,
  skip: number = 0
) {
  const query: any = { category };
  if (severity) query.severity = severity;
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get audit logs by date range
auditLogSchema.statics.getAuditLogsByDateRange = function(
  startDate: Date,
  endDate: Date,
  limit: number = 1000,
  skip: number = 0
) {
  return this.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get audit statistics
auditLogSchema.statics.getAuditStats = function(
  startDate?: Date,
  endDate?: Date
) {
  const matchStage: any = {};
  
  if (startDate && endDate) {
    matchStage.timestamp = {
      $gte: startDate,
      $lte: endDate
    };
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalLogs: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        actions: { $addToSet: '$action' },
        categories: { $addToSet: '$category' },
        severities: { $addToSet: '$severity' }
      }
    },
    {
      $project: {
        _id: 0,
        totalLogs: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        uniqueActions: { $size: '$actions' },
        uniqueCategories: { $size: '$categories' },
        uniqueSeverities: { $size: '$severities' }
      }
    }
  ]);
};

// Static method to get audit logs by resource
auditLogSchema.statics.getResourceAuditLogs = function(
  resourceType: string,
  resourceId: string,
  limit: number = 100,
  skip: number = 0
) {
  return this.find({
    resourceType,
    resourceId
  })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to clean old audit logs
auditLogSchema.statics.cleanOldLogs = function(
  daysOld: number = 90
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    timestamp: { $lt: cutoffDate }
  });
};

// Pre-save middleware to add metadata
auditLogSchema.pre('save', function(next) {
  // Add timestamp if not provided
  if (!this.timestamp) {
    this.timestamp = new Date();
  }
  
  // Add default severity based on action if not provided
  if (!this.severity) {
    const criticalActions = ['security.permission_denied', 'user.delete', 'system.error'];
    const highActions = ['security.login_attempt', 'billing.payment_failed', 'data.export'];
    const mediumActions = ['user.role_change', 'project.delete', 'billing.subscription_cancelled'];
    
    if (criticalActions.includes(this.action)) {
      this.severity = 'critical';
    } else if (highActions.includes(this.action)) {
      this.severity = 'high';
    } else if (mediumActions.includes(this.action)) {
      this.severity = 'medium';
    } else {
      this.severity = 'low';
    }
  }
  
  next();
});

// Export the model
export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

export default AuditLog;
