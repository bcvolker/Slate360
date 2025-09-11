'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';

export default function VRARPage() {
  return (
    <ErrorBoundary>
      <SurfaceCard>
        <h1 className="text-2xl font-bold">VR/AR</h1>
        <ContextualToolbar tools={[{ label: '+ VR Session', action: () => {}, helpText: 'Start a new VR session' }]} />
        <p className="mt-4">Virtual and augmented reality tools, immersive experiences, and VR/AR content will be managed here.</p>
      </SurfaceCard>
    </ErrorBoundary>
  );
}