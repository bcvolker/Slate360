// TabsContent component for dashboard tab switching and profession widgets
'use client';

import { motion } from 'framer-motion';
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
    <motion.div
      key={tab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {tab === 'Overview' && <OverviewDashboard />}
      {tab === 'Projects' && <ProjectsDashboard />}
      {tab === 'Settings' && <SettingsDashboard />}
      {tab === 'Users' && <UsersDashboard />}
      {tab === 'Roles' && <RolesDashboard />}

      {/* Optional profession widgets */}
      {profession === 'architect' && <ArchitectOptimizer />}
      {profession === 'engineer' && <EngineerLoadAnalysis />}
      {/* Extend with more widgets as needed */}
    </motion.div>
  );
}
