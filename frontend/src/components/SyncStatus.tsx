import React from 'react';
import { useOfflineProjects } from '../hooks/useOfflineProjects';
import { ProjectSyncService } from '../lib/sync/projectSync';
import { toast } from 'react-hot-toast';

interface SyncStatusProps {
  showDetails?: boolean;
  showActions?: boolean;
  className?: string;
}

export function SyncStatus({ 
  showDetails = true, 
  showActions = true, 
  className = '' 
}: SyncStatusProps) {
  const { 
    isOnline, 
    syncStatus, 
    loading, 
    forceSync, 
    clearOldData 
  } = useOfflineProjects();

  const handleForceSync = async () => {
    try {
      await forceSync();
    } catch (error) {
      console.error('Force sync failed:', error);
    }
  };

  const handleClearOldData = async () => {
    if (confirm('Are you sure you want to clear old synced data? This cannot be undone.')) {
      try {
        await clearOldData();
      } catch (error) {
        console.error('Clear old data failed:', error);
      }
    }
  };

  const getSyncStatusColor = () => {
    if (!syncStatus) return 'text-gray-500';
    
    if (syncStatus.failedProjects > 0) return 'text-red-500';
    if (syncStatus.pendingProjects > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getSyncStatusText = () => {
    if (!syncStatus) return 'Unknown';
    
    if (syncStatus.failedProjects > 0) return 'Sync Failed';
    if (syncStatus.pendingProjects > 0) return 'Pending Sync';
    return 'Synced';
  };

  const getLastSyncText = () => {
    if (!syncStatus?.lastSync) return 'Never';
    
    const now = new Date();
    const lastSync = new Date(syncStatus.lastSync);
    const diffMs = now.getTime() - lastSync.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className={`sync-status loading ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm text-gray-500">Loading sync status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`sync-status ${className}`}>
      {/* Network Status */}
      <div className="network-status mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Sync Status Summary */}
      {syncStatus && (
        <div className="sync-summary mb-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${getSyncStatusColor()}`}>
              {getSyncStatusText()}
            </span>
            <span className="text-xs text-gray-500">
              Last sync: {getLastSyncText()}
            </span>
          </div>
        </div>
      )}

      {/* Detailed Sync Information */}
      {showDetails && syncStatus && (
        <div className="sync-details mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="sync-stat">
              <span className="text-gray-600">Total Projects:</span>
              <span className="font-medium ml-2">{syncStatus.totalProjects}</span>
            </div>
            <div className="sync-stat">
              <span className="text-gray-600">Synced:</span>
              <span className="font-medium text-green-600 ml-2">{syncStatus.syncedProjects}</span>
            </div>
            <div className="sync-stat">
              <span className="text-gray-600">Pending:</span>
              <span className="font-medium text-yellow-600 ml-2">{syncStatus.pendingProjects}</span>
            </div>
            <div className="sync-stat">
              <span className="text-gray-600">Failed:</span>
              <span className="font-medium text-red-600 ml-2">{syncStatus.failedProjects}</span>
            </div>
          </div>

          {/* Progress Bar */}
          {syncStatus.totalProjects > 0 && (
            <div className="sync-progress mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Sync Progress</span>
                <span>{Math.round((syncStatus.syncedProjects / syncStatus.totalProjects) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(syncStatus.syncedProjects / syncStatus.totalProjects) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sync Actions */}
      {showActions && (
        <div className="sync-actions space-y-2">
          <button
            onClick={handleForceSync}
            disabled={!isOnline || loading}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {loading ? 'Syncing...' : 'Force Sync'}
          </button>
          
          <button
            onClick={handleClearOldData}
            disabled={loading}
            className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Clear Old Data
          </button>
        </div>
      )}

      {/* Offline Notice */}
      {!isOnline && (
        <div className="offline-notice mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            You're currently offline. Changes will be saved locally and synced when you're back online.
          </p>
        </div>
      )}

      {/* Sync Issues Notice */}
      {syncStatus?.failedProjects && syncStatus.failedProjects > 0 && (
        <div className="sync-issues mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-800">
            {syncStatus.failedProjects} project(s) failed to sync. Please check your connection and try again.
          </p>
        </div>
      )}
    </div>
  );
}

// Compact version for headers/toolbars
export function CompactSyncStatus() {
  const { isOnline, syncStatus } = useOfflineProjects();

  if (!syncStatus) return null;

  const hasPendingChanges = syncStatus.pendingProjects > 0;
  const hasFailedChanges = syncStatus.failedProjects > 0;

  return (
    <div className="compact-sync-status flex items-center space-x-2">
      {/* Network Indicator */}
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-xs text-gray-600">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Sync Status */}
      {hasPendingChanges && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span className="text-xs text-yellow-600">
            {syncStatus.pendingProjects} pending
          </span>
        </div>
      )}

      {hasFailedChanges && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-xs text-red-600">
            {syncStatus.failedProjects} failed
          </span>
        </div>
      )}

      {/* All Synced */}
      {!hasPendingChanges && !hasFailedChanges && syncStatus.totalProjects > 0 && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-green-600">Synced</span>
        </div>
      )}
    </div>
  );
}

// Export both components
export default SyncStatus;
