'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Three.js components to reduce initial bundle size
const ThreeScene = dynamic(() => import('./ThreeScene'), {
  ssr: false,
  loading: () => <Loader />
});

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

export default function ThreeModelViewer() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <Suspense fallback={<Loader />}>
        <ThreeScene />
      </Suspense>
    </div>
  );
}
