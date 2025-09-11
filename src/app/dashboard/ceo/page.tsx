'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';

export default function CEOPage() {
  return (
    <ErrorBoundary>
      <SurfaceCard>
        <h1 className="text-2xl font-bold">CEO Dashboard</h1>
        <ContextualToolbar tools={[{ label: '+ Executive Report', action: () => {}, helpText: 'Generate executive summary report' }]} />
        <p className="mt-4">Executive overview, company metrics, and high-level project insights will be displayed here.</p>
      </SurfaceCard>
    </ErrorBoundary>
  );
}
