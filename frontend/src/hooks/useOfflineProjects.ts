import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { ProjectSyncService, networkManager } from '../lib/sync/projectSync';
import { db, OfflineProject } from '../lib/db/indexedDB';
import { toast } from 'react-hot-toast';

export interface UseOfflineProjectsReturn {
  // State
  projects: OfflineProject[];
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  syncStatus: {
    totalProjects: number;
    syncedProjects: number;
    pendingProjects: number;
    failedProjects: number;
    lastSync?: Date;
  } | null;
  
  // Actions
  createProject: (projectData: any) => Promise<OfflineProject>;
  updateProject: (id: string, updateData: any) => Promise<OfflineProject>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
  forceSync: () => Promise<void>;
  
  // Utilities
  getProject: (id: string) => OfflineProject | undefined;
  getProjectsByFilter: (filter: any) => Promise<OfflineProject[]>;
  clearOldData: () => Promise<void>;
}

/**
 * React hook for offline-first project management
 * @returns Object with project management utilities and state
 */
export function useOfflineProjects(): UseOfflineProjectsReturn {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<OfflineProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(networkManager.getStatus());
  const [syncStatus, setSyncStatus] = useState<UseOfflineProjectsReturn['syncStatus']>(null);

  // Initialize sync service and load projects
  useEffect(() => {
    if (session?.user) {
      initializeOfflineProjects();
    }
  }, [session?.user]);

  // Network status listener
  useEffect(() => {
    const unsubscribe = ProjectSyncService.onNetworkChange((online) => {
      setIsOnline(online);
      if (online) {
        // Refresh sync status when coming back online
        refreshSyncStatus();
      }
    });

    return unsubscribe;
  }, []);

  // Initialize offline projects
  const initializeOfflineProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize sync service
      ProjectSyncService.initialize();

      // Load projects from local database
      await loadLocalProjects();

      // Get initial sync status
      await refreshSyncStatus();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize offline projects';
      setError(errorMessage);
      console.error('Failed to initialize offline projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load projects from local database
  const loadLocalProjects = async () => {
    try {
      const localProjects = await db.getAllProjects();
      setProjects(localProjects);
    } catch (err) {
      console.error('Failed to load local projects:', err);
      throw err;
    }
  };

  // Refresh sync status
  const refreshSyncStatus = async () => {
    try {
      const status = await ProjectSyncService.getSyncStatus();
      setSyncStatus(status);
    } catch (err) {
      console.error('Failed to refresh sync status:', err);
    }
  };

  // Create project (offline-first)
  const createProject = useCallback(async (projectData: any): Promise<OfflineProject> => {
    try {
      setError(null);

      // Create project locally first
      const offlineProject = await ProjectSyncService.createProject(projectData);

      // Update local state
      setProjects(prev => [offlineProject, ...prev]);

      // Show success message
      if (isOnline) {
        toast.success('Project created and synced to server');
      } else {
        toast.success('Project created offline. Will sync when online.');
      }

      // Refresh sync status
      await refreshSyncStatus();

      return offlineProject;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [isOnline]);

  // Update project (offline-first)
  const updateProject = useCallback(async (id: string, updateData: any): Promise<OfflineProject> => {
    try {
      setError(null);

      // Update project locally first
      const updatedProject = await ProjectSyncService.updateProject(id, updateData);

      // Update local state
      setProjects(prev => 
        prev.map(p => p._id === id ? updatedProject : p)
      );

      // Show success message
      if (isOnline) {
        toast.success('Project updated and synced to server');
      } else {
        toast.success('Project updated offline. Will sync when online.');
      }

      // Refresh sync status
      await refreshSyncStatus();

      return updatedProject;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [isOnline]);

  // Delete project (offline-first)
  const deleteProject = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);

      // Delete project locally first
      await ProjectSyncService.deleteProject(id);

      // Update local state
      setProjects(prev => prev.filter(p => p._id !== id));

      // Show success message
      if (isOnline) {
        toast.success('Project deleted and synced to server');
      } else {
        toast.success('Project deleted offline. Will sync when online.');
      }

      // Refresh sync status
      await refreshSyncStatus();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [isOnline]);

  // Refresh projects from local database
  const refreshProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await loadLocalProjects();
      await refreshSyncStatus();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh projects';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Force sync with server
  const forceSync = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      if (!isOnline) {
        throw new Error('Cannot sync while offline');
      }

      toast.loading('Syncing with server...');

      await ProjectSyncService.forceSync();
      await loadLocalProjects();
      await refreshSyncStatus();

      toast.dismiss();
      toast.success('Sync completed successfully');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync with server';
      setError(errorMessage);
      toast.dismiss();
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  // Get project by ID
  const getProject = useCallback((id: string): OfflineProject | undefined => {
    return projects.find(p => p._id === id);
  }, [projects]);

  // Get projects by filter
  const getProjectsByFilter = useCallback(async (filter: any): Promise<OfflineProject[]> => {
    try {
      return await db.getProjectsByFilter(filter);
    } catch (err) {
      console.error('Failed to filter projects:', err);
      throw err;
    }
  }, []);

  // Clear old data
  const clearOldData = useCallback(async () => {
    try {
      await ProjectSyncService.clearOldData();
      await loadLocalProjects();
      await refreshSyncStatus();
      toast.success('Old data cleared successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear old data';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    // State
    projects,
    loading,
    error,
    isOnline,
    syncStatus,
    
    // Actions
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
    forceSync,
    
    // Utilities
    getProject,
    getProjectsByFilter,
    clearOldData,
  };
}

/**
 * Hook for getting a single project by ID
 */
export function useOfflineProject(id: string) {
  const { projects, loading, error, isOnline, updateProject, deleteProject } = useOfflineProjects();
  const project = projects.find(p => p._id === id);

  return {
    project,
    loading,
    error,
    isOnline,
    updateProject: (data: any) => updateProject(id, data),
    deleteProject: () => deleteProject(id),
    isOffline: !isOnline,
    syncStatus: project?._syncStatus,
    lastSync: project?._lastSync,
  };
}

/**
 * Hook for getting projects with specific filters
 */
export function useFilteredOfflineProjects(filter: any) {
  const { projects, loading, error, isOnline, refreshProjects } = useOfflineProjects();
  const [filteredProjects, setFilteredProjects] = useState<OfflineProject[]>([]);

  useEffect(() => {
    const applyFilter = async () => {
      try {
        const filtered = await db.getProjectsByFilter(filter);
        setFilteredProjects(filtered);
      } catch (err) {
        console.error('Failed to apply filter:', err);
      }
    };

    if (projects.length > 0) {
      applyFilter();
    }
  }, [projects, filter]);

  return {
    projects: filteredProjects,
    loading,
    error,
    isOnline,
    refreshProjects,
    totalCount: projects.length,
    filteredCount: filteredProjects.length,
  };
}
