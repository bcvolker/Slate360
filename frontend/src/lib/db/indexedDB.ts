// frontend/src/lib/db/indexedDB.ts
import Dexie, { Table } from 'dexie';

// This interface describes the shape of the data *as it is stored in the database*.
export interface IndexedProject {
  id: string; // Primary key
  name: string;
  status: 'draft' | 'active' | 'archived';
  updatedAt: string | Date;
  // You can add other indexed fields here for fast lookups.
}

export class SlateDB extends Dexie {
  projects!: Table<IndexedProject, string>; // The table definition

  constructor() {
    super('Slate360Database');
    this.version(1).stores({
      // Define the primary key ('id') and any other indexed fields.
      projects: 'id, name, status, updatedAt',
    });
  }
}

const db = new SlateDB();

export function getDB(): SlateDB {
  return db;
}