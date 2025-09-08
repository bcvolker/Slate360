import { UnifiedProject } from '@/types/project';

interface ProjectAnalyticsProps {
  project: UnifiedProject;
}

export default function ProjectAnalytics({ project }: ProjectAnalyticsProps) {
  const completedTasks = project.team?.filter(member => member.isActive).length || 0;
  const totalTasks = project.team?.length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
        <p className="text-gray-400">
          {project.description || 'No description available'}
        </p>
      </div>

      {/* Project Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Status</div>
          <div className="font-semibold text-white capitalize">{project.status}</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Type</div>
          <div className="font-semibold text-white capitalize">{project.type}</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Created</div>
          <div className="font-semibold text-white">
            {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Last Updated</div>
          <div className="font-semibold text-white">
            {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>

      {/* Task Progress */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white">Task Progress</h3>
          <span className="text-sm text-gray-400">{completedTasks}/{totalTasks} active</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-400 mt-1">{completionRate}% active</div>
      </div>

      {/* Project Details */}
      {project.client && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-white mb-3">Client Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-400">Name: </span>
              <span className="text-white">{project.client.name}</span>
            </div>
            <div>
              <span className="text-sm text-gray-400">Email: </span>
              <span className="text-white">{project.client.email}</span>
            </div>
            {project.client.phone && (
              <div>
                <span className="text-sm text-gray-400">Phone: </span>
                <span className="text-white">{project.client.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {project.location && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-white mb-3">Location</h3>
          <div className="text-white">
            {project.location.address}<br />
            {project.location.city}, {project.location.state} {project.location.zipCode}<br />
            {project.location.country}
          </div>
        </div>
      )}

      {/* Team */}
      {project.team && project.team.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-3">Team Members</h3>
          <div className="space-y-2">
            {project.team.map((member, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="text-white">User {String(member.userId)}</span>
                  <span className="text-sm text-gray-400 ml-2 capitalize">({member.role})</span>
                </div>
                <div className="text-sm text-gray-400">
                  {member.permissions.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
