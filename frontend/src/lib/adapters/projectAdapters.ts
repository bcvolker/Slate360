// frontend/src/lib/adapters/projectAdapters.ts
// Updated to use the global type adapter for consistency

import { Project } from '@/types/types';
import { OfflineProject } from '../db/indexedDB';
import { toUnifiedProject, toIndexedDB as globalToIndexedDB } from './globalTypeAdapter';

/**
 * Convert MongoDB project to unified Project type
 * @deprecated Use toUnifiedProject from globalTypeAdapter instead
 */
export const fromMongo = (mongoProject: any): Project => {
  return toUnifiedProject(mongoProject);
};

/**
 * Convert IndexedDB project to unified Project type
 * @deprecated Use toUnifiedProject from globalTypeAdapter instead
 */
export const fromIndexedDB = (indexedProject: OfflineProject): Project => {
  return toUnifiedProject(indexedProject);
};

/**
 * Convert unified Project type to IndexedDB format
 * @deprecated Use toIndexedDB from globalTypeAdapter instead
 */
export const toIndexedDB = (project: Project): OfflineProject => {
  return globalToIndexedDB(project);
};

// Re-export the global adapter functions for backward compatibility
export { toUnifiedProject, toIndexedDB as globalToIndexedDB } from './globalTypeAdapter';
