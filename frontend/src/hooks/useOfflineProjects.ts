// frontend/src/hooks/useOfflineProjects.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { UnifiedProject } from '@/types/project';
import { projectSyncService } from '@/lib/sync/projectSync';

export function useOfflineProjects() {
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    setIsLoading(true);
    const localProjects = await projectSyncService.getOfflineProjects();
    setProjects(localProjects);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return { projects, isLoading, refreshProjects };
}