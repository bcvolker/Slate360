// frontend/src/types/audit.ts

// Define the canonical structure for an audit log entry.
export interface IAuditLog {
  id: string; // Use 'id' as the canonical identifier
  userId: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  resource: string;
  resourceId: string;
  severity: 'low' | 'medium' | 'high';
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'other';
  outcome: 'success' | 'failure';
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}
