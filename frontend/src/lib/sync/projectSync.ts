// frontend/src/lib/sync/projectSync.ts
import { Project } from '@/types/project';
import { fromMongo, fromIndexedDB, toIndexedDB } from '@/lib/adapters/projectAdapters';
import { getDB } from '@/lib/db/indexedDB';

export class ProjectSyncService {
  static async fetchAllFromServer(): Promise<Project[]> {
    console.log("MOCK: Fetching projects from API...");
    // In a real app, this would be: const response = await fetch('/api/projects');
    const mockApiResponse = [{ _id: 'mongo123', name: 'Server-Side Project', status: 'active' }];
    return mockApiResponse.map(fromMongo);
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

// Export the missing networkManager to satisfy legacy imports
export const networkManager = {
  fetchProjects: ProjectSyncService.fetchAllFromServer,
  // Add other functions if they are imported elsewhere
};
