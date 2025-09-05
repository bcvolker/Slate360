// frontend/src/lib/adapters/auditAdapters.ts

import { IAuditLog } from '@/types/audit';

/**
 * Safely converts a raw document from MongoDB into our IAuditLog interface.
 * Maps `_id` to `id` and provides safe defaults.
 */
export function fromMongoToAuditLog(doc: any): IAuditLog {
  return {
    id: doc?._id?.toString() || doc?.id || '',
    userId: doc?.userId || 'unknown',
    action: doc?.action || 'update',
    resource: doc?.resource || 'unknown',
    resourceId: doc?.resourceId || 'unknown',
    severity: doc?.severity || 'low',
    category: doc?.category || 'other',
    outcome: doc?.outcome || 'success',
    ipAddress: doc?.ipAddress,
    userAgent: doc?.userAgent,
    createdAt: new Date(doc?.createdAt || Date.now()),
    metadata: doc?.metadata || {},
  };
}
