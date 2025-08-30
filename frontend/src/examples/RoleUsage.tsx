'use client';

import React from 'react';
import { useRole } from '../hooks/useRole';

// Mock feature flags hook - replace with actual implementation
const useFeatureFlags = () => {
  return {
    canUseAdvanced3D: false,
    canCreateTours: false,
    canCollaborate: false,
    tourLimit: 5,
    storageLimit: '10GB'
  };
};

// Mock access denied component
const AccessDenied = ({ message }: { message: string }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <p className="text-red-800">{message}</p>
  </div>
);

// Example 1: Basic role checking
function BasicRoleCheck() {
  const { isCEO, isAdmin, isPremium } = useRole();

  return (
    <div className="p-4 border rounded-md">
      <h3>Basic Role Check</h3>
      <p>CEO: {isCEO ? '✅ Yes' : '❌ No'}</p>
      <p>Admin: {isAdmin ? '✅ Yes' : '❌ No'}</p>
      <p>Premium: {isPremium ? '✅ Yes' : '❌ No'}</p>
    </div>
  );
}

// Example 2: Conditional rendering based on role
function ConditionalRendering() {
  const { isCEO, isAdmin } = useRole();

  return (
    <div className="p-4 border rounded-md">
      <h3>Conditional Rendering</h3>
      
      {isCEO && (
        <div className="bg-yellow-50 p-3 border border-yellow-200 rounded-md">
          <h4>CEO Dashboard</h4>
          <p>Welcome to the executive dashboard!</p>
        </div>
      )}
      
      {isAdmin && (
        <div className="bg-blue-50 p-3 border border-blue-200 rounded-md">
          <h4>Admin Panel</h4>
          <p>Manage users and system settings.</p>
        </div>
      )}
      
      {!isCEO && !isAdmin && (
        <div className="bg-gray-50 p-3 border border-gray-200 rounded-md">
          <p>Standard user view</p>
        </div>
      )}
    </div>
  );
}

// Example 3: Feature access control
function FeatureAccessControl() {
  const { isPremium } = useRole();
  const {
    canUseAdvanced3D,
    canCreateTours,
    canCollaborate,
    tourLimit,
    storageLimit
  } = useFeatureFlags();

  return (
    <div className="p-4 border rounded-md">
      <h3>Feature Access Control</h3>
      
      <div>
        <h3>3D Modeling</h3>
        <p>Basic 3D: ✅ Available</p>
        <p>Advanced 3D: {canUseAdvanced3D ? '✅ Available' : '❌ Premium Required'}</p>
      </div>
      
      <div>
        <h3>360° Tours</h3>
        <p>Create Tours: {canCreateTours ? '✅ Available' : '❌ Premium Required'}</p>
        <p>Tour Limit: {tourLimit === -1 ? 'Unlimited' : `${tourLimit} tours`}</p>
      </div>
      
      <div>
        <h3>Collaboration</h3>
        <p>Team Collaboration: {canCollaborate ? '✅ Available' : '❌ Premium Required'}</p>
      </div>
      
      <div>
        <h3>Storage</h3>
        <p>Storage Limit: {storageLimit}</p>
      </div>
    </div>
  );
}

// Example 4: Protected content
function ProtectedContent() {
  const { isAdmin, isPremium } = useRole();

  if (!isAdmin && !isPremium) {
    return <AccessDenied message="This content requires admin or premium access." />;
  }

  return (
    <div className="p-4 border rounded-md">
      <h3>Protected Content</h3>
      <p>This is sensitive information only visible to admins and premium users.</p>
      
      {isAdmin && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <h4>Admin Only Section</h4>
          <p>Super secret admin information here!</p>
        </div>
      )}
    </div>
  );
}

// Example 5: Role-based actions
function RoleBasedActions() {
  const { isCEO, isAdmin } = useRole();

  const handleDeleteUser = () => {
    if (!isAdmin) {
      alert('Only admins can delete users');
      return;
    }
    // Delete user logic
    console.log('Deleting user...');
  };

  const handleSystemShutdown = () => {
    if (!isCEO) {
      alert('Only CEOs can shut down the system');
      return;
    }
    // System shutdown logic
    console.log('Shutting down system...');
  };

  return (
    <div className="p-4 border rounded-md">
      <h3>Role-Based Actions</h3>
      
      <div className="space-y-2">
        <button
          onClick={handleDeleteUser}
          className={`px-4 py-2 rounded-md ${
            isAdmin 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
          disabled={!isAdmin}
        >
          Delete User
        </button>
        
        <button
          onClick={handleSystemShutdown}
          className={`px-4 py-2 rounded-md ${
            isCEO 
              ? 'bg-red-800 text-white hover:bg-red-900' 
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
          disabled={!isCEO}
        >
          System Shutdown
        </button>
      </div>
    </div>
  );
}

// Example 6: Dashboard component with role-based navigation
function Dashboard() {
  const { isCEO, isAdmin, isManager, isPremium } = useRole();
  const { canAccessAPI, canWhiteLabel } = useFeatureFlags();

  return (
    <div className="p-4 border rounded-md">
      <h3>Dashboard Navigation</h3>
      
      <nav className="space-y-2">
        <a href="/dashboard" className="block p-2 bg-blue-50 hover:bg-blue-100 rounded">
          Home Dashboard
        </a>
        
        {isPremium && (
          <a href="/dashboard/premium" className="block p-2 bg-purple-50 hover:bg-purple-100 rounded">
            Premium Features
          </a>
        )}
        
        {canAccessAPI && (
          <a href="/dashboard/api" className="block p-2 bg-green-50 hover:bg-green-100 rounded">
            API Access
          </a>
        )}
        
        {isManager && (
          <a href="/dashboard/team" className="block p-2 bg-yellow-50 hover:bg-yellow-100 rounded">
            Team Management
          </a>
        )}
        
        {isAdmin && (
          <>
            <a href="/dashboard/users" className="block p-2 bg-red-50 hover:bg-red-100 rounded">
              User Management
            </a>
            <a href="/dashboard/settings" className="block p-2 bg-gray-50 hover:bg-gray-100 rounded">
              System Settings
            </a>
          </>
        )}
        
        {isCEO && (
          <a href="/dashboard/executive" className="block p-2 bg-indigo-50 hover:bg-indigo-100 rounded">
            Executive Overview
          </a>
        )}
      </nav>
    </div>
  );
}

// Example 7: Role-based data filtering
function RoleBasedDataFilter() {
  const { isAdmin, isManager } = useRole();
  
  // Mock data - in real app, this would come from API
  const mockProjects = [
    { id: 1, name: 'Project Alpha', status: 'active', confidential: false },
    { id: 2, name: 'Project Beta', status: 'planning', confidential: true },
    { id: 3, name: 'Project Gamma', status: 'completed', confidential: false },
  ];

  // Filter data based on role
  const visibleProjects = mockProjects.filter(project => {
    if (isAdmin) return true; // Admins see everything
    if (isManager) return !project.confidential; // Managers see non-confidential
    return project.status === 'active'; // Regular users see only active
  });

  return (
    <div className="p-4 border rounded-md">
      <h3>Role-Based Data Filtering</h3>
      
      <div className="mb-4">
        <p>Your role: {isAdmin ? 'Admin' : isManager ? 'Manager' : 'User'}</p>
        <p>Projects visible: {visibleProjects.length} of {mockProjects.length}</p>
      </div>
      
      <div className="space-y-2">
        {visibleProjects.map(project => (
          <div key={project.id} className="p-3 bg-gray-50 rounded-md">
            <h4>{project.name}</h4>
            <p>Status: {project.status}</p>
            {project.confidential && <span className="text-red-600 text-sm">🔒 Confidential</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 8: Upgrade prompt for premium features
function UpgradePrompt() {
  const { isPremium } = useRole();

  if (isPremium) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <h3>Premium Features Active</h3>
        <p>You have access to all premium features!</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <h3>Upgrade to Premium</h3>
      <p>Get access to advanced 3D modeling, unlimited tours, and team collaboration.</p>
      <button className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
        Upgrade Now
      </button>
    </div>
  );
}

// Main component showcasing all examples
export default function RoleUsageExamples() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Role-Based Access Control Examples</h1>
      
      <BasicRoleCheck />
      <ConditionalRendering />
      <FeatureAccessControl />
      <ProtectedContent />
      <RoleBasedActions />
      <Dashboard />
      <RoleBasedDataFilter />
      <UpgradePrompt />
    </div>
  );
}
