'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function ThreeHero() {
  return (
    <div className="slate360-hero-viewer">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
