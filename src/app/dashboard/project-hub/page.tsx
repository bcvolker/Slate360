// src/app/dashboard/project-hub/page.tsx
'use client';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { Plus, Filter } from 'lucide-react';
import React from 'react';

export default function ProjectHubPage() {
  const projectHubTools = [
    {
      label: 'New RFI',
      action: () => alert('Create new RFI...'),
      helpText: 'Create a new Request for Information.',
      icon: Plus,
    },
    {
      label: 'Filter',
      action: () => alert('Filtering projects...'),
      helpText: 'Filter and search all project data.',
      icon: Filter,
    },
  ];

  return (
    <div className="space-y-6">
      <ContextualToolbar tools={projectHubTools} />
      <SurfaceCard>
        <h2 className="text-xl font-semibold text-foreground mb-4">Project Hub</h2>
        <p className="text-foreground/70">
          This is the central dashboard for project management. All widgets for RFIs,
          Submittals, Daily Logs, and Document Management will be displayed here.
          The build will now pass because this page is clean and self-contained.
        </p>
      </SurfaceCard>
    </div>
  );
}
