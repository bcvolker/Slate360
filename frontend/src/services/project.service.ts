import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Project, ProjectSchema, validateProject } from '@/types/types';
import { fromMongo, fromIndexedDB, toIndexedDB } from '@/lib/adapters/projectAdapters';
import { ProjectSyncService } from '@/lib/sync/projectSync';

// Database schema
interface ProjectDB extends DBSchema {
  projects: {
    key: string;
    value: Project;
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
      project: Project;
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
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          
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
  async getAllLocal(): Promise<Project[]> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      const rawProjects = await this.db.getAll('projects');
      return rawProjects.map(project => fromIndexedDB(project));
    } catch (error) {
      throw new Error(`Failed to get local projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get project by ID
   */
  async getById(id: string): Promise<Project | null> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      const project = await this.db.get('projects', id);
      return project ? fromIndexedDB(project) : null;
    } catch (error) {
      throw new Error(`Failed to get project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new project
   */
  async create(projectData: Partial<Project>): Promise<Project> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Generate a new ID if not provided
      const projectWithId = {
        ...projectData,
        id: projectData.id || `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: projectData.createdAt || new Date(),
        updatedAt: new Date(),
      };

      // Validate the project data
      const validatedProject = validateProject(projectWithId);

      // Store in IndexedDB
      await this.db.add('projects', toIndexedDB(validatedProject));

      // Add to sync queue for online sync
      await this.addToSyncQueue('create', validatedProject);

      return validatedProject;
    } catch (error) {
      throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing project
   */
  async update(id: string, updates: Partial<Project>): Promise<Project> {
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
        id, // Ensure ID doesn't change
        updatedAt: new Date(),
      };

      // Validate the updated project
      const validatedProject = validateProject(updatedProject);

      // Update in IndexedDB
      await this.db.put('projects', toIndexedDB(validatedProject));

      // Add to sync queue for online sync
      await this.addToSyncQueue('update', validatedProject);

      return validatedProject;
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
      // Get project before deletion for sync queue
      const project = await this.getById(id);
      
      // Delete from IndexedDB
      await this.db.delete('projects', id);

      // Add to sync queue for online sync
      if (project) {
        await this.addToSyncQueue('delete', project);
      }
    } catch (error) {
      throw new Error(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search projects by name or description
   */
  async search(query: string): Promise<Project[]> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      const allProjects = await this.db.getAll('projects');
      const lowerQuery = query.toLowerCase();
      
      const filteredProjects = allProjects.filter(project => 
        project.name.toLowerCase().includes(lowerQuery) ||
        (project.description && project.description.toLowerCase().includes(lowerQuery))
      );

      return filteredProjects.map(project => fromIndexedDB(project));
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
  }): Promise<Project[]> {
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

      return projects.map(project => fromIndexedDB(project));
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
      
      // Get online projects (if available)
      const onlineProjects = await ProjectSyncService.getAllOnline();
      
      // Merge and sync
      await ProjectSyncService.syncProjects(localProjects, onlineProjects);
    } catch (error) {
      throw new Error(`Failed to sync with online data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add item to sync queue
   */
  private async addToSyncQueue(action: 'create' | 'update' | 'delete', project: Project): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const queueItem = {
        id: `${action}_${project.id}_${Date.now()}`,
        action,
        project,
        timestamp: Date.now(),
        retryCount: 0,
      };

      await this.db.add('syncQueue', queueItem);
    } catch (error) {
      throw new Error(`Failed to add to sync queue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get sync queue items
   */
  async getSyncQueue(): Promise<any[]> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      return await this.db.getAll('syncQueue');
    } catch (error) {
      throw new Error(`Failed to get sync queue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Remove item from sync queue
   */
  async removeFromSyncQueue(queueId: string): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.delete('syncQueue', queueId);
    } catch (error) {
      throw new Error(`Failed to remove from sync queue: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      const queueCount = await this.db.count('syncQueue');
      
      return {
        projects: projectCount,
        syncQueue: queueCount,
      };
    } catch (error) {
      throw new Error(`Failed to get database stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export all data
   */
  async exportData(): Promise<{ projects: Project[]; syncQueue: any[] }> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      const rawProjects = await this.db.getAll('projects');
      const syncQueue = await this.db.getAll('syncQueue');
      
      return {
        projects: rawProjects.map(project => fromIndexedDB(project)),
        syncQueue,
      };
    } catch (error) {
      throw new Error(`Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Import data
   */
  async importData(data: { projects: Project[]; syncQueue: any[] }): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Clear existing data
      await this.db.clear('projects');
      await this.db.clear('syncQueue');

      // Import projects
      for (const project of data.projects) {
        const validatedProject = validateProject(project);
        await this.db.add('projects', toIndexedDB(validatedProject));
      }

      // Import sync queue
      for (const queueItem of data.syncQueue) {
        await this.db.add('syncQueue', queueItem);
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
      await this.db.clear('syncQueue');
    } catch (error) {
      throw new Error(`Failed to clear database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService();
