'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Database schema for IndexedDB
interface ProjectDB extends DBSchema {
  projects: {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      status: 'draft' | 'active' | 'completed' | 'archived';
      client: string;
      startDate: string;
      endDate?: string;
      team: string[];
      files: number;
      images: number;
      videos: number;
      lastModified: string;
      lastSynced?: string;
      isDirty?: boolean;
      version: number;
    };
    indexes: {
      'by-status': string;
      'by-client': string;
      'by-lastModified': string;
      'by-syncStatus': string;
    };
  };
  syncQueue: {
    key: string;
    value: {
      id: string;
      action: 'create' | 'update' | 'delete';
      data: any;
      timestamp: number;
      retryCount: number;
    };
  };
  settings: {
    key: string;
    value: {
      lastSyncTimestamp: number;
      syncInterval: number;
      maxRetryCount: number;
      offlineMode: boolean;
    };
  };
}

// Project interface
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  client: string;
  startDate: string;
  endDate?: string;
  team: string[];
  files: number;
  images: number;
  videos: number;
  lastModified: string;
  lastSynced?: string;
  isDirty?: boolean;
  version: number;
}

// Sync queue item interface
interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount: number;
}

// Database settings interface
interface DBSettings {
  lastSyncTimestamp: number;
  syncInterval: number;
  maxRetryCount: number;
  offlineMode: boolean;
}

// Hook return interface
interface UseIndexedDBReturn {
  // Data
  projects: Project[];
  loading: boolean;
  error: string | null;
  
  // Database operations
  addProject: (project: Omit<Project, 'id' | 'lastModified' | 'version'>) => Promise<string>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
  
  // Sync operations
  syncWithServer: () => Promise<void>;
  forceSync: () => Promise<void>;
  clearOfflineData: () => Promise<void>;
  
  // Status
  isOnline: boolean;
  syncStatus: {
    lastSync: number | null;
    pendingChanges: number;
    isSyncing: boolean;
    lastError: string | null;
  };
  
  // Settings
  updateSettings: (settings: Partial<DBSettings>) => Promise<void>;
  getSettings: () => Promise<DBSettings>;
}

// Default database settings
const DEFAULT_SETTINGS: DBSettings = {
  lastSyncTimestamp: 0,
  syncInterval: 5 * 60 * 1000, // 5 minutes
  maxRetryCount: 3,
  offlineMode: false,
};

// Database configuration
const DB_NAME = 'Slate360DB';
const DB_VERSION = 1;

export function useIndexedDB(): UseIndexedDBReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState({
    lastSync: null as number | null,
    pendingChanges: 0,
    isSyncing: false,
    lastError: null as string | null,
  });

  const dbRef = useRef<IDBPDatabase<ProjectDB> | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize database
  const initDB = useCallback(async () => {
    try {
      const db = await openDB<ProjectDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Create projects store
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('by-status', 'status');
          projectStore.createIndex('by-client', 'client');
          projectStore.createIndex('by-lastModified', 'lastModified');
          projectStore.createIndex('by-syncStatus', 'isDirty');

          // Create sync queue store
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('by-timestamp', 'timestamp');

          // Create settings store
          db.createObjectStore('settings', { keyPath: 'key' });
        },
      });

      dbRef.current = db;
      
      // Initialize default settings
      const settings = await db.get('settings', 'default');
      if (!settings) {
        await db.put('settings', {
          key: 'default',
          ...DEFAULT_SETTINGS,
        });
      }

      // Load initial data
      await loadProjects();
      
      // Start sync interval
      startSyncInterval();
      
      setLoading(false);
    } catch (err) {
      setError(`Failed to initialize database: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  }, []);

  // Load projects from IndexedDB
  const loadProjects = useCallback(async () => {
    if (!dbRef.current) return;

    try {
      const allProjects = await dbRef.current.getAll('projects');
      setProjects(allProjects.sort((a, b) => 
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      ));
    } catch (err) {
      setError(`Failed to load projects: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Add project to IndexedDB
  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'lastModified' | 'version'>): Promise<string> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const project: Project = {
      ...projectData,
      id,
      lastModified: new Date().toISOString(),
      version: 1,
      isDirty: true,
    };

    await dbRef.current.put('projects', project);
    
    // Add to sync queue
    await dbRef.current.put('syncQueue', {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action: 'create',
      data: project,
      timestamp: Date.now(),
      retryCount: 0,
    });

    await loadProjects();
    updateSyncStatus();
    
    return id;
  }, [loadProjects]);

  // Update project in IndexedDB
  const updateProject = useCallback(async (id: string, updates: Partial<Project>): Promise<void> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    const existingProject = await dbRef.current.get('projects', id);
    if (!existingProject) throw new Error('Project not found');

    const updatedProject: Project = {
      ...existingProject,
      ...updates,
      lastModified: new Date().toISOString(),
      version: existingProject.version + 1,
      isDirty: true,
    };

    await dbRef.current.put('projects', updatedProject);
    
    // Add to sync queue
    await dbRef.current.put('syncQueue', {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action: 'update',
      data: updatedProject,
      timestamp: Date.now(),
      retryCount: 0,
    });

    await loadProjects();
    updateSyncStatus();
  }, [loadProjects]);

  // Delete project from IndexedDB
  const deleteProject = useCallback(async (id: string): Promise<void> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    const existingProject = await dbRef.current.get('projects', id);
    if (!existingProject) throw new Error('Project not found');

    await dbRef.current.delete('projects', id);
    
    // Add to sync queue
    await dbRef.current.put('syncQueue', {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action: 'delete',
      data: { id },
      timestamp: Date.now(),
      retryCount: 0,
    });

    await loadProjects();
    updateSyncStatus();
  }, [loadProjects]);

  // Get single project
  const getProject = useCallback(async (id: string): Promise<Project | null> => {
    if (!dbRef.current) return null;
    return await dbRef.current.get('projects', id);
  }, []);

  // Update sync status
  const updateSyncStatus = useCallback(async () => {
    if (!dbRef.current) return;

    try {
      const pendingChanges = await dbRef.current.count('syncQueue');
      const settings = await dbRef.current.get('settings', 'default');
      
      setSyncStatus(prev => ({
        ...prev,
        pendingChanges,
        lastSync: settings?.lastSyncTimestamp || null,
      }));
    } catch (err) {
      console.error('Failed to update sync status:', err);
    }
  }, []);

  // Sync with server
  const syncWithServer = useCallback(async () => {
    if (!dbRef.current || !isOnline || syncStatus.isSyncing) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, lastError: null }));

    try {
      const syncQueue = await dbRef.current.getAll('syncQueue');
      
      for (const item of syncQueue) {
        try {
          // Attempt to sync with server
          const response = await fetch(`/api/projects${item.action === 'delete' ? `/${item.data.id}` : ''}`, {
            method: item.action === 'create' ? 'POST' : item.action === 'update' ? 'PUT' : 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: item.action !== 'delete' ? JSON.stringify(item.data) : undefined,
          });

          if (response.ok) {
            // Remove from sync queue on success
            await dbRef.current!.delete('syncQueue', item.id);
            
            // Update project sync status
            if (item.action !== 'delete') {
              await dbRef.current!.put('projects', {
                ...item.data,
                isDirty: false,
                lastSynced: new Date().toISOString(),
              });
            }
          } else {
            // Increment retry count
            if (item.retryCount < (await dbRef.current!.get('settings', 'default'))?.maxRetryCount) {
              await dbRef.current!.put('syncQueue', {
                ...item,
                retryCount: item.retryCount + 1,
              });
            }
          }
        } catch (err) {
          console.error(`Failed to sync ${item.action} for project ${item.data.id}:`, err);
          
          // Increment retry count
          if (item.retryCount < (await dbRef.current!.get('settings', 'default'))?.maxRetryCount) {
            await dbRef.current!.put('syncQueue', {
              ...item,
              retryCount: item.retryCount + 1,
            });
          }
        }
      }

      // Update last sync timestamp
      await dbRef.current.put('settings', {
        key: 'default',
        ...(await dbRef.current.get('settings', 'default')),
        lastSyncTimestamp: Date.now(),
      });

      await loadProjects();
      await updateSyncStatus();
      
    } catch (err) {
      setSyncStatus(prev => ({
        ...prev,
        lastError: err instanceof Error ? err.message : 'Sync failed',
      }));
    } finally {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  }, [isOnline, syncStatus.isSyncing, loadProjects, updateSyncStatus]);

  // Force sync
  const forceSync = useCallback(async () => {
    await syncWithServer();
  }, [syncWithServer]);

  // Clear offline data
  const clearOfflineData = useCallback(async () => {
    if (!dbRef.current) return;

    try {
      await dbRef.current.clear('projects');
      await dbRef.current.clear('syncQueue');
      await loadProjects();
      await updateSyncStatus();
    } catch (err) {
      setError(`Failed to clear offline data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [loadProjects, updateSyncStatus]);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<DBSettings>): Promise<void> => {
    if (!dbRef.current) throw new Error('Database not initialized');

    const currentSettings = await dbRef.current.get('settings', 'default');
    const updatedSettings = {
      ...currentSettings,
      ...newSettings,
    };

    await dbRef.current.put('settings', updatedSettings);
  }, []);

  // Get settings
  const getSettings = useCallback(async (): Promise<DBSettings> => {
    if (!dbRef.current) throw new Error('Database not initialized');
    
    const settings = await dbRef.current.get('settings', 'default');
    return settings || DEFAULT_SETTINGS;
  }, []);

  // Start sync interval
  const startSyncInterval = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    const performSync = async () => {
      if (isOnline) {
        await syncWithServer();
      }
      
      const settings = await getSettings();
      syncTimeoutRef.current = setTimeout(performSync, settings.syncInterval);
    };

    syncTimeoutRef.current = setTimeout(performSync, 5000); // Start after 5 seconds
  }, [isOnline, syncWithServer, getSettings]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize database on mount
  useEffect(() => {
    initDB();

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [initDB]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && !syncStatus.isSyncing) {
      const timer = setTimeout(() => {
        syncWithServer();
      }, 2000); // Wait 2 seconds after coming online

      return () => clearTimeout(timer);
    }
  }, [isOnline, syncStatus.isSyncing, syncWithServer]);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    getProject,
    syncWithServer,
    forceSync,
    clearOfflineData,
    isOnline,
    syncStatus,
    updateSettings,
    getSettings,
  };
}
