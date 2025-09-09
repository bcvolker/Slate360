// src/app/dashboard/page.tsx
import { Plus, Filter } from 'lucide-react';

const ContextualHeader = () => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-zinc-800">Project Hub</h2>
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ring-1 ring-zinc-300 text-zinc-900 hover:bg-zinc-100/50">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white" style={{ backgroundColor: 'var(--brand-accent)' }}>
          <Plus className="w-4 h-4" />
          <span>New</span>
        </button>
      </div>
    </div>
  );
};

export default function ProjectHubPage() {
  return (
    <div>
      <ContextualHeader />
      <div className="surface p-6">
        {/* All the widgets and data tables for the Project Hub will go here */}
        <p className="text-zinc-500">Dashboard widgets for RFIs, Submittals, and recent activity will be displayed here.</p>
      </div>
    </div>
  );
}