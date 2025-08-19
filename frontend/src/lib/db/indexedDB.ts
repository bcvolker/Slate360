import Dexie, { Table } from 'dexie';
import { IProject } from '@/models/Project';

// Extended project interface for offline storage
export interface OfflineProject extends IProject {
  _id: string;
  _offlineId?: string; // Local ID for offline-created projects
  _syncStatus: 'synced' | 'pending' | 'failed';
  _lastSync?: Date;
  _offlineChanges?: {
    type: 'create' | 'update' | 'delete';
    timestamp: Date;
    data?: any;
  }[];
}

// Sync queue interface
export interface SyncQueueItem {
  id?: number;
  type: 'create' | 'update' | 'delete';
  entityType: 'project';
  entityId: string;
  data?: any;
  timestamp: Date;
  retryCount: number;
  lastAttempt?: Date;
}

// Database class extending Dexie
export class ProjectDatabase extends Dexie {
  projects!: Table<OfflineProject>;
  syncQueue!: Table<SyncQueueItem>;
  syncMetadata!: Table<{ key: string; value: any }>;

  constructor() {
    super('ProjectDatabase');
    
    this.version(1).stores({
      projects: '_id, _offlineId, _syncStatus, status, type, createdBy, _lastSync',
      syncQueue: '++id, type, entityType, entityId, timestamp, retryCount',
      syncMetadata: 'key'
    });

    // Add indexes for better query performance
    this.version(2).stores({
      projects: '_id, _offlineId, _syncStatus, status, type, createdBy, _lastSync, name, client.name, tags'
    });
  }

  // Helper method to get project by ID (online or offline)
  async getProject(id: string): Promise<OfflineProject | undefined> {
    return await this.projects.get(id);
  }

  // Helper method to get all projects
  async getAllProjects(): Promise<OfflineProject[]> {
    return await this.projects.toArray();
  }

  // Helper method to get projects by filter
  async getProjectsByFilter(filter: {
    status?: string;
    type?: string;
    client?: string;
    search?: string;
    createdBy?: string;
  }): Promise<OfflineProject[]> {
    let collection = this.projects.toCollection();

    if (filter.status) {
      collection = collection.filter(project => project.status === filter.status);
    }

    if (filter.type) {
      collection = collection.filter(project => project.type === filter.type);
    }

    if (filter.client) {
      collection = collection.filter(project => 
        project.client.name.toLowerCase().includes(filter.client!.toLowerCase()) ||
        project.client.company?.toLowerCase().includes(filter.client!.toLowerCase())
      );
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      collection = collection.filter(project =>
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.client.name.toLowerCase().includes(searchLower) ||
        project.client.company?.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filter.createdBy) {
      collection = collection.filter(project => project.createdBy === filter.createdBy);
    }

    return await collection.toArray();
  }

  // Helper method to get sync status
  async getSyncStatus(): Promise<{
    totalProjects: number;
    syncedProjects: number;
    pendingProjects: number;
    failedProjects: number;
    lastSync?: Date;
  }> {
    const projects = await this.projects.toArray();
    const lastSync = await this.syncMetadata.get('lastSync');

    return {
      totalProjects: projects.length,
      syncedProjects: projects.filter(p => p._syncStatus === 'synced').length,
      pendingProjects: projects.filter(p => p._syncStatus === 'pending').length,
      failedProjects: projects.filter(p => p._syncStatus === 'failed').length,
      lastSync: lastSync?.value
    };
  }

  // Helper method to get pending sync items
  async getPendingSyncItems(): Promise<SyncQueueItem[]> {
    return await this.syncQueue
      .where('retryCount')
      .below(3) // Max 3 retries
      .toArray();
  }

  // Helper method to clear old sync metadata
  async clearOldSyncData(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await this.projects
      .where('_lastSync')
      .below(thirtyDaysAgo)
      .and(project => project._syncStatus === 'synced')
      .delete();
  }
}

// Create and export database instance
export const db = new ProjectDatabase();

// Export types for use in other files
export type { OfflineProject, SyncQueueItem };
