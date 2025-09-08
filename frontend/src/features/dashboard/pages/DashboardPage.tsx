'use client';

import { useState, useEffect } from 'react';
import { UnifiedProject } from '@/types/project';
import { useProjects } from '../hooks/useProjects';
import VirtualProjectList from '../components/VirtualProjectList';
import ProjectAnalytics from '../components/ProjectAnalytics';

export default function DashboardPage() {
  const { projects, isLoading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | null>(null);

  // Automatically select the first project once data has loaded
  useEffect(() => {
    if (!isLoading && projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [isLoading, projects, selectedProject]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Local Projects</h2>
          <VirtualProjectList 
            projects={projects} 
            onSelectProject={setSelectedProject}
            selectedProjectId={selectedProject?._id}
          />
        </div>
      </aside>
      
      <main className="md:col-span-3">
        {selectedProject ? (
          <ProjectAnalytics project={selectedProject} />
        ) : (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-gray-500 text-lg">Select a project to view analytics.</p>
              {projects.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">No projects available.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
