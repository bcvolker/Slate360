// src/types/index.ts
// Base interface for data coming from MongoDB
export interface MongoDoc {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// The raw data structure for a project
export interface ProjectData extends MongoDoc {
  name: string;
  description?: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  imageUrl?: string;
  bimModelUrl?: string;
}

// The frontend-friendly project structure with 'id'
export interface Project extends Omit<ProjectData, '_id' | 'createdAt' | 'updatedAt'> {
  id: string;
}

// Utility to safely map MongoDB's _id to a frontend-friendly id
export function mapMongoId<T extends MongoDoc>(doc: T): Omit<T, '_id'> & { id: string } {
  const { _id, ...remainingDoc } = doc;
  return { id: _id, ...remainingDoc };
}
