'use client';

import Toolbar from '@/components/dashboard/Toolbar';

export default function ProjectHubPage() {
  return (
    <div>
      <Toolbar title="Project Hub" />
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Active Projects</h3>
            <p className="text-gray-300">Manage your ongoing construction projects</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Team Collaboration</h3>
            <p className="text-gray-300">Work together with your team members</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Document Management</h3>
            <p className="text-gray-300">Organize and share project documents</p>
          </div>
        </div>
      </div>
    </div>
  );
}
