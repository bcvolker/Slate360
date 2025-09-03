// frontend/src/lib/db/indexedDB.ts
import Dexie, { Table } from 'dexie';
import { Project } from '@/types/project';

// Define the shape of the data as it will be stored in IndexedDB
export interface IndexedProject {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: string | Date;
  updatedAt: string | Date;
  description?: string;
}

export class SlateDB extends Dexie {
  projects!: Table<IndexedProject, string>; // The 'string' is the type of the primary key

  constructor() {
    super('Slate360DB');
    this.version(1).stores({
      // Primary key is 'id', and we can index other properties for faster lookups
      projects: 'id, name, status, updatedAt',
    });
  }
}

const db = new SlateDB();

export function getDB(): SlateDB {
  return db;
}