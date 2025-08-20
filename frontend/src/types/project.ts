// Project-related type definitions for Slate360

export interface ILocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface IClient {
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface ITimeline {
  startDate: string;
  endDate: string;
  estimatedDuration: number;
}

export interface IBudget {
  estimated: number;
  actual?: number;
  currency: string;
  breakdown: {
    materials: number;
    labor: number;
    equipment: number;
    permits: number;
    contingency: number;
  };
}

export interface ITeamMember {
  userId: string;
  role: string;
  permissions: string[];
}

export interface IProject {
  _id?: string;
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'other';
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  location: ILocation;
  client: IClient;
  timeline: ITimeline;
  budget: IBudget;
  team: ITeamMember[];
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IProjectResponse {
  project: IProject;
  message?: string;
}

export interface IProjectsResponse {
  projects: IProject[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProjectFilters {
  page?: string;
  limit?: string;
  status?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IProjectStats {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byBudget: {
    totalEstimated: number;
    totalActual: number;
    averageEstimated: number;
    averageActual: number;
  };
  byTimeline: {
    active: number;
    completed: number;
    overdue: number;
  };
}

export interface IProjectError {
  error: string;
  details?: string;
}
