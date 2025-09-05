// frontend/src/lib/db/indexedDB.ts
import Dexie, { Table } from 'dexie';
import { Project } from '@/types/types';

// This interface describes the shape of the data *as it is stored in the database*.
export interface IndexedProject {
  id: string; // Primary key
  name: string;
  status: 'draft' | 'active' | 'archived';
  updatedAt: string | Date;
  // You can add other indexed fields here for fast lookups.
}

// OfflineProject is now just an alias for Project with sync metadata
export interface OfflineProject extends Project {
  _syncStatus?: 'synced' | 'pending' | 'error' | 'conflict';
  _lastSync?: Date;
  _id?: string; // Server ID
}

export interface SyncQueueItem {
  id?: string;
  type: 'create' | 'update' | 'delete';
  entityId: string;
  data: any;
  retryCount: number;
  lastAttempt?: Date;
  timestamp: Date;
}

export interface ProjectDatabase {
  projects: Table<OfflineProject, string>;
  syncQueue: Table<SyncQueueItem, string>;
  syncMetadata: Table<{ key: string; value: any }, string>;
}

export class SlateDB extends Dexie implements ProjectDatabase {
  projects!: Table<OfflineProject, string>; // The table definition
  syncQueue!: Table<SyncQueueItem, string>;
  syncMetadata!: Table<{ key: string; value: any }, string>;

  constructor() {
    super('Slate360Database');
    this.version(1).stores({
      // Define the primary key ('id') and any other indexed fields.
      projects: 'id, name, status, updatedAt',
      syncQueue: 'id, entityId, type, timestamp',
      syncMetadata: 'key'
    });
  }
}

const db = new SlateDB();

export function getDB(): SlateDB {
  return db;
}

// Export a default instance for backward compatibility
export default db;