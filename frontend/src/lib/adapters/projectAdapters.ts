// frontend/src/lib/adapters/projectAdapters.ts
import { Project, ProjectSchema } from '@/types/types';

const generateFallbackId = () => Math.random().toString(36).substring(2, 11);

/**
 * Safely converts a raw document from MongoDB (which uses `_id`)
 * into our validated, unified Project type.
 */
export function fromMongo(doc: any): Project {
  const projectData = {
    id: doc?._id?.toString() || doc?.id || generateFallbackId(),
    name: doc?.name || 'Untitled Project',
    description: doc?.description || '',
    type: doc?.type || 'other',
    status: doc?.status || 'draft',
    location: doc?.location || {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    client: doc?.client || {
      name: '',
      email: '',
      company: ''
    },
    timeline: doc?.timeline || {
      startDate: new Date(),
      endDate: new Date(),
      estimatedDuration: 0
    },
    budget: doc?.budget || {
      estimated: 0,
      actual: 0,
      currency: 'USD'
    },
    team: doc?.team || [],
    tags: doc?.tags || [],
    metadata: doc?.metadata || {},
    createdBy: doc?.createdBy || 'system',
    createdAt: doc?.createdAt || new Date(),
    updatedAt: doc?.updatedAt || new Date(),
    tasks: doc?.tasks || [],
    isOffline: doc?.isOffline || false,
    lastSynced: doc?.lastSynced,
    syncStatus: doc?.syncStatus || 'synced',
    version: doc?.version || 1
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
    description: record?.description || '',
    type: record?.type || 'other',
    status: record?.status || 'draft',
    location: record?.location || {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    client: record?.client || {
      name: '',
      email: '',
      company: ''
    },
    timeline: record?.timeline || {
      startDate: new Date(),
      endDate: new Date(),
      estimatedDuration: 0
    },
    budget: record?.budget || {
      estimated: 0,
      actual: 0,
      currency: 'USD'
    },
    team: record?.team || [],
    tags: record?.tags || [],
    metadata: record?.metadata || {},
    createdBy: record?.createdBy || 'system',
    createdAt: record?.createdAt || new Date(),
    updatedAt: record?.updatedAt || new Date(),
    tasks: record?.tasks || [],
    isOffline: record?.isOffline || false,
    lastSynced: record?.lastSynced,
    syncStatus: record?.syncStatus || 'synced',
    version: record?.version || 1
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
    type: project.type,
    status: project.status,
    location: project.location,
    client: project.client,
    timeline: project.timeline,
    budget: project.budget,
    team: project.team,
    tags: project.tags,
    metadata: project.metadata,
    createdBy: project.createdBy,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    tasks: project.tasks,
    isOffline: project.isOffline,
    lastSynced: project.lastSynced,
    syncStatus: project.syncStatus,
    version: project.version
  };
}