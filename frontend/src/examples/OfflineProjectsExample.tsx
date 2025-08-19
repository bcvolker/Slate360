import React, { useState } from 'react';
import { useOfflineProjects, useOfflineProject, useFilteredOfflineProjects } from '../hooks/useOfflineProjects';
import { SyncStatus, CompactSyncStatus } from '../components/SyncStatus';
import { toast } from 'react-hot-toast';

// Example 1: Basic offline projects list
export function OfflineProjectsList() {
  const { 
    projects, 
    loading, 
    error, 
    isOnline, 
    createProject, 
    updateProject, 
    deleteProject,
    refreshProjects 
  } = useOfflineProjects();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    type: 'residential' as const,
    status: 'planning' as const,
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    client: {
      name: '',
      email: ''
    }
  });

  const handleCreateProject = async () => {
    try {
      await createProject(newProject);
      setShowCreateForm(false);
      setNewProject({
        name: '',
        description: '',
        type: 'residential',
        status: 'planning',
        location: {
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
        client: {
          name: '',
          email: ''
        }
      });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (loading) {
    return (
      <div className="offline-projects-list">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offline-projects-list">
        <div className="error-message p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={refreshProjects}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="offline-projects-list">
      {/* Header with sync status */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Projects ({projects.length})</h2>
        <CompactSyncStatus />
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="create-project-form mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newProject.type}
              onChange={(e) => setNewProject(prev => ({ ...prev, type: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="renovation">Renovation</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Client Name"
              value={newProject.client.name}
              onChange={(e) => setNewProject(prev => ({ 
                ...prev, 
                client: { ...prev.client, name: e.target.value } 
              }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleCreateProject}
              disabled={!newProject.name || !newProject.description}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Project
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create Project Button */}
      {!showCreateForm && (
        <button
          onClick={() => setShowCreateForm(true)}
          className="mb-6 px-4 py-2 bg-green-500 textWhite rounded-md hover:bg-green-600"
        >
          + Create New Project
        </button>
      )}

      {/* Projects List */}
      <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard 
            key={project._id} 
            project={project} 
            onUpdate={updateProject}
            onDelete={deleteProject}
          />
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="empty-state text-center py-12">
          <p className="text-gray-500 text-lg">No projects yet</p>
          <p className="text-gray-400 text-sm mt-2">
            {isOnline ? 'Create your first project to get started' : 'You\'re offline. Create projects that will sync when you\'re back online.'}
          </p>
        </div>
      )}
    </div>
  );
}

// Example 2: Individual project card
function ProjectCard({ 
  project, 
  onUpdate, 
  onDelete 
}: { 
  project: any; 
  onUpdate: (id: string, data: any) => Promise<any>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(project);

  const handleSave = async () => {
    try {
      await onUpdate(project._id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await onDelete(project._id);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const getSyncStatusBadge = () => {
    switch (project._syncStatus) {
      case 'synced':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Synced</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  return (
    <div className="project-card border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Project Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        {getSyncStatusBadge()}
      </div>

      {/* Project Details */}
      {isEditing ? (
        <div className="edit-form space-y-3">
          <input
            type="text"
            value={editData.description}
            onChange={(e) => setEditData((prev: any) => ({ ...prev, description: e.target.value }))}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <select
            value={editData.status}
            onChange={(e) => setEditData((prev: any) => ({ ...prev, status: e.target.value }))}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="project-details space-y-2">
          <p className="text-gray-600 text-sm">{project.description}</p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className={`px-2 py-1 rounded-full ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
              {project.type}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Client: {project.client.name}
          </p>
          {project._lastSync && (
            <p className="text-xs text-gray-400">
              Last sync: {new Date(project._lastSync).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Project Actions */}
      {!isEditing && (
        <div className="project-actions flex space-x-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// Example 3: Filtered projects with search
export function FilteredOfflineProjects() {
  const [filter, setFilter] = useState({
    status: '',
    type: '',
    search: ''
  });

  const { 
    projects, 
    loading, 
    error, 
    isOnline, 
    totalCount, 
    filteredCount 
  } = useFilteredOfflineProjects(filter);

  return (
    <div className="filtered-offline-projects">
      <h3 className="text-xl font-semibold mb-4">Filtered Projects</h3>
      
      {/* Filters */}
      <div className="filters mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="renovation">Renovation</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredCount} of {totalCount} projects
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Filtering projects...</p>
        </div>
      ) : (
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onUpdate={async (_id: string, _data: any) => Promise.resolve(null)}
              onDelete={async (_id: string) => Promise.resolve()}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="empty-state text-center py-12">
          <p className="text-gray-500 text-lg">No projects match your filters</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}

// Example 4: Project detail view with offline support
export function OfflineProjectDetail({ projectId }: { projectId: string }) {
  const { 
    project, 
    loading, 
    error, 
    isOnline, 
    updateProject, 
    deleteProject,
    isOffline,
    syncStatus,
    lastSync 
  } = useOfflineProject(projectId);

  if (loading) {
    return (
      <div className="offline-project-detail">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading project...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="offline-project-detail">
        <div className="error-message p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error: {error || 'Project not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="offline-project-detail">
      {/* Project Header */}
      <div className="project-header mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-2">{project.description}</p>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              syncStatus === 'synced' ? 'bg-green-100 text-green-800' :
              syncStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {syncStatus}
            </div>
            {lastSync && (
              <p className="text-xs text-gray-500 mt-1">
                Last sync: {new Date(lastSync).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Offline Notice */}
      {isOffline && (
        <div className="offline-notice mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
            <div>
              <p className="text-yellow-800 font-medium">You're currently offline</p>
              <p className="text-yellow-700 text-sm">
                Changes will be saved locally and synced when you're back online.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Project Content */}
      <div className="project-content grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900">{project.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-gray-900">{project.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-gray-900">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Updated</label>
                <p className="text-gray-900">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <p className="text-gray-900">
              {project.location.address}, {project.location.city}, {project.location.state} {project.location.zipCode}
            </p>
          </div>

          {/* Client */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Client</h2>
            <p className="text-gray-900 font-medium">{project.client.name}</p>
            <p className="text-gray-600">{project.client.email}</p>
            {project.client.company && (
              <p className="text-gray-600">{project.client.company}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sync Status */}
          <SyncStatus showDetails={false} showActions={true} />
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Edit Project
              </button>
              <button className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
