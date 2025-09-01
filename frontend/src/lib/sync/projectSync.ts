import { db } from '../db/indexedDB';
import { toast } from 'react-hot-toast';

// Network status detection
class NetworkManager {
  private isOnline = false;
  private listeners: ((online: boolean) => void)[] = [];
  private initialized = false;

  constructor() {
    // Only initialize on the client side
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      this.initialized = true;
      window.addEventListener('online', () => this.updateStatus(true));
      window.addEventListener('offline', () => this.updateStatus(false));
    }
  }

  private updateStatus(online: boolean) {
    this.isOnline = online;
    this.listeners.forEach(listener => listener(online));
    
    if (online) {
      toast.success('Back online! Syncing data...');
    } else {
      toast.error('You\'re offline. Changes will be saved locally.');
    }
  }

  public getStatus(): boolean {
    return this.initialized ? this.isOnline : true; // Default to online if not initialized
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
}

// Export the network manager instance
export const networkManager = new NetworkManager();

// Project sync service
export class ProjectSyncService {
  private static networkManager: NetworkManager | null = null;
  private static syncInProgress = false;
  private static syncInterval: NodeJS.Timeout | null = null;

  // Initialize sync service
  static initialize() {
    // Only initialize on the client side
    if (typeof window === 'undefined') return;
    
    if (!this.networkManager) {
      this.networkManager = new NetworkManager();
    }

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
  }

  // Start periodic sync (every 30 seconds when online)
  private static startPeriodicSync() {
    if (this.syncInterval) return;
    
    this.syncInterval = setInterval(async () => {
      if (this.networkManager?.getStatus() && !this.syncInProgress) {
        try {
          // Sync logic would go here
          console.log('Periodic sync check');
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
    return this.networkManager?.getStatus() ?? true;
  }

  // Add network status listener
  static onNetworkChange(listener: (online: boolean) => void) {
    return this.networkManager?.addListener(listener);
  }

  // Basic sync methods
  static async syncFromServer(): Promise<void> {
    if (!this.networkManager?.getStatus()) {
      console.log('Offline - skipping server sync');
      return;
    }
    console.log('Syncing from server...');
  }

  static async syncPendingChanges(): Promise<void> {
    if (!this.networkManager?.getStatus()) {
      console.log('Offline - skipping sync to server');
      return;
    }
    console.log('Syncing pending changes...');
  }

  static async forceSync(): Promise<void> {
    if (!this.networkManager?.getStatus()) {
      throw new Error('Cannot sync while offline');
    }
    console.log('Force syncing...');
  }
}
