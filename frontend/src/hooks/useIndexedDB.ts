'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Project } from '../types/project';

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

export const useIndexedDB = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dbRef = useRef<IDBPDatabase<ProjectDB> | null>(null);

  // Initialize database
  const initDB = useCallback(async () => {
    try {
      const db = await openDB<ProjectDB>(DB_NAME, DB_VERSION, {
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

      dbRef.current = db;
      setIsReady(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize database');
      setIsReady(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initDB();
  }, [initDB]);

  // Add project
  const addProject = useCallback(async (project: Project): Promise<void> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      await dbRef.current.add('projects', project);
    } catch (err) {
      throw new Error(`Failed to add project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Update project
  const updateProject = useCallback(async (project: Project): Promise<void> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      await dbRef.current.put('projects', project);
    } catch (err) {
      throw new Error(`Failed to update project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Delete project
  const deleteProject = useCallback(async (projectId: string): Promise<void> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      await dbRef.current.delete('projects', projectId);
    } catch (err) {
      throw new Error(`Failed to delete project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Get project by ID
  const getProject = useCallback(async (projectId: string): Promise<Project | null> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      const project = await dbRef.current.get('projects', projectId);
      return project || null;
    } catch (err) {
      throw new Error(`Failed to get project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Get all projects
  const getAllProjects = useCallback(async (): Promise<Project[]> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      return await dbRef.current.getAll('projects');
    } catch (err) {
      throw new Error(`Failed to get projects: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Search projects
  const searchProjects = useCallback(async (query: string): Promise<Project[]> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      const allProjects = await dbRef.current.getAll('projects');
      const lowerQuery = query.toLowerCase();
      
      return allProjects.filter(project => 
        project.name.toLowerCase().includes(lowerQuery) ||
        (project.description && project.description.toLowerCase().includes(lowerQuery))
      );
    } catch (err) {
      throw new Error(`Failed to search projects: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Filter projects
  const filterProjects = useCallback(async (filter: {
    status?: string;
  }): Promise<Project[]> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      let collection = await dbRef.current.getAll('projects');

      if (filter.status) {
        collection = collection.filter(project => project.status === filter.status);
      }

      return collection;
    } catch (err) {
      throw new Error(`Failed to filter projects: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Add to sync queue
  const addToSyncQueue = useCallback(async (action: 'create' | 'update' | 'delete', project: Project): Promise<void> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      const queueItem = {
        id: `${action}_${project.id}_${Date.now()}`,
        action,
        project,
        timestamp: Date.now(),
        retryCount: 0,
      };

      await dbRef.current.add('syncQueue', queueItem);
    } catch (err) {
      throw new Error(`Failed to add to sync queue: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Get sync queue
  const getSyncQueue = useCallback(async (): Promise<any[]> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      return await dbRef.current.getAll('syncQueue');
    } catch (err) {
      throw new Error(`Failed to get sync queue: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Remove from sync queue
  const removeFromSyncQueue = useCallback(async (queueId: string): Promise<void> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      await dbRef.current.delete('syncQueue', queueId);
    } catch (err) {
      throw new Error(`Failed to remove from sync queue: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Clear database
  const clearDB = useCallback(async (): Promise<void> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      await dbRef.current.clear('projects');
      await dbRef.current.clear('syncQueue');
    } catch (err) {
      throw new Error(`Failed to clear database: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Get database stats
  const getStats = useCallback(async (): Promise<{ projects: number; syncQueue: number }> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      const projectCount = await dbRef.current.count('projects');
      const queueCount = await dbRef.current.count('syncQueue');
      
      return {
        projects: projectCount,
        syncQueue: queueCount,
      };
    } catch (err) {
      throw new Error(`Failed to get database stats: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Export data
  const exportData = useCallback(async (): Promise<{ projects: Project[]; syncQueue: any[] }> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      const projects = await dbRef.current.getAll('projects');
      const syncQueue = await dbRef.current.getAll('syncQueue');
      
      return { projects, syncQueue };
    } catch (err) {
      throw new Error(`Failed to export data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Import data
  const importData = useCallback(async (data: { projects: Project[]; syncQueue: any[] }): Promise<void> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    try {
      // Clear existing data
      await clearDB();

      // Import projects
      for (const project of data.projects) {
        await dbRef.current.add('projects', project);
      }

      // Import sync queue
      for (const queueItem of data.syncQueue) {
        await dbRef.current.add('syncQueue', queueItem);
      }
    } catch (err) {
      throw new Error(`Failed to import data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [clearDB]);

  return {
    // State
    isReady,
    error,
    
    // Database operations
    addProject,
    updateProject,
    deleteProject,
    getProject,
    getAllProjects,
    searchProjects,
    filterProjects,
    
    // Sync queue operations
    addToSyncQueue,
    getSyncQueue,
    removeFromSyncQueue,
    
    // Utility operations
    clearDB,
    getStats,
    exportData,
    importData,
    
    // Reinitialize
    reinit: initDB,
  };
};
