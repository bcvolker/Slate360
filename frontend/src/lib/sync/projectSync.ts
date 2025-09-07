// frontend/src/lib/sync/projectSync.ts
import { Project } from '@/types/project';
import { fromMongo, fromIndexedDB, toIndexedDB } from '@/lib/adapters/projectAdapters';
import { getDB } from '@/lib/db/indexedDB';

export class ProjectSyncService {
  static async fetchAllFromServer(): Promise<Project[]> {
    console.log("MOCK: Fetching projects from API...");
    // This is where you will put your real API call next week.
    const mockApiResponse = [{ _id: 'server123', name: 'Server-Side Project', status: 'active' }];
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

// Export the missing networkManager to satisfy any legacy imports
export const networkManager = {
  fetchProjects: ProjectSyncService.fetchAllFromServer,
};