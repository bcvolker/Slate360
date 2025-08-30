'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Wifi, 
  BarChart3, 
  Smartphone, 
  HelpCircle, 
  BookOpen,
  Play,
  Square,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import DemoModeToggle from '../../components/DemoModeToggle';
import { useDemoMode } from '../../hooks/useDemoMode';
import { useOfflineProjects } from '../../hooks/useOfflineProjects';
import { ProjectAnalytics } from '../../components/ProjectAnalytics';
import { VirtualProjectList } from '../../components/VirtualProjectList';
import { Modal, ConfirmModal, FormModal } from '../../components/Modal';
import { SyncStatus } from '../../components/SyncStatus';

export default function ExamplesPage() {
  const { isDemoMode, demoData, toggleDemoMode } = useDemoMode();
  const { 
    projects, 
    loading: isLoading, 
    syncStatus, 
    forceSync: syncProjects, 
    isOnline 
  } = useOfflineProjects();

  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowFormModal(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleConfirmAction = () => {
    console.log('Action confirmed!');
    setShowConfirmModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Slate360 Feature Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore all the advanced features including demo mode, offline sync, performance optimizations, 
            advanced analytics, specialized modals, and mobile responsiveness.
          </p>
        </motion.div>

        {/* Demo Mode Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                <Zap className="inline w-6 h-6 text-yellow-500 mr-2" />
                Demo Mode Features
              </h2>
              <p className="text-gray-600">
                Toggle demo mode to explore sample data and workflows
              </p>
            </div>
            <DemoModeToggle />
          </div>

          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Demo Mode Active
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{demoData.projectCount}</div>
                  <div className="text-sm text-blue-700">Sample Projects</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-purple-600">{demoData.userCount}</div>
                  <div className="text-sm text-purple-700">Demo Users</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-green-600">
                    {demoData.lastUpdated ? '✓' : '—'}
                  </div>
                  <div className="text-sm text-green-700">Last Updated</div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* Offline Sync Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                <Wifi className="inline w-6 h-6 text-green-500 mr-2" />
                Enhanced Offline Sync
              </h2>
              <p className="text-gray-600">
                Work seamlessly with or without internet connection
              </p>
            </div>
            <SyncStatus showDetails={true} showActions={true} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Sync Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Network Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Projects:</span>
                  <span className="font-medium">{syncStatus?.totalProjects || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Synced Projects:</span>
                  <span className="font-medium">{syncStatus?.syncedProjects || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Sync:</span>
                  <span className="font-medium">{syncStatus?.pendingProjects || 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Offline-first architecture
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Automatic conflict resolution
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Batch synchronization
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Retry mechanisms
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Performance Optimizations Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <RefreshCw className="inline w-6 h-6 text-blue-500 mr-2" />
              Performance Optimizations
            </h2>
            <p className="text-gray-600">
              Virtual scrolling, lazy loading, and efficient data management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Virtual Scrolling</h3>
              <div className="bg-gray-50 rounded-lg p-4 h-96">
                <VirtualProjectList
                  projects={projects}
                  onProjectClick={(project: any) => console.log('Project clicked:', project)}
                  onEditProject={(project: any) => console.log('Edit project:', project)}        
                  onDeleteProject={(project: any) => console.log('Delete project:', project)}
                  onViewProject={(project: any) => console.log('View project:', project)}
                  loading={isLoading}
                  emptyMessage="No projects to display"
                  className="h-full"
                  showActions={false}
                  itemHeight={80}
                  containerHeight={350}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Optimization Features</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Virtual scrolling for large lists
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Lazy loading of components
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Efficient state management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Optimized re-renders
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">
                      {projects.length}
                    </div>
                    <div className="text-sm text-blue-700">Projects Loaded</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">
                      {isLoading ? '...' : '✓'}
                    </div>
                    <div className="text-sm text-green-700">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Advanced Analytics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <BarChart3 className="inline w-6 h-6 text-purple-500 mr-2" />
              Advanced Analytics
            </h2>
            <p className="text-gray-600">
              Comprehensive project insights and performance metrics
            </p>
          </div>

          <ProjectAnalytics
            projects={projects}
            showCharts={true}
            showMetrics={true}
            showTrends={true}
            timeRange="all"
            className="bg-gray-50 rounded-lg p-6"
          />
        </motion.section>

        {/* Specialized Modals Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <Info className="inline w-6 h-6 text-indigo-500 mr-2" />
              Specialized Modals
            </h2>
            <p className="text-gray-600">
              Different modal types for various use cases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h4 className="font-medium text-gray-900 mb-2">Basic Modal</h4>
              <p className="text-sm text-gray-600">Simple content display with animations</p>
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h4 className="font-medium text-gray-900 mb-2">Confirm Modal</h4>
              <p className="text-sm text-gray-600">User confirmation with different variants</p>
            </button>

            <button
              onClick={() => setShowFormModal(true)}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h4 className="font-medium text-gray-900 mb-2">Form Modal</h4>
              <p className="text-sm text-gray-600">Form input with validation and submission</p>
            </button>
          </div>
        </motion.section>

        {/* Mobile Responsiveness Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <Smartphone className="inline w-6 h-6 text-pink-500 mr-2" />
              Mobile Responsiveness
            </h2>
            <p className="text-gray-600">
              Optimized for all device sizes and orientations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsive Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Mobile-first CSS approach
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Touch-friendly interactions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Adaptive layouts
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Optimized performance
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-3">Breakpoint Preview</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mobile:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">320px+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tablet:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">768px+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Desktop:</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">1024px+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Large:</span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded">1280px+</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Enhanced Components Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <HelpCircle className="inline w-6 h-6 text-orange-500 mr-2" />
              Enhanced Components
            </h2>
            <p className="text-gray-600">
              HelpIcon and ProcessGuide with markdown support and animations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">HelpIcon Component</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Basic help icon</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Markdown support</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ProcessGuide Component</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Markdown support</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Basic Modal Example"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is a basic modal with a title and content. You can customize the size, 
            animation, and other properties as needed.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Responsive design</li>
              <li>• Smooth animations</li>
              <li>• Keyboard navigation (ESC to close)</li>
              <li>• Click outside to close</li>
              <li>• Focus management</li>
            </ul>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
        confirmText="Proceed"
        cancelText="Cancel"
        confirmVariant="danger"
      >
        <div className="text-sm text-gray-600">
          Please confirm your action. This change cannot be undone.
        </div>
      </ConfirmModal>

      <FormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Contact Form"
        onSubmit={handleFormSubmit}
        submitText="Send Message"
        cancelText="Cancel"
        submitVariant="primary"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
