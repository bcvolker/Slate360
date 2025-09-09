import React, { useState } from 'react';
import { UnifiedProject } from '@/types/project';

// Define the API response types locally since they're specific to this example
interface IProjectResponse {
  success: boolean;
  project: UnifiedProject;
  message?: string;
}

interface IProjectsResponse {
  success: boolean;
  projects: UnifiedProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

interface IProjectFilters {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface IProjectStats {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  averageBudget: number;
  totalBudget: number;
}

interface IProjectError {
  success: false;
  error: string;
  message?: string;
}

// Examples of how to use the Projects API endpoints

// Example 1: Create a new project
export const createProjectExample = async (): Promise<Project> => {
  const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
    name: "Downtown Office Complex",
    description: "Modern 15-story office building with sustainable design features and LEED certification",
    type: "commercial",
    status: "planning",
    location: {
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      coordinates: {
        lat: 40.7589,
        lng: -73.9851
      }
    },
    client: {
      name: "Metro Development Corp",
      email: "projects@metrodev.com",
      phone: "+1-555-0123",
      company: "Metro Development Corporation"
    },
    timeline: {
      startDate: "2024-06-01T00:00:00.000Z",
      endDate: "2026-06-01T00:00:00.000Z",
      estimatedDuration: 730
    },
    budget: {
      estimated: 25000000,
      currency: "USD",
      breakdown: {
        materials: 12000000,
        labor: 8000000,
        equipment: 3000000,
        permits: 500000,
        contingency: 1500000
      }
    },
    team: [
      {
        userId: "user123",
        role: "project_manager",
        permissions: ["read", "write", "admin"]
      },
      {
        userId: "user456",
        role: "architect",
        permissions: ["read", "write"]
      }
    ],
    tags: ["office", "sustainable", "leed", "downtown", "high-rise"]
  };

  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (response.ok) {
      const result: IProjectResponse = await response.json();
      console.log('Project created:', result.project);
      return result.project;
    } else {
      const error: IProjectError = await response.json();
      console.error('Failed to create project:', error);
      throw new Error(error.error);
    }
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Example 2: List projects with filtering and pagination
export const listProjectsExample = async () => {
  const queryParams = new URLSearchParams({
    page: '1',
    limit: '10',
    status: 'active',
    type: 'commercial',
    search: 'office',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  try {
    const response = await fetch(`/api/projects?${queryParams}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Projects:', result.projects);
      console.log('Pagination:', result.pagination);
      return result;
    } else {
      const error = await response.json();
      console.error('Failed to fetch projects:', error);
      throw new Error(error.error);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Example 3: Get a specific project
export const getProjectExample = async (projectId: string) => {
  try {
    const response = await fetch(`/api/projects/${projectId}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Project details:', result.project);
      return result.project;
    } else {
      const error = await response.json();
      console.error('Failed to fetch project:', error);
      throw new Error(error.error);
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

// Example 4: Update a project
export const updateProjectExample = async (projectId: string) => {
  const updateData = {
    status: 'active',
    timeline: {
      startDate: '2024-06-15T00:00:00.000Z',
      endDate: '2026-08-01T00:00:00.000Z'
    },
    budget: {
      actual: 5000000
    },
    tags: ['office', 'sustainable', 'leed', 'downtown', 'high-rise', 'construction-started']
  };

  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Project updated:', result.project);
      return result.project;
    } else {
      const error = await response.json();
      console.error('Failed to update project:', error);
      throw new Error(error.error);
    }
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Example 5: Delete a project
export const deleteProjectExample = async (projectId: string) => {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Project deleted:', result.message);
      return result;
    } else {
      const error = await response.json();
      console.error('Failed to delete project:', error);
      throw new Error(error.error);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Example 6: Complex project creation with milestones
export const createComplexProjectExample = async () => {
  const complexProjectData = {
    name: "Green Residential Community",
    description: "Eco-friendly residential development with 50 units, solar panels, and community gardens",
    type: "residential",
    status: "planning",
    location: {
      address: "456 Green Valley Road",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA"
    },
    client: {
      name: "EcoHomes Inc",
      email: "development@ecohomes.com",
      phone: "+1-555-0456",
      company: "EcoHomes Development"
    },
    timeline: {
      startDate: "2024-09-01T00:00:00.000Z",
      endDate: "2025-12-01T00:00:00.000Z",
      estimatedDuration: 456
    },
    budget: {
      estimated: 15000000,
      currency: "USD"
    },
    team: [
      {
        userId: "user789",
        role: "project_manager",
        permissions: ["read", "write", "admin"]
      },
      {
        userId: "user101",
        role: "architect",
        permissions: ["read", "write"]
      },
      {
        userId: "user112",
        role: "engineer",
        permissions: ["read", "write"]
      }
    ],
    tags: ["residential", "eco-friendly", "solar", "community", "sustainable"]
  };

  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complexProjectData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Complex project created:', result.project);
      return result.project;
    } else {
      const error = await response.json();
      console.error('Failed to create complex project:', error);
      throw new Error(error.error);
    }
  } catch (error) {
    console.error('Error creating complex project:', error);
    throw error;
  }
};

// Example 7: Search projects by various criteria
export const searchProjectsExample = async () => {
  // Search for projects by client
  const clientSearch = await fetch('/api/projects?client=Metro&limit=5');
  
  // Search for projects by status
  const activeProjects = await fetch('/api/projects?status=active&limit=10');
  
  // Search for projects by type
  const commercialProjects = await fetch('/api/projects?type=commercial&limit=15');
  
  // Full-text search
  const textSearch = await fetch('/api/projects?search=sustainable&limit=20');
  
  // Combined search with pagination
  const combinedSearch = await fetch('/api/projects?status=active&type=commercial&search=office&page=1&limit=10&sortBy=createdAt&sortOrder=desc');

  return {
    clientSearch: await clientSearch.json(),
    activeProjects: await activeProjects.json(),
    commercialProjects: await commercialProjects.json(),
    textSearch: await textSearch.json(),
    combinedSearch: await combinedSearch.json()
  };
};

// Example 8: React hook for projects - Simplified version
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async (filters: IProjectFilters = {}): Promise<IProjectsResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams(filters as Record<string, string>);
      const response = await fetch(`/api/projects?${queryParams}`);
      
      if (response.ok) {
        const result: IProjectsResponse = await response.json();
        setProjects(result.projects || []);
        return result;
      } else {
        const errorData: IProjectError = await response.json();
        throw new Error(errorData.error || 'Failed to fetch projects');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const result: IProjectResponse = await response.json();
        setProjects(prev => [result.project, ...prev]);
        return result.project;
      } else {
        const errorData: IProjectError = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId: string, updateData: Partial<Project>): Promise<Project> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const result: IProjectResponse = await response.json();
        setProjects(prev => 
          prev.map((p: Project) => p.id === projectId ? result.project : p)
        );
        return result.project;
      } else {
        const errorData: IProjectError = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(prev => prev.filter((p: Project) => p.id !== projectId));
        return true;
      } else {
        const errorData: IProjectError = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
};

// Example 9: Project statistics and analytics
export const getProjectStats = async (): Promise<IProjectStats> => {
  try {
    // Get all projects for analysis
    const response = await fetch('/api/projects?limit=1000');
    
    if (response.ok) {
      const result: IProjectsResponse = await response.json();
      const projects = result.projects;
      
      // Calculate statistics
      const stats: IProjectStats = {
        total: projects.length,
        byStatus: {} as Record<string, number>,
        byType: {} as Record<string, number>,
        byBudget: {
          totalEstimated: 0,
          totalActual: 0,
          averageEstimated: 0,
          averageActual: 0
        },
        byTimeline: {
          active: 0,
          completed: 0,
          overdue: 0
        }
      };

      projects.forEach((project: Project) => {
        // Status distribution
        stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
        
        // Type distribution
        stats.byType[project.type] = (stats.byType[project.type] || 0) + 1;
        
        // Budget calculations
        if (project.budget?.estimated) {
          stats.byBudget.totalEstimated += project.budget.estimated;
        }
        if (project.budget?.actual) {
          stats.byBudget.totalActual += project.budget.actual;
        }
        
        // Timeline analysis
        if (project.status === 'active') {
          stats.byTimeline.active++;
          if (project.timeline?.endDate && new Date() > new Date(project.timeline.endDate)) {
            stats.byTimeline.overdue++;
          }
        } else if (project.status === 'completed') {
          stats.byTimeline.completed++;
        }
      });

      // Calculate averages
      const projectsWithBudget = projects.filter((p: Project) => p.budget?.estimated);
      if (projectsWithBudget.length > 0) {
        stats.byBudget.averageEstimated = stats.byBudget.totalEstimated / projectsWithBudget.length;
      }
      
      const projectsWithActualBudget = projects.filter((p: Project) => p.budget?.actual);
      if (projectsWithActualBudget.length > 0) {
        stats.byBudget.averageActual = stats.byBudget.totalActual / projectsWithActualBudget.length;
      }

      return stats;
    } else {
      const errorData: IProjectError = await response.json();
      throw new Error(errorData.error || 'Failed to fetch projects for statistics');
    }
  } catch (error) {
    console.error('Error getting project stats:', error);
    throw error;
  }
};
