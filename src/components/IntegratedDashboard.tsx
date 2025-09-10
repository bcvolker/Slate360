// FEATURE FLAG: This component is under development and may cause build issues
// Set INTEGRATED_DASHBOARD_ENABLED=true in your environment to enable it
// For now, it returns a placeholder to prevent build failures

import React from 'react';

const IntegratedDashboard: React.FC = () => {
  // Check if feature is enabled
  if (process.env.NODE_ENV === 'production' && !process.env.INTEGRATED_DASHBOARD_ENABLED) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard Coming Soon
        </h2>
        <p className="text-gray-600 mb-4">
          The integrated dashboard is currently being developed and will be available soon.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This feature is under active development. 
            Set INTEGRATED_DASHBOARD_ENABLED=true to enable the preview version.
          </p>
        </div>
      </div>
    );
  }

  // Development/Preview version
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Integrated Dashboard (Preview)
      </h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 text-sm">
          <strong>Development Mode:</strong> This is a preview version with limited functionality.
          Some features may not work correctly.
        </p>
      </div>
      
      {/* Placeholder content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Demo Mode</h3>
          <p className="text-gray-600">Toggle demo mode to see sample data</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Offline Sync</h3>
          <p className="text-gray-600">Offline-first project management</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Features</h3>
          <p className="text-gray-600">Enterprise-grade security implementation</p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Full implementation coming soon. This preview prevents build issues while development continues.
        </p>
      </div>
    </div>
  );
};

export default IntegratedDashboard;
