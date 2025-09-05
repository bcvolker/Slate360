import { Project } from '@/types/types';

interface VirtualProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  selectedProjectId?: string;
}

export default function VirtualProjectList({ 
  projects, 
  onSelectProject, 
  selectedProjectId 
}: VirtualProjectListProps) {
  if (!projects.length) {
    return (
      <div className="p-4 text-gray-400 text-center">
        <p>No projects found.</p>
        <p className="text-sm mt-2">Create your first project to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onSelectProject(project)}
          className={`
            p-3 rounded-md cursor-pointer transition-all duration-200
            ${selectedProjectId === project.id
              ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-900'
              : 'bg-gray-800 hover:bg-gray-700 text-white'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{project.name}</p>
              <p className="text-sm text-gray-400 capitalize">{project.status}</p>
            </div>
            <div className="ml-2 text-xs text-gray-500">
              {project.tasks?.length || 0} tasks
            </div>
          </div>
          {project.description && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {project.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
