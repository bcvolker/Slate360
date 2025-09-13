// Re-create DashboardShell.tsx with TabsContent integration
'use client';

import { useState } from 'react';
import Tabs from './Tabs';
import { useUser } from '../context/UserContext';
import TabsContent from './TabsContent';

type TabKey = 'Overview' | 'Projects' | 'Settings' | 'Users' | 'Roles';

export default function DashboardShell() {
  const { role } = useUser();
  // Optionally, you can get profession from user context or props
  const profession = undefined; // e.g., 'architect', 'engineer', etc.
  const [activeTab, setActiveTab] = useState<TabKey>('Overview');

  const baseTabs: TabKey[] = ['Overview', 'Projects', 'Settings'];
  const leaderTabs: TabKey[] = ['Users'];
  const adminTabs: TabKey[] = ['Users', 'Roles'];

  let availableTabs = [...baseTabs];
  if (role === 'leader') availableTabs = [...availableTabs, ...leaderTabs];
  if (role === 'admin') availableTabs = [...availableTabs, ...adminTabs];

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs
        tabs={availableTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="max-w-7xl mx-auto p-6">
        <TabsContent tab={activeTab} role={role} profession={profession} />
      </div>
    </div>
  );
}
