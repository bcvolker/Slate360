'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';

export default function GeospatialPage() {
  return (
    <ErrorBoundary>
      <SurfaceCard>
        <h1 className="text-2xl font-bold">Geospatial</h1>
        <ContextualToolbar tools={[{ label: '+ Add Location', action: () => {}, helpText: 'Add a new geospatial location' }]} />
        <p className="mt-4">GPS tracking, mapping, and location-based analytics will be managed here.</p>
      </SurfaceCard>
    </ErrorBoundary>
  );
}