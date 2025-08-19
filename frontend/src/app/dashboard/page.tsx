'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Shield, Users, BarChart3, Wifi, Zap } from 'lucide-react';
import { useDemoMode } from '../../hooks/useDemoMode';
import { useOfflineProjects } from '../../hooks/useOfflineProjects';
import { useRole } from '../../hooks/useRole';
import DemoModeToggle from '../../components/DemoModeToggle';
import { ProjectAnalytics } from '../../components/ProjectAnalytics';
import { VirtualProjectList } from '../../components/VirtualProjectList';
import { ProjectModal } from '../../components/ProjectModal';
import { Modal, ConfirmModal, FormModal } from '../../components/Modal';
import { SyncStatus } from '../../components/SyncStatus';
import { DemoBanner } from '../../components/DemoBanner';
import { DemoWorkflowWalkthrough } from '../../components/DemoWorkflowWalkthrough';
import { HelpIcon } from '../../components/HelpIcon';
import { ProcessGuide } from '../../components/ProcessGuide';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isDemoMode, demoData } = useDemoMode();
  const { isAuthenticated, userRole, userTier, isCEO, isAdmin } = useRole();
  const { 
    projects, 
    loading: isLoading, 
    syncStatus, 
    forceSync: syncProjects, 
    createProject, 
    updateProject, 
    deleteProject,
    isOnline,
    error
  } = useOfflineProjects();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      {isDemoMode && (
        <DemoBanner className="mb-6" />
      )}

      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  Welcome back, {session.user?.name || 'User'}!
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm text-gray-600"
                >
                  {isDemoMode 
                    ? `Demo Mode - ${demoData.projectCount} sample projects loaded`
                    : `${projects.length} projects • Last sync: ${syncStatus?.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never'}`
                  }
                </motion.p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Demo Mode Toggle */}
                <DemoModeToggle 
                  className="hidden sm:block"
                />

                {/* Sync Status */}
                <SyncStatus className="hidden sm:block" />

                {/* Create Project Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  New Project
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter((p: any) => p.status === 'active').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Wifi className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sync Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">User Role</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {userRole || 'User'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Analytics Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ProjectAnalytics
                  projects={projects}
                  showCharts={true}
                  showMetrics={true}
                  showTrends={true}
                  timeRange="all"
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                />
              </motion.div>
            </div>
          </div>

          {/* Projects List */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <VirtualProjectList
                projects={projects}
                onProjectClick={(project: any) => console.log('Project clicked:', project)}
                onEditProject={(project: any) => console.log('Edit project:', project)}
                onDeleteProject={(project: any) => console.log('Delete project:', project)}
                onViewProject={(project: any) => console.log('View project:', project)}
                loading={isLoading}
                emptyMessage="No projects found. Create your first project to get started!"
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                showActions={true}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Help and Process Guide */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
        <HelpIcon
          content={`
# Dashboard Help

## Features
- **Demo Mode**: Toggle to explore with sample data
- **Offline Sync**: Work without internet connection
- **Advanced Analytics**: Comprehensive project insights
- **Virtual Scrolling**: Efficient large project lists
- **Mobile Optimized**: Responsive design for all devices

## Quick Actions
- Use the search bar to find projects quickly
- Apply filters to narrow down results
- Switch between grid and list views
- Export projects for backup or sharing
          `}
          title="Dashboard Help"
          size="lg"
          position="left"
          maxWidth={350}
          trigger="click"
        />
        
        <ProcessGuide
          title="Quick Start"
          steps={[
            {
              id: 'step1',
              title: 'Explore Demo Mode',
              description: 'Toggle demo mode to see sample projects and workflows',
              status: 'completed',
              tips: ['Click the demo mode toggle in the header']
            },
            {
              id: 'step2',
              title: 'Create a Project',
              description: 'Add your first project using the "New Project" button',
              status: 'active',
              tips: ['Fill in all required fields', 'Add relevant tags']
            },
            {
              id: 'step3',
              title: 'Use Analytics',
              description: 'Review project insights in the analytics sidebar',
              status: 'pending',
              tips: ['Check budget utilization', 'Monitor team performance']
            },
            {
              id: 'step4',
              title: 'Sync Offline Changes',
              description: 'Ensure your offline work is synchronized when online',
              status: 'pending',
              tips: ['Check sync status indicator', 'Resolve any conflicts']
            }
          ]}
          variant="compact"
          theme="blue"
          maxHeight={400}
        />
      </div>
    </div>
  );
}
