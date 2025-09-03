'use client';
import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { useOfflineProjects } from '@/hooks/useOfflineProjects';
import VirtualProjectList from '@/components/VirtualProjectList';
import ProjectAnalytics from '@/components/ProjectAnalytics';

export default function DashboardPage() {
  const { projects, isLoading } = useOfflineProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Automatically select the first project once data is loaded
  useEffect(() => {
    if (!isLoading && projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [isLoading, projects, selectedProject]);

  if (isLoading) {
    return <div className="p-8">Loading Dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      <aside className="md:col-span-1">
        <h2 className="text-xl font-bold mb-4">Projects</h2>
        <VirtualProjectList projects={projects} onSelectProject={setSelectedProject} />
      </aside>
      <main className="md:col-span-3">
        {selectedProject ? (
          <ProjectAnalytics project={selectedProject} />
        ) : (
          <div className="flex items-center justify-center h-full rounded-lg bg-gray-900">
            <p>Select a project to view details.</p>
          </div>
        )}
      </main>
    </div>
  );
}
