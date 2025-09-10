// AuditLog model - disabled for mock mode
// This file is kept for future use when real MongoDB integration is needed

/*
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

// Mock interface for development
export interface IAuditLog {
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

// Mock implementations
export const AuditLog = {
  create: async (data: Partial<IAuditLog>) => {
    console.log('🔧 AuditLog.create - using mock implementation');
    return { ...data, _id: Date.now().toString() };
  },
  find: async (query: any) => {
    console.log('🔧 AuditLog.find - using mock implementation');
    return [];
  },
  findOne: async (query: any) => {
    console.log('🔧 AuditLog.findOne - using mock implementation');
    return null;
  },
  findById: async (id: string) => {
    console.log('🔧 AuditLog.findById - using mock implementation');
    return null;
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    console.log('🔧 AuditLog.findByIdAndUpdate - using mock implementation');
    return null;
  },
  findByIdAndDelete: async (id: string) => {
    console.log('🔧 AuditLog.findByIdAndDelete - using mock implementation');
    return null;
  },
  deleteMany: async (query: any) => {
    console.log('🔧 AuditLog.deleteMany - using mock implementation');
    return { deletedCount: 0 };
  },
  aggregate: async (pipeline: any[]) => {
    console.log('🔧 AuditLog.aggregate - using mock implementation');
    return [];
  }
};

export default AuditLog;
*/

// Mock interface for development
export interface IAuditLog {
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

// Mock implementations
export const AuditLog = {
  create: async (data: Partial<IAuditLog>) => {
    console.log('🔧 AuditLog.create - using mock implementation');
    return { ...data, _id: Date.now().toString() };
  },
  find: async (query: any) => {
    console.log('🔧 AuditLog.find - using mock implementation');
    return [];
  },
  findOne: async (query: any) => {
    console.log('🔧 AuditLog.findOne - using mock implementation');
    return null;
  },
  findById: async (id: string) => {
    console.log('🔧 AuditLog.findById - using mock implementation');
    return null;
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    console.log('🔧 AuditLog.findByIdAndUpdate - using mock implementation');
    return null;
  },
  findByIdAndDelete: async (id: string) => {
    console.log('🔧 AuditLog.findByIdAndDelete - using mock implementation');
    return null;
  },
  deleteMany: async (query: any) => {
    console.log('🔧 AuditLog.deleteMany - using mock implementation');
    return { deletedCount: 0 };
  },
  aggregate: async (pipeline: any[]) => {
    console.log('🔧 AuditLog.aggregate - using mock implementation');
    return [];
  }
};

export default AuditLog;
