// Project model - disabled for mock mode
// This file is kept for future use when real MongoDB integration is needed

/*
import mongoose, { Document, Model, Schema } from 'mongoose';
import type { UnifiedProject } from '@/types/project';

// Use the unified Project type as the base interface
export interface IProject extends Omit<UnifiedProject, '_id'>, Document {
  // Mongoose-specific fields are inherited from Document
  // All Project fields are inherited from the unified Project type
  // We omit '_id' from UnifiedProject since Document already has '_id'
}
*/

// Mock interface for development
export interface IProject {
  _id?: string;
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'renovation' | 'other';
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'draft';
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  client: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    contactPerson?: string;
    billingAddress?: string;
  };
  timeline: {
    startDate?: Date | string;
    endDate?: Date | string;
    estimatedDuration?: number;
    milestones?: Array<{
      name: string;
      date: Date | string;
      description?: string;
      completed: boolean;
    }>;
  };
  budget: {
    estimated?: number;
    actual?: number;
    currency: string;
    breakdown?: {
      materials: number;
      labor: number;
      equipment: number;
      permits: number;
      contingency: number;
    };
    invoices?: Array<{
      number: string;
      amount: number;
      date: Date | string;
      status: 'pending' | 'paid' | 'overdue';
    }>;
  };
  team: Array<{
    userId: string;
    role: 'project_manager' | 'architect' | 'engineer' | 'designer' | 'contractor' | 'consultant';
    permissions: ('read' | 'write' | 'admin')[];
    joinedAt?: Date | string;
    isActive: boolean;
  }>;
  tags: string[];
  metadata?: Record<string, any>;
  createdBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Mock implementations
export const Project = {
  create: async (data: Partial<IProject>) => {
    console.log('🔧 Project.create - using mock implementation');
    return { ...data, _id: Date.now().toString() };
  },
  find: async (query: any) => {
    console.log('🔧 Project.find - using mock implementation');
    return [];
  },
  findOne: async (query: any) => {
    console.log('🔧 Project.findOne - using mock implementation');
    return null;
  },
  findById: async (id: string) => {
    console.log('🔧 Project.findById - using mock implementation');
    return null;
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    console.log('🔧 Project.findByIdAndUpdate - using mock implementation');
    return null;
  },
  findByIdAndDelete: async (id: string) => {
    console.log('🔧 Project.findByIdAndDelete - using mock implementation');
    return null;
  },
  deleteMany: async (query: any) => {
    console.log('🔧 Project.deleteMany - using mock implementation');
    return { deletedCount: 0 };
  },
  aggregate: async (pipeline: any[]) => {
    console.log('🔧 Project.aggregate - using mock implementation');
    return [];
  }
};

export default Project;
