'use client';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useOwnerAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // This check is for preview builds only.
    // In production, this logic MUST be handled by server-side middleware.
    if (process.env.NEXT_PUBLIC_IS_OWNER === 'true') {
      setIsAuthorized(true);
    } else {
      router.replace('/'); // Redirect if not owner
    }
  }, [router]);

  return isAuthorized;
};

export default function CeoPage() {
  const isAuthorized = useOwnerAuth();

  if (!isAuthorized) {
    // Render nothing or a loading spinner while redirecting
    return null;
  }

  return (
    <div className="p-8">
      <SurfaceCard>
        <h1 className="text-2xl font-bold">CEO Dashboard (Private)</h1>
        <p className="mt-2 text-foreground/70">Manage homepage content, subscriptions, and default site theme.</p>
        <ContextualToolbar tools={[{ label: 'Upload Content', action: () => {}, helpText: 'Upload homepage visuals', icon: null }]} />
      </SurfaceCard>
    </div>
  );
}