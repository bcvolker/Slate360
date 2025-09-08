// frontend/src/types/project.ts
import { Document } from 'mongoose';

// Sub-interfaces
export interface ILocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface IClient {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  contactPerson?: string;
  billingAddress?: string;
}

export interface ITimeline {
  startDate?: Date | string;
  endDate?: Date | string;
  estimatedDuration?: number;
  milestones?: Array<{
    name: string;
    date: Date | string;
    description?: string;
    completed: boolean;
  }>;
}

export interface IBudget {
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
}

export interface ITeamMember {
  userId: string | import('mongoose').Types.ObjectId;
  role: 'project_manager' | 'architect' | 'engineer' | 'designer' | 'contractor' | 'consultant';
  permissions: ('read' | 'write' | 'admin')[];
  joinedAt?: Date | string;
  isActive: boolean;
}

// The single source of truth for all project data
export interface UnifiedProject {
  _id?: string; // Always a string for frontend consistency
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'renovation' | 'other';
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'draft';
  location: ILocation;
  client: IClient;
  timeline: ITimeline;
  budget: IBudget;
  team: ITeamMember[];
  tags: string[];
  metadata?: Record<string, any>;
  data?: any; // For IndexedDB-specific offline data
  createdBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  progress?: number;
  daysRemaining?: number;
  budgetUtilization?: number;
  teamSize?: number;
}

// For Mongoose backend compatibility
export type UnifiedProjectDocument = UnifiedProject & Document;

// For API responses and filters
export interface IProjectsResponse {
  projects: UnifiedProject[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProjectFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}