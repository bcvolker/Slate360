// frontend/src/app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Project } from '@/types';
import { getProjects } from '@/lib/api/projects';
import VirtualProjectList from '@/components/VirtualProjectList';
import ProjectAnalytics from '@/components/ProjectAnalytics';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0 && !selectedProject) {
          setSelectedProject(data[0]);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [selectedProject]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading Dashboard...</div>;
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
            <p>Select a project to view analytics.</p>
          </div>
        )}
      </main>
    </div>
  );
}