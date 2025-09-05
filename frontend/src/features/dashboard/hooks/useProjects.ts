'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/types';
import { projectService } from '@/services/project.service';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const localProjects = await projectService.getAllLocal();
      setProjects(localProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData: Partial<Project>) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await projectService.update(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      throw err;
    }
  }, []);

  const searchProjects = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      const results = await projectService.search(query);
      setProjects(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterProjects = useCallback(async (filters: {
    status?: string;
    type?: string;
    createdBy?: string;
  }) => {
    try {
      setIsLoading(true);
      const results = await projectService.filter(filters);
      setProjects(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const syncWithOnline = useCallback(async () => {
    try {
      setIsLoading(true);
      await projectService.syncWithOnline();
      await refreshProjects(); // Refresh the list after sync
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync with online data');
    } finally {
      setIsLoading(false);
    }
  }, [refreshProjects]);

  // Load projects on mount
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return {
    // State
    projects,
    isLoading,
    error,
    
    // Actions
    refreshProjects,
    createProject,
    updateProject,
    deleteProject,
    searchProjects,
    filterProjects,
    syncWithOnline,
    
    // Clear error
    clearError: () => setError(null),
  };
}
