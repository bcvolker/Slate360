'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';

export default function ProjectHubPage() {
  return (
    <ErrorBoundary>
      <SurfaceCard>
        <h1 className="text-2xl font-bold">Project Hub</h1>
        <ContextualToolbar tools={[{ label: '+ New RFI', action: () => {}, helpText: 'Create a new Request for Information' }]} />
        <p className="mt-4">RFI tracking, documents, and daily logs will be managed here.</p>
      </SurfaceCard>
    </ErrorBoundary>
  );
}
