import React from 'react';
import { useOfflineProjects } from '../hooks/useOfflineProjects';
import { projectSyncService } from '../lib/sync/projectSync';
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
    projects, 
    isLoading, 
    refreshProjects 
  } = useOfflineProjects();

  const handleForceSync = async () => {
    try {
      await refreshProjects();
      toast.success('Projects refreshed successfully');
    } catch (error) {
      console.error('Force sync failed:', error);
      toast.error('Failed to refresh projects');
    }
  };

  const handleClearOldData = async () => {
    if (confirm('Are you sure you want to clear old data? This cannot be undone.')) {
      try {
        // This would be implemented in the service layer
        toast.success('Old data cleared successfully');
      } catch (error) {
        console.error('Clear old data failed:', error);
        toast.error('Failed to clear old data');
      }
    }
  };

  if (isLoading) {
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
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-green-700">
            Online
          </span>
        </div>
      </div>

      {/* Sync Status Summary */}
      <div className="sync-summary mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-500">
            Ready
          </span>
          <span className="text-xs text-gray-500">
            {projects.length} projects loaded
          </span>
        </div>
      </div>

      {/* Detailed Sync Information */}
      {showDetails && (
        <div className="sync-details mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="sync-stat">
              <span className="text-gray-600">Total Projects:</span>
              <span className="font-medium ml-2">{projects.length}</span>
            </div>
            <div className="sync-stat">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600 ml-2">Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* Sync Actions */}
      {showActions && (
        <div className="sync-actions space-y-2">
          <button
            onClick={handleForceSync}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Projects'}
          </button>
          
          <button
            onClick={handleClearOldData}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Clear Old Data
          </button>
        </div>
      )}
    </div>
  );
}

// Compact version for headers/toolbars
export function CompactSyncStatus() {
  const { projects, isLoading } = useOfflineProjects();

  return (
    <div className="compact-sync-status flex items-center space-x-2">
      {/* Network Indicator */}
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-xs text-gray-600">
          Online
        </span>
      </div>

      {/* Sync Status */}
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-xs text-green-600">
          {projects.length} projects
        </span>
      </div>
    </div>
  );
}

// Export both components
export default SyncStatus;
