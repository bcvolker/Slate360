'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';

export default function AccountPage() {
  return (
    <ErrorBoundary>
      <SurfaceCard>
        <h1 className="text-2xl font-bold">Account</h1>
        <ContextualToolbar tools={[{ label: '+ Update Profile', action: () => {}, helpText: 'Update your account profile' }]} />
        <p className="mt-4">Account settings, profile management, and user preferences will be managed here.</p>
      </SurfaceCard>
    </ErrorBoundary>
  );
}
