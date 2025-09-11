'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';

export default function BIMPage() {
  return (
    <ErrorBoundary>
      <SurfaceCard>
        <h1 className="text-2xl font-bold">BIM Studio</h1>
        <ContextualToolbar tools={[{ label: '+ Upload Model', action: () => {}, helpText: 'Upload a new BIM model' }]} />
        <p className="mt-4">3D modeling, clash detection, and BIM analysis tools will be managed here.</p>
      </SurfaceCard>
    </ErrorBoundary>
  );
}