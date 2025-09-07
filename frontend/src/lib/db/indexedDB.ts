// frontend/src/lib/db/indexedDB.ts
import Dexie, { Table } from 'dexie';

export interface IndexedProject {
  id: string; // Primary key
  name: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'draft' | 'archived';
  updatedAt: string | Date;
}

export interface OfflineProject extends IndexedProject {
  _id?: string;
  _syncStatus?: 'synced' | 'pending' | 'conflict' | 'error';
  _lastSync?: Date;
  _offlineData?: any;
}

export interface SyncQueueItem {
  id?: string;
  type: 'create' | 'update' | 'delete';
  entityId: string;
  data: any;
  timestamp: Date;
  retryCount: number;
  lastAttempt?: Date;
  priority: number;
}

export interface SyncMetadata {
  key: string;
  value: any;
}

export class SlateDB extends Dexie {
  projects!: Table<OfflineProject, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  syncMetadata!: Table<SyncMetadata, string>;

  constructor() {
    super('Slate360Database');
    this.version(1).stores({
      projects: 'id, name, status, updatedAt, _syncStatus',
      syncQueue: 'id, type, entityId, timestamp, retryCount',
      syncMetadata: 'key'
    });
  }
}

// Export the class as ProjectDatabase for backward compatibility
export const ProjectDatabase = SlateDB;

const db = new SlateDB();

export function getDB(): SlateDB {
  return db;
}