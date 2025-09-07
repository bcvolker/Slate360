// frontend/src/hooks/useOfflineProjects.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/project';
import { ProjectSyncService } from '@/lib/sync/projectSync';

export function useOfflineProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    setIsLoading(true);
    const localProjects = await ProjectSyncService.getAllLocal();
    setProjects(localProjects);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return { projects, isLoading, refreshProjects };
}