'use client';

import React, { useState, useEffect } from 'react';
import { useOfflineProjects } from '../hooks/useOfflineProjects';

export default function OfflineProjectsExample() {
  const {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    forceSync,
    isOnline,
    syncStatus
  } = useOfflineProjects();

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'draft' as const,
    client: {
      name: '',
      email: '',
      phone: '',
      company: ''
    },
    startDate: '',
    team: [] as string[],
    files: 0,
    images: 0,
    videos: 0
  });

  const [editingProject, setEditingProject] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newProject.name.trim() && newProject.client.name.trim() && newProject.client.email.trim()) {
      await createProject(newProject);
      setNewProject({
        name: '',
        description: '',
        status: 'draft',
        client: {
          name: '',
          email: '',
          phone: '',
          company: ''
        },
        startDate: '',
        team: [],
        files: 0,
        images: 0,
        videos: 0
      });
    }
  };

  const handleEdit = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setNewProject({
        name: project.name,
        description: project.description,
        status: project.status,
        client: {
          name: project.client.name,
          email: project.client.email,
          phone: project.client.phone || '',
          company: project.client.company || ''
        },
        startDate: project.startDate,
        team: project.team,
        files: project.files,
        images: project.images,
        videos: project.videos
      });
      setEditingProject(projectId);
    }
  };

  const handleUpdate = async () => {
    if (editingProject && newProject.name.trim() && newProject.client.name.trim() && newProject.client.email.trim()) {
      await updateProject(editingProject, newProject);
      setEditingProject(null);
      setNewProject({
        name: '',
        description: '',
        status: 'draft',
        client: {
          name: '',
          email: '',
          phone: '',
          company: ''
        },
        startDate: '',
        team: [],
        files: 0,
        images: 0,
        videos: 0
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setNewProject({
      name: '',
      description: '',
      status: 'draft',
      client: {
        name: '',
        email: '',
        phone: '',
        company: ''
      },
      startDate: '',
      team: [],
      files: 0,
      images: 0,
      videos: 0
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading offline projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Offline Projects Example</h1>
        
        {/* Status Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {isOnline ? 'Online' : 'Offline'} Mode
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Last Sync: {syncStatus?.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never'}</span>
              <span>Pending: {syncStatus?.pendingProjects || 0}</span>
              <span>Failed: {syncStatus?.failedProjects || 0}</span>
            </div>
            
            <button
              onClick={forceSync}
              disabled={!isOnline}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sync Now
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Project Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                value={newProject.client.name}
                onChange={(e) => setNewProject(prev => ({ 
                  ...prev, 
                  client: { ...prev.client, name: e.target.value } 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
              <input
                type="email"
                value={newProject.client.email}
                onChange={(e) => setNewProject(prev => ({ 
                  ...prev, 
                  client: { ...prev.client, email: e.target.value } 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Members (comma-separated)</label>
              <input
                type="text"
                value={newProject.team.join(', ')}
                onChange={(e) => setNewProject(prev => ({ 
                  ...prev, 
                  team: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe, Jane Smith"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Files</label>
              <input
                type="number"
                value={newProject.files}
                onChange={(e) => setNewProject(prev => ({ ...prev, files: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
              <input
                type="number"
                value={newProject.images}
                onChange={(e) => setNewProject(prev => ({ ...prev, images: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Videos</label>
              <input
                type="number"
                value={newProject.videos}
                onChange={(e) => setNewProject(prev => ({ ...prev, videos: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            {editingProject ? (
              <>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Update Project
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Project
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Projects ({projects.length})</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {projects.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No projects yet. Add your first project above!</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mt-1">{project.description}</p>
                    
                    <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                      <span>Client: {project.client.name}</span>
                      {project.startDate && (
                        <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                      )}
                      <span>Team: {project.team.length} members</span>
                      <span>Files: {project.files}</span>
                      <span>Images: {project.images}</span>
                      <span>Videos: {project.videos}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(project.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
