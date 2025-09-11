'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';

export default function ToursPage() {
  return (
    <ErrorBoundary>
      <SurfaceCard>
        <h1 className="text-2xl font-bold">360° Tours</h1>
        <ContextualToolbar tools={[{ label: '+ New Tour', action: () => {}, helpText: 'Create a new 360° tour' }]} />
        <p className="mt-4">Virtual tours, interactive hotspots, and VR export tools will be managed here.</p>
      </SurfaceCard>
    </ErrorBoundary>
  );
}