import { Project } from '@/types';

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
            <div className="text-sm text-gray-400">ID</div>
            <div className="font-semibold text-xs">{project.id}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-sm text-gray-400">BIM Model</div>
            <div className="font-semibold">{project.bimModelUrl ? 'Available' : 'Not Available'}</div>
          </div>
        </div>
        {project.imageUrl && (
          <div className="mt-4">
            <img 
              src={project.imageUrl} 
              alt={project.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

