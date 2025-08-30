'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Shield, Users, BarChart3, Wifi, Zap, Plus, Search, Filter } from 'lucide-react';
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

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState('loading');
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

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
  );

  // Check authentication status
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // State for user menu and search
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Filter projects based on search and status
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
                SLATE360
              </span>
            </div>

            {/* Search and Filters */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <DemoModeToggle />
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {session?.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block">{session?.user?.email || 'User'}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </button>
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setShowUserMenu(false);
                        router.push('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      {isDemoMode && (
        <DemoBanner className="mb-6" />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.email || 'User'}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-semibold text-gray-900">{projects?.length || 0}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {projects?.filter(p => p.status === 'active').length || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {projects?.reduce((total, p) => total + (p.team?.length || 0), 0) || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Wifi className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sync Status</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          
          {!isOnline && (
            <div className="flex items-center space-x-2 text-orange-600">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">Working offline</span>
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredProjects.length} of {projects?.length || 0} projects
                </p>
              </div>
              
              {isLoading ? (
                <div className="p-6 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">Loading projects...</p>
                </div>
              ) : filteredProjects.length > 0 ? (
                <VirtualProjectList
                  projects={filteredProjects}
                  onEditProject={(project) => {
                    // Handle edit
                  }}
                  onDeleteProject={(projectId) => {
                    // Handle delete
                  }}
                />
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No projects match your filters.' 
                      : 'No projects yet. Create your first project to get started!'}
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Project
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            {/* Project Analytics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Analytics</h3>
              <ProjectAnalytics projects={projects || []} />
            </div>

            {/* Sync Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Status</h3>
              <SyncStatus 
                showDetails={true}
                showActions={true}
                className=""
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  New Project
                </button>
                <button
                  onClick={() => router.push('/dashboard/project-hub')}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  View All Projects
                </button>
                {isCEO && (
                  <button
                    onClick={() => router.push('/dashboard/ceo')}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    CEO Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Workflow Walkthrough */}
        {isDemoMode && (
          <div className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Demo Mode Active</h3>
              <p className="text-blue-700 text-sm">
                You're currently in demo mode. Explore the dashboard features with sample data.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <ProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={async (projectData) => {
            try {
              await createProject(projectData);
              setShowCreateModal(false);
            } catch (error) {
              console.error('Failed to create project:', error);
            }
          }}
          mode="create"
        />
      )}

      {/* Help and Process Guide */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <button
          onClick={() => router.push('/dashboard/help')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Help
        </button>
        <button
          onClick={() => router.push('/dashboard/process-guide')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          Process Guide
        </button>
      </div>
    </div>
  );
}
