// Audit logging utilities - disabled for mock mode
// This file is kept for future use when real MongoDB integration is needed

/*
import mongoose from 'mongoose';
import { IAuditLog } from '@/types/audit'; // Import our new unified type
import { fromMongoToAuditLog } from './adapters/auditAdapters'; // Import the new adapter
*/

// Mock interface for development
export interface IAuditLog {
  _id?: string;
  userId: string;
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

// Mock audit logging functions
export const logAudit = async (
  userId: string, 
  action: string, 
  resource: string,
  resourceId: string,
  details: any,
  ipAddress: string,
  userAgent: string,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'low',
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'other' = 'other',
  outcome: 'success' | 'failure' | 'partial' = 'success',
  metadata: Record<string, any> = {}
): Promise<void> => {
  try {
    console.log(`[AUDIT MOCK] ${userId} - ${action}:`, {
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent,
      severity,
      category,
      outcome,
      metadata,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Mock audit logging failed:', error);
  }
};

// Get audit logs with filtering
export const getAuditLogs = async (
  filter: any = {},
  limit: number = 100,
  skip: number = 0
): Promise<IAuditLog[]> => {
  try {
    console.log('🔧 getAuditLogs - using mock implementation');
    return [];
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
    console.log('🔧 getAuditStats - using mock implementation');
    return {
      totalLogs: 0,
      logsBySeverity: {},
      logsByCategory: {},
      logsByOutcome: {},
      logsByAction: {},
    };
  } catch (error) {
    console.error('Failed to get audit stats:', error);
    throw new Error('Failed to retrieve audit statistics');
  }
};

// Clean old audit logs
export const cleanOldAuditLogs = async (daysToKeep: number = 90): Promise<number> => {
  try {
    console.log('🔧 cleanOldAuditLogs - using mock implementation');
    return 0;
  } catch (error) {
    console.error('Failed to clean old audit logs:', error);
    throw new Error('Failed to clean old audit logs');
  }
};

// Export mock model
export default {
  create: async (data: Partial<IAuditLog>) => {
    console.log('🔧 AuditLog.create - using mock implementation');
    return { ...data, _id: Date.now().toString() };
  },
  find: async (query: any) => {
    console.log('🔧 AuditLog.find - using mock implementation');
    return [];
  },
  aggregate: async (pipeline: any[]) => {
    console.log('🔧 AuditLog.aggregate - using mock implementation');
    return [];
  },
  deleteMany: async (query: any) => {
    console.log('🔧 AuditLog.deleteMany - using mock implementation');
    return { deletedCount: 0 };
  }
};
