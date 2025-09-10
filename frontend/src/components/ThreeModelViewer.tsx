'use client';

import React from 'react';

function Loader() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">Loading 3D Viewer</p>
      </div>
    </div>
  );
}

function ThreeScene() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="w-32 h-32 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">3D Model Viewer</h3>
        <p className="text-sm">Upload a 3D model to view it here</p>
      </div>
    </div>
  );
}

export default function ThreeModelViewer() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <ThreeScene />
    </div>
  );
}
