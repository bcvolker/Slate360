// frontend/src/lib/adapters/projectAdapters.ts
import { Project, ProjectSchema } from '@/types/project';

const generateFallbackId = () => Math.random().toString(36).substring(2, 11);

/**
 * Safely converts a raw document from MongoDB (which uses `_id`)
 * into our validated, unified Project type.
 */
export function fromMongo(doc: any): Project {
  const projectData = {
    id: doc?._id?.toString() || doc?.id || generateFallbackId(),
    name: doc?.name || 'Untitled Project',
    description: doc?.description,
    status: doc?.status || 'draft',
    createdAt: doc?.createdAt || new Date(),
    updatedAt: doc?.updatedAt || new Date(),
    tasks: doc?.tasks || [],
  };
  // Validate the data against the schema to ensure it's clean and safe.
  return ProjectSchema.parse(projectData);
}

/**
 * Safely converts a raw record from IndexedDB into our validated, unified Project type.
 */
export function fromIndexedDB(record: any): Project {
  const projectData = {
    id: record?.id || generateFallbackId(),
    name: record?.name || 'Untitled Project',
    description: record?.description,
    status: record?.status || 'draft',
    createdAt: record?.createdAt || new Date(),
    updatedAt: record?.updatedAt || new Date(),
    tasks: record?.tasks || [],
  };
  return ProjectSchema.parse(projectData);
}

/**
 * Converts our unified Project into a plain object suitable for writing back to IndexedDB.
 */
export function toIndexedDB(project: Project) {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    tasks: project.tasks,
  };
}