'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';

// Simple 3D Model Component - lightweight
function SimpleModel() {
  return (
    <group>
      {/* Simple building structure */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 2, 2]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      
      {/* Simple roof */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      {/* Ground */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#90ee90" />
      </mesh>
    </group>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [6, 4, 6], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: false, alpha: false }}
    >
      <Suspense fallback={null}>
        {/* Simple lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        
        {/* 3D Model */}
        <SimpleModel />
        
        {/* Simple environment */}
        <Environment preset="city" />
        
        {/* Basic controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={4}
          maxDistance={15}
          autoRotate={true}
          autoRotateSpeed={1}
        />
      </Suspense>
    </Canvas>
  );
}
