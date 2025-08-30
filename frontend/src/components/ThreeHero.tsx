"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const ThreeHero = () => {
  return (
    <div className="slate360-hero" style={{ height: '400px', backgroundColor: '#111', borderRadius: '12px' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        <OrbitControls enableZoom={false} />
      </Canvas>
      <p className="text-gray-500 -mt-8">3D Model Viewer (Interactive Placeholder)</p>
    </div>
  );
};

export default ThreeHero;
