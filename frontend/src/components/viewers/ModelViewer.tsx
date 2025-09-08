'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }: { url: string }) {
  // Always call the hook unconditionally
  const { scene } = useGLTF(url);
  
  // Return the scene if it exists, otherwise return fallback
  if (scene) {
    return <primitive object={scene} />;
  }
  
  // Fallback for mock URLs or missing models
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function ModelViewer({ url }: { url: string }) {
  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        }>
          <Model url={url} />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
