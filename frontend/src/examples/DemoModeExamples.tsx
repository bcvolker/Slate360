import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DemoModeToggle from '../components/DemoModeToggle';
import DemoBanner from '../components/DemoBanner';
import { Zap, CheckCircle, Star, Users, BarChart3 } from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';

export function DemoModeExamples() {
  const { 
    isDemoMode, 
    projects, 
    users, 
    files, 
    notifications, 
    analytics,
    startWorkflow,
    completeWorkflowStep,
    workflowProgress
  } = useDemo();
  
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleStepComplete = (stepId: string) => {
    completeWorkflowStep(stepId);
  };

  const startWorkflowTour = () => {
    startWorkflow();
    setShowWorkflow(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner - will show when demo mode is active */}
      <DemoBanner />

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Demo Mode Showcase
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience the full power of Slate360 with our comprehensive demo mode. 
              Explore sample projects, test features, and follow an interactive workflow guide.
            </motion.p>
          </div>

          {/* Demo Mode Toggle */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <DemoModeToggle className="text-lg" />
          </motion.div>

          {/* Demo Mode Status */}
          {isDemoMode && (
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🎉 Demo Mode Active!
                </h2>
                <p className="text-lg text-gray-600">
                  You're now exploring Slate360 with sample data and interactive features.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{projects.length}</div>
                  <div className="text-blue-800 font-medium">Sample Projects</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">{users.length}</div>
                  <div className="text-green-800 font-medium">Team Members</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{files.length}</div>
                  <div className="text-purple-800 font-medium">Sample Files</div>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{Math.round(workflowProgress)}%</div>
                  <div className="text-orange-800 font-medium">Workflow Progress</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={startWorkflowTour}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <Zap size={20} />
                  <span>Start Workflow Tour</span>
                </button>
                
                <button
                  onClick={() => setShowWorkflow(true)}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <CheckCircle size={20} />
                  <span>Open Workflow Guide</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Sample Projects Grid */}
          {isDemoMode && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 6).map((project, index) => (
                  <motion.div
                    key={project._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {project.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{project.location.city}, {project.location.state}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>${(((project as any).budget?.estimated ?? 0) / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{(((project as any).timeline?.milestones ?? []).filter((m: any) => m?.completed).length)}/{(((project as any).timeline?.milestones ?? []).length)} milestones</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor((project as any).priority)}`}>
                            {(project as any).priority}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {project.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-500">{project.team.length}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics Overview */}
          {isDemoMode && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo Analytics Overview</h2>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Project Statistics */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <BarChart3 size={24} className="mr-2 text-blue-600" />
                      Project Statistics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Total Projects</span>
                        <span className="font-semibold text-blue-600">{analytics.projectStats.total}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">In Progress</span>
                        <span className="font-semibold text-green-600">{analytics.projectStats.inProgress}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700">Completed</span>
                        <span className="font-semibold text-purple-600">{analytics.projectStats.completed}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-gray-700">Planning</span>
                        <span className="font-semibold text-yellow-600">{analytics.projectStats.planning}</span>
                      </div>
                    </div>
                  </div>

                  {/* Budget Overview */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Star size={24} className="mr-2 text-green-600" />
                      Budget Overview
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Total Budget</span>
                        <span className="font-semibold text-green-600">
                          ${(analytics.budgetOverview.totalBudget / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Total Spent</span>
                        <span className="font-semibold text-blue-600">
                          ${(analytics.budgetOverview.totalSpent / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700">Remaining</span>
                        <span className="font-semibold text-purple-600">
                          ${(analytics.budgetOverview.totalRemaining / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-gray-700">Avg. Completion</span>
                        <span className="font-semibold text-orange-600">
                          {analytics.budgetOverview.averageCompletion}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap size={24} className="mr-2 text-gray-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {analytics.recentActivity.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{activity.action}</span>
                          <span className="text-gray-500">in {activity.project}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>by {activity.user}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Demo Features Grid */}
          {isDemoMode && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Star size={32} className="text-blue-600" />,
                    title: 'Sample Projects',
                    description: 'Explore 5 realistic projects with full details, budgets, and timelines.',
                    color: 'bg-blue-50 border-blue-200'
                  },
                  {
                    icon: <Users size={32} className="text-green-600" />,
                    title: 'Team Collaboration',
                    description: 'See how team members work together with roles and permissions.',
                    color: 'bg-green-50 border-green-200'
                  },
                  {
                    icon: <BarChart3 size={32} className="text-purple-600" />,
                    title: 'Analytics & Reports',
                    description: 'View comprehensive project statistics and budget overviews.',
                    color: 'bg-purple-50 border-purple-200'
                  },
                  {
                    icon: <Zap size={32} className="text-orange-600" />,
                    title: 'File Management',
                    description: 'Test file uploads and management with sample documents.',
                    color: 'bg-orange-50 border-orange-200'
                  },
                  {
                    icon: <Star size={32} className="text-red-600" />,
                    title: 'Project Creation',
                    description: 'Create new demo projects to test the creation workflow.',
                    color: 'bg-red-50 border-red-200'
                  },
                  {
                    icon: <CheckCircle size={32} className="text-indigo-600" />,
                    title: 'Documentation',
                    description: 'Access comprehensive help and documentation throughout.',
                    color: 'bg-indigo-50 border-indigo-200'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-xl border-2 ${feature.color} hover:shadow-md transition-all duration-200`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="text-center">
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          {!isDemoMode && (
            <motion.div
              className="text-center bg-white rounded-2xl shadow-lg p-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Explore?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Enable demo mode to experience the full Slate360 platform with sample data, 
                interactive features, and a guided workflow tour.
              </p>
              <div className="flex justify-center">
                <DemoModeToggle className="text-lg" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Workflow Walkthrough Modal */}
      {showWorkflow && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowWorkflow(false)}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Workflow Guide</h2>
                <button
                  onClick={() => setShowWorkflow(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Introduction</h3>
                  <p className="text-gray-900">
                    Welcome to the Slate360 Demo Mode! This guide will help you navigate through the platform's key features and workflows.
                    You can interact with the demo data and test various functionalities.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h3>
                  <ul className="list-disc list-inside text-gray-900 space-y-2">
                    <li>Click on the "Demo Mode Toggle" to enable/disable demo mode.</li>
                    <li>Explore the "Sample Projects" to see real-world examples.</li>
                    <li>Use the "Workflow Tour" to see how tasks are managed.</li>
                    <li>Check the "Analytics Overview" to see project statistics.</li>
                    <li>Test "File Management" and "Project Creation" features.</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">Project Management</h4>
                    <p className="text-gray-700">Create, edit, and manage projects with detailed information.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 mb-2">Team Collaboration</h4>
                    <p className="text-gray-700">Assign roles, manage permissions, and track team activity.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-900 mb-2">Analytics & Reports</h4>
                    <p className="text-gray-700">View detailed project statistics, budget overviews, and activity logs.</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-900 mb-2">File Management</h4>
                    <p className="text-gray-700">Upload, organize, and manage sample documents and files.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{selectedProject.name}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-gray-900">{selectedProject.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {selectedProject.type}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Priority</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor((selectedProject as any).priority)}`}>
                        {(selectedProject as any).priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Location & Budget</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900">
                        {selectedProject.location.address}<br />
                        {selectedProject.location.city}, {selectedProject.location.state} {selectedProject.location.zipCode}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Budget</label>
                      <p className="text-2xl font-bold text-green-600">
                        ${(((selectedProject as any).budget?.estimated ?? 0) / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-sm text-gray-500">
                        ${(((selectedProject as any).budget?.actual ?? 0) / 1000000).toFixed(1)}M spent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProject.team.map((member: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.role}</div>
                      <div className="text-sm text-blue-600">{member.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default DemoModeExamples;
