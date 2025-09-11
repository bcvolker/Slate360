'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';

export default function ContentPage() {
  return (
    <ErrorBoundary>
      <SurfaceCard>
        <h1 className="text-2xl font-bold">Content Creation</h1>
        <ContextualToolbar tools={[{ label: '+ New Project', action: () => {}, helpText: 'Create a new content project' }]} />
        <p className="mt-4">Video editing, photo enhancement, and content management tools will be available here.</p>
      </SurfaceCard>
    </ErrorBoundary>
  );
}