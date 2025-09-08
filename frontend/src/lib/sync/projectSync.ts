// frontend/src/lib/sync/projectSync.ts
import { UnifiedProject } from '@/types/project';
import { openDB } from 'idb';

const DB_NAME = 'slate360-offline';
const STORE_NAME = 'projects';

class ProjectSyncService {
  private dbPromise: Promise<any>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: '_id' });
      },
    });
  }

  async getOfflineProjects(): Promise<UnifiedProject[]> {
    const db = await this.dbPromise;
    return await db.getAll(STORE_NAME);
  }

  async saveToOffline(projects: UnifiedProject[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    for (const project of projects) {
      if (project._id) {
        await tx.store.put(project);
      }
    }
    await tx.done;
  }

  async syncProjects(): Promise<UnifiedProject[]> {
    try {
      const offlineProjects = await this.getOfflineProjects();
      // This is where you would fetch from your real API endpoint
      const response = await fetch('/api/projects/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: offlineProjects }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok during sync');
      }

      const syncedProjects: UnifiedProject[] = await response.json();
      await this.saveToOffline(syncedProjects);
      return syncedProjects;
    } catch (error) {
      console.error('Sync failed, returning offline projects:', error);
      // In case of network failure, return what's available offline
      return this.getOfflineProjects();
    }
  }
}

export const projectSyncService = new ProjectSyncService();