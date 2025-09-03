// frontend/src/lib/adapters/projectAdapters.ts
import { Project, ProjectSchema } from '@/types/project';

// Helper to safely generate a fallback ID
const generateId = () => Math.random().toString(36).substring(2, 11);

/**
 * Safely converts a document from MongoDB into our unified Project type.
 * Handles missing fields and maps `_id` to `id`.
 */
export function fromMongo(doc: any): Project {
  const projectData = {
    id: doc?._id?.toString() || doc?.id || generateId(),
    name: doc?.name || 'Untitled Project',
    description: doc?.description,
    status: doc?.status || 'draft',
    createdAt: doc?.createdAt || new Date(),
    updatedAt: doc?.updatedAt || new Date(),
    tasks: doc?.tasks || [],
  };
  return ProjectSchema.parse(projectData); // Validate and return
}

/**
 * Safely converts a record from IndexedDB into our unified Project type.
 */
export function fromIndexedDB(record: any): Project {
  const projectData = {
    id: record?.id || generateId(),
    name: record?.name || 'Untitled Project',
    description: record?.description,
    status: record?.status || 'draft',
    createdAt: record?.createdAt || new Date(),
    updatedAt: record?.updatedAt || new Date(),
    tasks: record?.tasks || [],
  };
  return ProjectSchema.parse(projectData); // Validate and return
}

/**
 * Converts our unified Project type into a plain object suitable for writing to IndexedDB.
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
