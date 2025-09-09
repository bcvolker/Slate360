import { UnifiedProject } from '@/types/project';

interface ProjectAnalyticsProps {
  project: UnifiedProject;
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
            <div className="text-sm text-gray-400">ID</div>
            <div className="font-semibold text-xs">{project._id}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-sm text-gray-400">Type</div>
            <div className="font-semibold">{project.type}</div>
          </div>
        </div>
        {project.location && (
          <div className="mt-4">
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-sm text-gray-400">Location</div>
              <div className="font-semibold">{project.location.address}, {project.location.city}, {project.location.state}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

