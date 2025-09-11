'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';

export default function ReportsPage() {
  return (
    <ErrorBoundary>
      <SurfaceCard>
        <h1 className="text-2xl font-bold">Reports</h1>
        <ContextualToolbar tools={[{ label: '+ Generate Report', action: () => {}, helpText: 'Generate a new project report' }]} />
        <p className="mt-4">Project reports, analytics, and data visualization tools will be available here.</p>
      </SurfaceCard>
    </ErrorBoundary>
  );
}
