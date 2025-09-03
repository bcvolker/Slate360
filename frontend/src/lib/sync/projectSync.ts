// frontend/src/lib/sync/projectSync.ts
import { Project } from '@/types/project';
import { fromMongo, fromIndexedDB, toIndexedDB } from '@/lib/adapters/projectAdapters';
import { getDB } from '@/lib/db/indexedDB'; // We will create this next

/**
 * A service class to manage all project data, both local and remote.
 */
export class ProjectSyncService {
  static async fetchAllFromServer(): Promise<Project[]> {
    console.log("MOCK: Fetching projects from /api/projects");
    // This would be a real fetch call in production
    // const res = await fetch('/api/projects');
    // const data = await res.json();
    const mockData = [{ _id: 'mongo123', name: 'Server Project', status: 'active' }];
    return mockData.map(fromMongo);
  }

  static async getAllLocal(): Promise<Project[]> {
    const db = await getDB();
    const records = await db.projects.toArray();
    return records.map(fromIndexedDB);
  }

  static async upsertLocal(project: Project): Promise<void> {
    const db = await getDB();
    await db.projects.put(toIndexedDB(project));
  }
}

// Export the missing networkManager to satisfy imports across the app
export const networkManager = {
  fetchProjects: () => ProjectSyncService.fetchAllFromServer(),
  // Add other methods that are being imported elsewhere
};
