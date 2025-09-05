// frontend/src/lib/sync/projectSync.ts
import { Project } from '@/types/types';
import { logAudit } from '../audit';

export class ProjectSyncService {
  /**
   * Get all online projects
   */
  static async getAllOnline(): Promise<Project[]> {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const projects = await response.json();
        return projects.map((project: any) => ({
          id: project._id || project.id,
          name: project.name,
          description: project.description,
          status: project.status,
          type: project.type,
          client: project.client,
          location: project.location,
          budget: project.budget,
          timeline: project.timeline,
          team: project.team,
          tags: project.tags,
          tasks: project.tasks,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
          createdBy: project.createdBy,
          metadata: project.metadata || {},
          isOffline: false,
          syncStatus: 'synced',
          version: project.version || 1,
          lastSynced: project.lastSync ? new Date(project.lastSync) : undefined
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch online projects:', error);
      await logAudit('system', 'sync_error', {
        error: 'Failed to fetch online projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      return [];
    }
  }

  /**
   * Sync projects between local and online
   */
  static async syncProjects(
    localProjects: Project[], 
    onlineProjects: Project[]
  ): Promise<void> {
    try {
      // Create a map of online projects by ID
      const onlineProjectMap = new Map(onlineProjects.map(p => [p.id, p]));
      const localProjectMap = new Map(localProjects.map(p => [p.id, p]));

      // Find projects that exist online but not locally
      const newOnlineProjects = onlineProjects.filter(p => !localProjectMap.has(p.id));
      
      // Find projects that exist locally but not online
      const newLocalProjects = localProjects.filter(p => !onlineProjectMap.has(p.id));
      
      // Find projects that exist in both but may have different versions
      const commonProjects = localProjects.filter(p => onlineProjectMap.has(p.id));

      // Log sync summary
      await logAudit('system', 'project_sync_summary', {
        totalLocal: localProjects.length,
        totalOnline: onlineProjects.length,
        newOnline: newOnlineProjects.length,
        newLocal: newLocalProjects.length,
        common: commonProjects.length
      });

      console.log(`Sync summary: ${newOnlineProjects.length} new online, ${newLocalProjects.length} new local, ${commonProjects.length} common`);

    } catch (error) {
      console.error('Project sync failed:', error);
      await logAudit('system', 'sync_error', {
        error: 'Project sync failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Upload a project to the server
   */
  static async uploadProject(project: Project): Promise<boolean> {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });

      if (response.ok) {
        await logAudit('system', 'project_uploaded', {
          projectId: project.id,
          projectName: project.name
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to upload project:', error);
      await logAudit('system', 'upload_error', {
        error: 'Failed to upload project',
        projectId: project.id,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Download a project from the server
   */
  static async downloadProject(projectId: string): Promise<Project | null> {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      
      if (response.ok) {
        const project = await response.json();
        await logAudit('system', 'project_downloaded', {
          projectId: projectId
        });
        return project;
      }

      return null;
    } catch (error) {
      console.error('Failed to download project:', error);
      await logAudit('system', 'download_error', {
        error: 'Failed to download project',
        projectId: projectId,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  /**
   * Get all local projects (for backward compatibility)
   */
  static async getAllLocal(): Promise<Project[]> {
    try {
      // This would typically get projects from IndexedDB
      // For now, return empty array since we're using the new project service
      console.log('getAllLocal called - using new project service instead');
      return [];
    } catch (error) {
      console.error('Failed to get local projects:', error);
      return [];
    }
  }
}
