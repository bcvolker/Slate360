import { db, OfflineProject, SyncQueueItem } from '../db/indexedDB';
import { toast } from 'react-hot-toast';

// Network status detection
class NetworkManager {
  private isOnline = navigator.onLine;
  private listeners: ((online: boolean) => void)[] = [];

  constructor() {
    window.addEventListener('online', () => this.updateStatus(true));
    window.addEventListener('offline', () => this.updateStatus(false));
  }

  private updateStatus(online: boolean) {
    this.isOnline = online;
    this.listeners.forEach(listener => listener(online));
    
    if (online) {
      toast.success('Back online! Syncing data...');
      this.triggerSync();
    } else {
      toast.error('You\'re offline. Changes will be saved locally.');
    }
  }

  public getStatus(): boolean {
    return this.isOnline;
  }

  public addListener(listener: (online: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private async triggerSync() {
    try {
      await ProjectSyncService.syncPendingChanges();
    } catch (error) {
      console.error('Auto-sync failed:', error);
    }
  }
}

// Project sync service
export class ProjectSyncService {
  private static networkManager = new NetworkManager();
  private static syncInProgress = false;
  private static syncInterval: NodeJS.Timeout | null = null;

  // Initialize sync service
  static initialize() {
    // Start periodic sync when online
    this.networkManager.addListener((online) => {
      if (online) {
        this.startPeriodicSync();
      } else {
        this.stopPeriodicSync();
      }
    });

    // Start periodic sync if already online
    if (this.networkManager.getStatus()) {
      this.startPeriodicSync();
    }

    // Initial sync
    this.syncFromServer();
  }

  // Start periodic sync (every 30 seconds when online)
  private static startPeriodicSync() {
    if (this.syncInterval) return;
    
    this.syncInterval = setInterval(async () => {
      if (this.networkManager.getStatus() && !this.syncInProgress) {
        try {
          await this.syncPendingChanges();
        } catch (error) {
          console.error('Periodic sync failed:', error);
        }
      }
    }, 30000); // 30 seconds
  }

  // Stop periodic sync
  private static stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Get network status
  static isOnline(): boolean {
    return this.networkManager.getStatus();
  }

  // Add network status listener
  static onNetworkChange(listener: (online: boolean) => void) {
    return this.networkManager.addListener(listener);
  }

  // Sync projects from server to local database
  static async syncFromServer(): Promise<void> {
    if (!this.networkManager.getStatus()) {
      console.log('Offline - skipping server sync');
      return;
    }

    try {
      const response = await fetch('/api/projects?limit=1000');
      
      if (response.ok) {
        const result = await response.json();
        const serverProjects = result.projects;

        // Get local projects
        const localProjects = await db.getAllProjects();
        const localProjectMap = new Map(localProjects.map(p => [p._id, p]));

        // Process server projects
        for (const serverProject of serverProjects) {
          const localProject = localProjectMap.get(serverProject._id);
          
          if (!localProject || this.isServerVersionNewer(serverProject, localProject)) {
            // Update local project with server data
            const offlineProject: OfflineProject = {
              ...serverProject,
              _syncStatus: 'synced',
              _lastSync: new Date(),
              _offlineChanges: localProject?._offlineChanges || []
            };

            await db.projects.put(offlineProject);
          }
        }

        // Update sync metadata
        await db.syncMetadata.put({
          key: 'lastSync',
          value: new Date()
        });

        console.log(`Synced ${serverProjects.length} projects from server`);
      }
    } catch (error) {
      console.error('Failed to sync from server:', error);
      throw error;
    }
  }

  // Check if server version is newer than local
  private static isServerVersionNewer(serverProject: any, localProject: OfflineProject): boolean {
    const serverUpdated = new Date(serverProject.updatedAt);
    const localUpdated = new Date(localProject.updatedAt);
    return serverUpdated > localUpdated;
  }

  // Sync pending changes to server
  static async syncPendingChanges(): Promise<void> {
    if (!this.networkManager.getStatus()) {
      console.log('Offline - skipping sync to server');
      return;
    }

    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return;
    }

    this.syncInProgress = true;

    try {
      const pendingItems = await db.getPendingSyncItems();
      
      if (pendingItems.length === 0) {
        console.log('No pending sync items');
        return;
      }

      console.log(`Syncing ${pendingItems.length} pending changes`);

      for (const item of pendingItems) {
        try {
          await this.processSyncItem(item);
          
          // Remove from sync queue on success
          await db.syncQueue.delete(item.id!);
          
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          // Increment retry count
          await db.syncQueue.update(item.id!, {
            retryCount: item.retryCount + 1,
            lastAttempt: new Date()
          });
        }
      }

      // Update project sync statuses
      await this.updateProjectSyncStatuses();

    } finally {
      this.syncInProgress = false;
    }
  }

  // Process individual sync item
  private static async processSyncItem(item: SyncQueueItem): Promise<void> {
    switch (item.type) {
      case 'create':
        await this.createProjectOnServer(item);
        break;
      case 'update':
        await this.updateProjectOnServer(item);
        break;
      case 'delete':
        await this.deleteProjectOnServer(item);
        break;
    }
  }

  // Create project on server
  private static async createProjectOnServer(item: SyncQueueItem): Promise<void> {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.data)
    });

    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Update local project with server ID
    await db.projects.update(item.entityId, {
      _id: result.project._id,
      _syncStatus: 'synced',
      _lastSync: new Date()
    });
  }

  // Update project on server
  private static async updateProjectOnServer(item: SyncQueueItem): Promise<void> {
    const response = await fetch(`/api/projects/${item.entityId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.data)
    });

    if (!response.ok) {
      throw new Error(`Failed to update project: ${response.statusText}`);
    }

    // Update local project sync status
    await db.projects.update(item.entityId, {
      _syncStatus: 'synced',
      _lastSync: new Date()
    });
  }

  // Delete project on server
  private static async deleteProjectOnServer(item: SyncQueueItem): Promise<void> {
    const response = await fetch(`/api/projects/${item.entityId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.statusText}`);
    }

    // Remove from local database
    await db.projects.delete(item.entityId);
  }

  // Update project sync statuses
  private static async updateProjectSyncStatuses(): Promise<void> {
    const projects = await db.getAllProjects();
    
    for (const project of projects) {
      if (project._syncStatus === 'pending') {
        // Check if project has pending changes in sync queue
        const pendingItems = await db.syncQueue
          .where('entityId')
          .equals(project._id)
          .toArray();

        if (pendingItems.length === 0) {
          // No pending changes, mark as synced
          await db.projects.update(project._id, {
            _syncStatus: 'synced',
            _lastSync: new Date()
          });
        }
      }
    }
  }

  // Create project (offline-first)
  static async createProject(projectData: Omit<IProject, '_id' | 'createdAt' | 'updatedAt'>): Promise<OfflineProject> {
    const offlineId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const offlineProject: OfflineProject = {
      ...projectData,
      _id: offlineId,
      _offlineId: offlineId,
      _syncStatus: 'pending',
      _lastSync: new Date(),
      _offlineChanges: [{
        type: 'create',
        timestamp: new Date(),
        data: projectData
      }]
    } as OfflineProject;

    // Save to local database
    await db.projects.add(offlineProject);

    // Add to sync queue
    await db.syncQueue.add({
      type: 'create',
      entityType: 'project',
      entityId: offlineId,
      data: projectData,
      timestamp: new Date(),
      retryCount: 0
    });

    // Try to sync immediately if online
    if (this.networkManager.getStatus()) {
      this.syncPendingChanges().catch(console.error);
    }

    return offlineProject;
  }

  // Update project (offline-first)
  static async updateProject(id: string, updateData: Partial<IProject>): Promise<OfflineProject> {
    const project = await db.projects.get(id);
    if (!project) {
      throw new Error('Project not found');
    }

    // Update local project
    const updatedProject: OfflineProject = {
      ...project,
      ...updateData,
      _syncStatus: 'pending',
      _lastSync: new Date(),
      _offlineChanges: [
        ...(project._offlineChanges || []),
        {
          type: 'update',
          timestamp: new Date(),
          data: updateData
        }
      ]
    };

    await db.projects.put(updatedProject);

    // Add to sync queue
    await db.syncQueue.add({
      type: 'update',
      entityType: 'project',
      entityId: id,
      data: updateData,
      timestamp: new Date(),
      retryCount: 0
    });

    // Try to sync immediately if online
    if (this.networkManager.getStatus()) {
      this.syncPendingChanges().catch(console.error);
    }

    return updatedProject;
  }

  // Delete project (offline-first)
  static async deleteProject(id: string): Promise<void> {
    const project = await db.projects.get(id);
    if (!project) {
      throw new Error('Project not found');
    }

    // Mark as deleted locally
    await db.projects.update(id, {
      _syncStatus: 'pending',
      _lastSync: new Date(),
      _offlineChanges: [
        ...(project._offlineChanges || []),
        {
          type: 'delete',
          timestamp: new Date()
        }
      ]
    });

    // Add to sync queue
    await db.syncQueue.add({
      type: 'delete',
      entityType: 'project',
      entityId: id,
      timestamp: new Date(),
      retryCount: 0
    });

    // Try to sync immediately if online
    if (this.networkManager.getStatus()) {
      this.syncPendingChanges().catch(console.error);
    }
  }

  // Get sync status
  static async getSyncStatus() {
    return await db.getSyncStatus();
  }

  // Force sync
  static async forceSync(): Promise<void> {
    if (!this.networkManager.getStatus()) {
      throw new Error('Cannot sync while offline');
    }

    await this.syncFromServer();
    await this.syncPendingChanges();
  }

  // Clear old data
  static async clearOldData(): Promise<void> {
    await db.clearOldSyncData();
  }
}

// Export network manager for use in components
export const networkManager = ProjectSyncService.networkManager;
