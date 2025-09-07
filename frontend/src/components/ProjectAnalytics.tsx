import { Project } from '@/types/types';

interface ProjectAnalyticsProps {
  project: Project;
}

export default function ProjectAnalytics({ project }: ProjectAnalyticsProps) {
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Project Analytics</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-gray-400">{project.description || 'No description'}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-sm text-gray-400">Status</div>
            <div className="font-semibold">{project.status}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-sm text-gray-400">Created</div>
            <div className="font-semibold">
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-sm text-gray-400">Tasks</div>
            <div className="font-semibold">{project.tasks?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
