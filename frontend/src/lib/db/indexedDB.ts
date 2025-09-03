// frontend/src/lib/db/indexedDB.ts
import Dexie, { Table } from 'dexie';

export interface IndexedProject {
  id: string; // Primary key
  name: string;
  status: 'draft' | 'active' | 'archived';
  updatedAt: string | Date;
}

export class SlateDB extends Dexie {
  projects!: Table<IndexedProject, string>; // Defines the 'projects' table

  constructor() {
    super('Slate360Database');
    this.version(1).stores({
      projects: 'id, name, status, updatedAt', // Primary key and indexed fields
    });
  }
}

const db = new SlateDB();

export function getDB(): SlateDB {
  return db;
}