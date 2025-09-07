// frontend/src/components/VirtualProjectList.tsx
import { Project } from '@/types/project';

interface VirtualProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export default function VirtualProjectList({ projects, onSelectProject }: VirtualProjectListProps) {
  if (!projects.length) {
    return <div className="p-4 text-gray-400">No projects found.</div>;
  }
  return (
    <ul className="space-y-2">
      {projects.map((project) => (
        <li
          key={project.id}
          onClick={() => onSelectProject(project)}
          className="p-3 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
        >
          <p className="font-semibold truncate">{project.name}</p>
          <p className="text-sm text-gray-400 capitalize">{project.status}</p>
        </li>
      ))}
    </ul>
  );
}