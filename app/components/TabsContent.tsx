// TabsContent component for dashboard tab switching and profession widgets

import OverviewDashboard from './OverviewDashboard';
import ProjectsDashboard from './ProjectsDashboard';
import SettingsDashboard from './SettingsDashboard';
import UsersDashboard from './UsersDashboard';
import RolesDashboard from './RolesDashboard';

import ArchitectOptimizer from './widgets/ArchitectOptimizer';
import EngineerLoadAnalysis from './widgets/EngineerLoadAnalysis';

type TabKey = 'Overview' | 'Projects' | 'Settings' | 'Users' | 'Roles';

interface TabsContentProps {
  tab: TabKey;
  role?: 'user' | 'leader' | 'admin';
  profession?: 'architect' | 'engineer' | 'manager';
}

export default function TabsContent({ tab, role, profession }: TabsContentProps) {
  return (
    <div className="space-y-6 transition-all duration-500 opacity-0 translate-y-5 animate-fadein">
      {tab === 'Overview' && <OverviewDashboard />}
      {tab === 'Projects' && <ProjectsDashboard />}
      {tab === 'Settings' && <SettingsDashboard />}
      {tab === 'Users' && <UsersDashboard />}
      {tab === 'Roles' && <RolesDashboard />}

      {/* Optional profession widgets */}
      {profession === 'architect' && <ArchitectOptimizer />}
      {profession === 'engineer' && <EngineerLoadAnalysis />}
      {/* Extend with more widgets as needed */}
    </div>
  );
}
