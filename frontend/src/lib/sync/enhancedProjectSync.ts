import { SlateDB } from '../db/indexedDB';
import { Project } from '@/types/types';
import { OfflineProject, SyncQueueItem } from '../db/indexedDB';
import { logAudit } from '../audit';

export interface SyncOptions {
  force?: boolean;
  retryCount?: number;
  conflictResolution?: 'server-wins' | 'client-wins' | 'manual' | 'timestamp-based';
  batchSize?: number;
  syncTimeout?: number;
}

export interface SyncResult {
  success: boolean;
  syncedProjects: number;
  conflicts: number;
  errors: number;
  details: {
    created: number;
    updated: number;
    deleted: number;
    failed: number;
  };
  conflictsList: Array<{
    projectId: string;
    conflictType: 'version' | 'deletion' | 'modification';
    serverVersion: any;
    clientVersion: any;
    resolution: string;
  }>;
}

export interface SyncMetadata {
  lastSync: Date;
  syncVersion: number;
  serverHash: string;
  clientHash: string;
  conflictsResolved: number;
  totalSyncs: number;
}

export class EnhancedProjectSync {
  private db: SlateDB;
  private syncInProgress: boolean = false;
  private syncAbortController: AbortController | null = null;

  constructor() {
    this.db = new SlateDB();
  }

  /**
   * Main sync method with enhanced conflict resolution
   */
  async syncProjects(options: SyncOptions = {}): Promise<SyncResult> {
    if (this.syncInProgress) {
      throw new Error('Sync already in progress');
    }

    this.syncInProgress = true;
    this.syncAbortController = new AbortController();

    try {
      const result: SyncResult = {
        success: false,
        syncedProjects: 0,
        conflicts: 0,
        errors: 0,
        details: { created: 0, updated: 0, deleted: 0, failed: 0 },
        conflictsList: []
      };

      // Check network status
      if (!navigator.onLine && !options.force) {
        throw new Error('No network connection. Use force=true to sync offline changes.');
      }

      // Get sync queue
      const syncQueue = await this.db.syncQueue.toArray();
      if (syncQueue.length === 0) {
        result.success = true;
        return result;
      }

      // Process sync queue in batches
      const batchSize = options.batchSize || 10;
      const batches = this.chunkArray(syncQueue, batchSize);

      for (const batch of batches) {
        if (this.syncAbortController.signal.aborted) {
          break;
        }

        const batchResult = await this.processSyncBatch(batch, options);
        
        // Aggregate results
        result.details.created += batchResult.details.created;
        result.details.updated += batchResult.details.updated;
        result.details.deleted += batchResult.details.deleted;
        result.details.failed += batchResult.details.failed;
        result.conflicts += batchResult.conflicts;
        result.errors += batchResult.errors;
        result.conflictsList.push(...batchResult.conflictsList);
      }

      result.syncedProjects = result.details.created + result.details.updated + result.details.deleted;
      result.success = result.errors === 0;

      // Update sync metadata
      await this.updateSyncMetadata(result);

      // Log audit
      await logAudit('system', 'project_sync', {
        result: result.success ? 'success' : 'partial_success',
        syncedProjects: result.syncedProjects,
        conflicts: result.conflicts,
        errors: result.errors
      });

      return result;

    } catch (error) {
      console.error('Enhanced sync failed:', error);
      
      await logAudit('system', 'project_sync', {
        result: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    } finally {
      this.syncInProgress = false;
      this.syncAbortController = null;
    }
  }

  /**
   * Process a batch of sync items
   */
  private async processSyncBatch(
    batch: SyncQueueItem[], 
    options: SyncOptions
  ): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      syncedProjects: 0,
      conflicts: 0,
      errors: 0,
      details: { created: 0, updated: 0, deleted: 0, failed: 0 },
      conflictsList: []
    };

    for (const item of batch) {
      try {
        const itemResult = await this.processSyncItem(item, options);
        
        // Aggregate item results
        result.details.created += itemResult.created ? 1 : 0;
        result.details.updated += itemResult.updated ? 1 : 0;
        result.details.deleted += itemResult.deleted ? 1 : 0;
        result.details.failed += itemResult.failed ? 1 : 0;
        result.conflicts += itemResult.conflict ? 1 : 0;
        
        if (itemResult.conflict) {
          result.conflictsList.push(itemResult.conflict);
        }

        // Remove successful items from queue
        if (itemResult.success) {
          await this.db.syncQueue.delete(item.id!);
        } else if (itemResult.failed) {
          // Increment retry count
          await this.db.syncQueue.update(item.id!, {
            retryCount: item.retryCount + 1,
            lastAttempt: new Date()
          });
        }

      } catch (error) {
        console.error(`Failed to process sync item ${item.id}:`, error);
        result.errors++;
        result.details.failed++;
      }
    }

    result.success = result.errors === 0;
    return result;
  }

  /**
   * Process individual sync item
   */
  private async processSyncItem(
    item: SyncQueueItem, 
    options: SyncOptions
  ): Promise<{
    success: boolean;
    created?: boolean;
    updated?: boolean;
    deleted?: boolean;
    failed?: boolean;
    conflict?: any;
  }> {
    const maxRetries = options.retryCount || 3;
    
    if (item.retryCount >= maxRetries) {
      return { success: false, failed: true };
    }

    try {
      switch (item.type) {
        case 'create':
          return await this.handleCreate(item, options);
        case 'update':
          return await this.handleUpdate(item, options);
        case 'delete':
          return await this.handleDelete(item, options);
        default:
          throw new Error(`Unknown sync item type: ${item.type}`);
      }
    } catch (error) {
      console.error(`Sync item processing failed:`, error);
      return { success: false, failed: true };
    }
  }

  /**
   * Handle project creation
   */
  private async handleCreate(
    item: SyncQueueItem, 
    options: SyncOptions
  ): Promise<any> {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.data),
        signal: this.syncAbortController?.signal
      });

      if (response.ok) {
        const createdProject = await response.json();
        
        // Update local project with server ID
        await this.db.projects.update(item.entityId, {
          _id: createdProject._id,
          _syncStatus: 'synced',
          _lastSync: new Date()
        });

        return { success: true, created: true };
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle project update with conflict resolution
   */
  private async handleUpdate(
    item: SyncQueueItem, 
    options: SyncOptions
  ): Promise<any> {
    try {
      // Get current server version
      const serverResponse = await fetch(`/api/projects/${item.entityId}`, {
        signal: this.syncAbortController?.signal
      });

      if (!serverResponse.ok) {
        throw new Error(`Failed to fetch server version: ${serverResponse.status}`);
      }

      const serverProject = await serverResponse.json();
      const localProject = await this.db.projects.get(item.entityId);

      if (!localProject) {
        throw new Error('Local project not found');
      }

      // Check for conflicts
      const conflict = this.detectConflict(localProject, serverProject, item.data);
      
      if (conflict) {
        const resolution = await this.resolveConflict(
          conflict, 
          localProject, 
          serverProject, 
          options.conflictResolution || 'server-wins'
        );

        if (resolution.resolved) {
          // Update with resolved data
          const updateResponse = await fetch(`/api/projects/${item.entityId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resolution.data),
            signal: this.syncAbortController?.signal
          });

          if (updateResponse.ok) {
            await this.db.projects.update(item.entityId, {
              _syncStatus: 'synced',
              _lastSync: new Date()
            });

            return { 
              success: true, 
              updated: true, 
              conflict: {
                projectId: item.entityId,
                conflictType: conflict.type,
                serverVersion: serverProject,
                clientVersion: localProject,
                resolution: resolution.strategy
              }
            };
          }
        }
        
        return { success: false, conflict: conflict };
      }

      // No conflict, proceed with update
      const updateResponse = await fetch(`/api/projects/${item.entityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.data),
        signal: this.syncAbortController?.signal
      });

      if (updateResponse.ok) {
        await this.db.projects.update(item.entityId, {
          _syncStatus: 'synced',
          _lastSync: new Date()
        });

        return { success: true, updated: true };
      } else {
        throw new Error(`Update failed: ${updateResponse.status}`);
      }

    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle project deletion
   */
  private async handleDelete(
    item: SyncQueueItem, 
    options: SyncOptions
  ): Promise<any> {
    try {
      const response = await fetch(`/api/projects/${item.entityId}`, {
        method: 'DELETE',
        signal: this.syncAbortController?.signal
      });

      if (response.ok) {
        // Remove from local database
        await this.db.projects.delete(item.entityId);
        return { success: true, deleted: true };
      } else {
        throw new Error(`Delete failed: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Detect conflicts between local and server versions
   */
  private detectConflict(
    localProject: OfflineProject, 
    serverProject: Project, 
    updateData: any
  ): { type: string; details: any } | null {
    // Version conflict
    if (localProject._lastSync && serverProject.updatedAt) {
      const localTime = new Date(localProject._lastSync).getTime();
      const serverTime = new Date(serverProject.updatedAt).getTime();
      
      if (serverTime > localTime) {
        return {
          type: 'version',
          details: {
            localVersion: localProject._lastSync,
            serverVersion: serverProject.updatedAt,
            timeDiff: serverTime - localTime
          }
        };
      }
    }

    // Deletion conflict
    if (updateData.deleted && !(serverProject as any).deletedAt) {
      return {
        type: 'deletion',
        details: {
          localAction: 'delete',
          serverStatus: 'active'
        }
      };
    }

    // Modification conflict
    const conflictingFields = this.findConflictingFields(localProject, serverProject, updateData);
    if (conflictingFields.length > 0) {
      return {
        type: 'modification',
        details: {
          conflictingFields,
          localValues: conflictingFields.map(field => ({
            field,
            value: this.getNestedValue(localProject, field)
          })),
          serverValues: conflictingFields.map(field => ({
            field,
            value: this.getNestedValue(serverProject, field)
          }))
        }
      };
    }

    return null;
  }

  /**
   * Resolve conflicts based on strategy
   */
  private async resolveConflict(
    conflict: any,
    localProject: OfflineProject,
    serverProject: Project,
    strategy: string
  ): Promise<{ resolved: boolean; data: any; strategy: string }> {
    switch (strategy) {
      case 'server-wins':
        return {
          resolved: true,
          data: { ...serverProject, ...localProject },
          strategy: 'server-wins'
        };

      case 'client-wins':
        return {
          resolved: true,
          data: { ...localProject, ...serverProject },
          strategy: 'client-wins'
        };

      case 'timestamp-based':
        const localTime = new Date(localProject._lastSync || 0).getTime();
        const serverTime = new Date(serverProject.updatedAt || 0).getTime();
        
        if (localTime > serverTime) {
          return {
            resolved: true,
            data: { ...localProject, ...serverProject },
            strategy: 'timestamp-based-client-wins'
          };
        } else {
          return {
            resolved: true,
            data: { ...serverProject, ...localProject },
            strategy: 'timestamp-based-server-wins'
          };
        }

      case 'manual':
        // For manual resolution, we'll need user input
        // This could trigger a UI modal or return unresolved
        return {
          resolved: false,
          data: null,
          strategy: 'manual-resolution-required'
        };

      default:
        return {
          resolved: false,
          data: null,
          strategy: 'unknown-strategy'
        };
    }
  }

  /**
   * Find fields that have conflicting values
   */
  private findConflictingFields(
    localProject: OfflineProject,
    serverProject: Project,
    updateData: any
  ): string[] {
    const conflictingFields: string[] = [];
    
    for (const field in updateData) {
      const localValue = this.getNestedValue(localProject, field);
      const serverValue = this.getNestedValue(serverProject, field);
      
      if (localValue !== serverValue && 
          JSON.stringify(localValue) !== JSON.stringify(serverValue)) {
        conflictingFields.push(field);
      }
    }
    
    return conflictingFields;
  }

  /**
   * Get nested object value by path
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Update sync metadata
   */
  private async updateSyncMetadata(result: SyncResult): Promise<void> {
    const metadata = await this.db.syncMetadata.get('sync-stats');
    const currentStats = metadata?.value || {};
    
    const newStats = {
      ...currentStats,
      lastSync: new Date(),
      syncVersion: (currentStats.syncVersion || 0) + 1,
      conflictsResolved: (currentStats.conflictsResolved || 0) + result.conflicts,
      totalSyncs: (currentStats.totalSyncs || 0) + 1,
      lastSyncResult: result
    };

    await this.db.syncMetadata.put({
      key: 'sync-stats',
      value: newStats
    });
  }

  /**
   * Abort current sync operation
   */
  abortSync(): void {
    if (this.syncAbortController) {
      this.syncAbortController.abort();
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): { inProgress: boolean; lastSync: Date | null } {
    return {
      inProgress: this.syncInProgress,
      lastSync: null // This would be retrieved from metadata
    };
  }

  /**
   * Utility to chunk array into batches
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export default EnhancedProjectSync;
