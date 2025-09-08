import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { UnifiedProject } from '@/types/project';
import { projectSyncService } from '@/lib/sync/projectSync';

// Database schema
interface ProjectDB extends DBSchema {
  projects: {
    key: string;
    value: UnifiedProject;
    indexes: {
      'by-name': string;
      'by-status': string;
      'by-type': string;
      'by-client': string;
      'by-createdBy': string;
      'by-createdAt': number;
    };
  };
  syncQueue: {
    key: string;
    value: {
      id: string;
      action: 'create' | 'update' | 'delete';
      project: UnifiedProject;
      timestamp: number;
      retryCount: number;
    };
  };
}

// Database configuration
const DB_NAME = 'slate360-projects';
const DB_VERSION = 1;

class ProjectService {
  private db: IDBPDatabase<ProjectDB> | null = null;
  private isInitialized = false;

  /**
   * Initialize the IndexedDB database
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.db = await openDB<ProjectDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Create projects store
          const projectStore = db.createObjectStore('projects', { keyPath: '_id' });
          
          // Create indexes
          projectStore.createIndex('by-name', 'name');
          projectStore.createIndex('by-status', 'status');
          projectStore.createIndex('by-type', 'type');
          projectStore.createIndex('by-client', 'client.name');
          projectStore.createIndex('by-createdBy', 'createdBy');
          projectStore.createIndex('by-createdAt', 'createdAt');

          // Create sync queue store
          db.createObjectStore('syncQueue', { keyPath: 'id' });
        },
      });

      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure database is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Get all local projects
   */
  async getAllLocal(): Promise<UnifiedProject[]> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      return await this.db.getAll('projects');
    } catch (error) {
      throw new Error(`Failed to get local projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get project by ID
   */
  async getById(id: string): Promise<UnifiedProject | null> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      const project = await this.db.get('projects', id);
      return project || null;
    } catch (error) {
      throw new Error(`Failed to get project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new project
   */
  async create(projectData: Partial<UnifiedProject>): Promise<UnifiedProject> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Generate a new ID if not provided
      const projectWithId: UnifiedProject = {
        _id: projectData._id || `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: projectData.name || 'Untitled Project',
        description: projectData.description || '',
        type: projectData.type || 'other',
        status: projectData.status || 'draft',
        location: projectData.location || {
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
        client: projectData.client || {
          name: '',
          email: ''
        },
        timeline: projectData.timeline || {},
        budget: projectData.budget || { currency: 'USD' },
        team: projectData.team || [],
        tags: projectData.tags || [],
        metadata: projectData.metadata || {},
        createdBy: projectData.createdBy || 'unknown',
        createdAt: projectData.createdAt || new Date(),
        updatedAt: new Date(),
        ...projectData
      };

      // Store in IndexedDB
      await this.db.add('projects', projectWithId);

      return projectWithId;
    } catch (error) {
      throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing project
   */
  async update(id: string, updates: Partial<UnifiedProject>): Promise<UnifiedProject> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Get existing project
      const existingProject = await this.getById(id);
      if (!existingProject) {
        throw new Error(`Project with ID ${id} not found`);
      }

      // Merge updates
      const updatedProject = {
        ...existingProject,
        ...updates,
        _id: id, // Ensure ID doesn't change
        updatedAt: new Date(),
      };

      // Update in IndexedDB
      await this.db.put('projects', updatedProject);

      return updatedProject;
    } catch (error) {
      throw new Error(`Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a project
   */
  async delete(id: string): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Delete from IndexedDB
      await this.db.delete('projects', id);
    } catch (error) {
      throw new Error(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search projects by name or description
   */
  async search(query: string): Promise<UnifiedProject[]> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      const allProjects = await this.db.getAll('projects');
      const lowerQuery = query.toLowerCase();
      
      const filteredProjects = allProjects.filter(project => 
        project.name.toLowerCase().includes(lowerQuery) ||
        (project.description && project.description.toLowerCase().includes(lowerQuery))
      );

      return filteredProjects;
    } catch (error) {
      throw new Error(`Failed to search projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Filter projects by various criteria
   */
  async filter(filters: {
    status?: string;
    type?: string;
    createdBy?: string;
  }): Promise<UnifiedProject[]> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      let projects = await this.db.getAll('projects');

      if (filters.status) {
        projects = projects.filter(project => project.status === filters.status);
      }

      if (filters.type) {
        projects = projects.filter(project => project.type === filters.type);
      }

      if (filters.createdBy) {
        projects = projects.filter(project => project.createdBy === filters.createdBy);
      }

      return projects;
    } catch (error) {
      throw new Error(`Failed to filter projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sync with online data
   */
  async syncWithOnline(): Promise<void> {
    await this.ensureInitialized();
    
    try {
      // Get all local projects
      const localProjects = await this.getAllLocal();
      
      // Sync with online data using the new service
      await projectSyncService.syncProjects();
    } catch (error) {
      throw new Error(`Failed to sync with online data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<{ projects: number; syncQueue: number }> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      const projectCount = await this.db.count('projects');
      
      return {
        projects: projectCount,
        syncQueue: 0, // Simplified - no sync queue
      };
    } catch (error) {
      throw new Error(`Failed to get database stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export all data
   */
  async exportData(): Promise<{ projects: UnifiedProject[]; syncQueue: any[] }> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      const rawProjects = await this.db.getAll('projects');
      
      return {
        projects: rawProjects,
        syncQueue: [], // Simplified - no sync queue
      };
    } catch (error) {
      throw new Error(`Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Import data
   */
  async importData(data: { projects: UnifiedProject[]; syncQueue: any[] }): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Clear existing data
      await this.db.clear('projects');

      // Import projects
      for (const project of data.projects) {
        await this.db.add('projects', project);
      }
    } catch (error) {
      throw new Error(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.clear('projects');
    } catch (error) {
      throw new Error(`Failed to clear database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService();
