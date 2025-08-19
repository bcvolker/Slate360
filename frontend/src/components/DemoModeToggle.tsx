'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useRole } from '../hooks/useRole';

interface DemoModeToggleProps {
  onDemoModeChange?: (enabled: boolean) => void;
  className?: string;
}

export default function DemoModeToggle({ onDemoModeChange, className = '' }: DemoModeToggleProps) {
  const { isCEO, isAdmin } = useRole();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<'success' | 'error' | null>(null);

  // Check if demo mode is enabled on mount
  useEffect(() => {
    const savedDemoMode = localStorage.getItem('slate360_demo_mode');
    if (savedDemoMode === 'true') {
      setIsDemoMode(true);
      onDemoModeChange?.(true);
    }
  }, [onDemoModeChange]);

  // Only show for CEO/Admin users
  if (!isCEO && !isAdmin) {
    return null;
  }

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setLastAction(null);

    try {
      if (!isDemoMode) {
        // Enable demo mode
        await enableDemoMode();
        setIsDemoMode(true);
        localStorage.setItem('slate360_demo_mode', 'true');
        onDemoModeChange?.(true);
        setLastAction('success');
      } else {
        // Disable demo mode
        await disableDemoMode();
        setIsDemoMode(false);
        localStorage.removeItem('slate360_demo_mode');
        onDemoModeChange?.(false);
        setLastAction('success');
      }
    } catch (error) {
      console.error('Demo mode toggle failed:', error);
      setLastAction('error');
    } finally {
      setIsLoading(false);
    }
  };

  const enableDemoMode = async () => {
    // Simulate loading demo data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would:
    // 1. Load mock projects, users, and data
    // 2. Set up demo environment
    // 3. Initialize sample workflows
    console.log('Demo mode enabled - loading mock data...');
  };

  const disableDemoMode = async () => {
    // Simulate cleaning up demo data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would:
    // 1. Clear demo data
    // 2. Restore production environment
    // 3. Clean up temporary files
    console.log('Demo mode disabled - cleaning up...');
  };

  const refreshDemoData = async () => {
    if (isLoading || !isDemoMode) return;

    setIsLoading(true);
    setLastAction(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Demo data refreshed');
      setLastAction('success');
    } catch (error) {
      console.error('Failed to refresh demo data:', error);
      setLastAction('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Demo Mode</h3>
            <p className="text-sm text-gray-600">
              {isDemoMode ? 'Currently showing sample data' : 'Show sample data for demonstrations'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isDemoMode && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshDemoData}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
              title="Refresh demo data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isDemoMode
                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                {isDemoMode ? 'Disabling...' : 'Enabling...'}
              </>
            ) : (
              <>
                {isDemoMode ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Disable Demo
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Enable Demo
                  </>
                )}
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Status indicators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span className={`flex items-center space-x-2 ${
            isDemoMode ? 'text-green-600' : 'text-gray-500'
          }`}>
            {isDemoMode ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Active</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Inactive</span>
              </>
            )}
          </span>
        </div>

        {isDemoMode && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Sample Projects:</span>
              <span className="text-gray-900 font-medium">12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Sample Users:</span>
              <span className="text-gray-900 font-medium">8</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Updated:</span>
              <span className="text-gray-900 font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </>
        )}

        {/* Action feedback */}
        {lastAction && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-2 text-sm p-2 rounded-md ${
              lastAction === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {lastAction === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>
              {lastAction === 'success' 
                ? `Demo mode ${isDemoMode ? 'enabled' : 'disabled'} successfully`
                : 'Operation failed. Please try again.'
              }
            </span>
          </motion.div>
        )}
      </div>

      {/* Warning for production */}
      {isDemoMode && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Demo Mode Active</p>
              <p className="mt-1">
                You're currently viewing sample data. All changes are temporary and will be reset when demo mode is disabled.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
