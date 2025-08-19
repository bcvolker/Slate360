import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  X, 
  Play, 
  BookOpen, 
  Users, 
  BarChart3, 
  Upload,
  Plus,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';
import { toast } from 'react-hot-toast';

interface DemoBannerProps {
  className?: string;
}

export function DemoBanner({ className = '' }: DemoBannerProps) {
  const { 
    isDemoMode, 
    showDemoBanner, 
    hideDemoBanner, 
    workflowProgress, 
    startWorkflow,
    projects,
    analytics 
  } = useDemo();
  
  const [showQuickActions, setShowQuickActions] = useState(false);

  if (!isDemoMode || !showDemoBanner) return null;

  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalProjects = projects.length;

  const quickActions = [
    {
      id: 'start_workflow',
      title: 'Start Walkthrough',
      description: 'Begin guided tour',
      icon: <Play size={20} />,
      action: () => {
        startWorkflow();
        toast.success('🚀 Starting demo workflow walkthrough!');
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'explore_projects',
      title: 'Explore Projects',
      description: 'Browse sample projects',
      icon: <BookOpen size={20} />,
      action: () => {
        toast.success('📁 Navigate to Projects tab to explore sample data');
      },
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'view_analytics',
      title: 'View Analytics',
      description: 'See demo statistics',
      icon: <BarChart3 size={20} />,
      action: () => {
        toast.success('📊 Navigate to Analytics tab to view demo data');
      },
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'team_collaboration',
      title: 'Team Features',
      description: 'Test collaboration',
      icon: <Users size={20} />,
      action: () => {
        toast.success('👥 Navigate to Team tab to explore collaboration features');
      },
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white shadow-lg ${className}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Demo status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap size={20} className="text-yellow-300" />
                </motion.div>
                <span className="font-bold text-lg">Demo Mode Active</span>
              </div>

              {/* Progress indicator */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-purple-100">Workflow:</span>
                  <div className="w-24 bg-white/20 rounded-full h-2">
                    <motion.div
                      className="bg-yellow-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${workflowProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-sm text-purple-100">{Math.round(workflowProgress)}%</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-purple-100">Projects:</span>
                  <span className="text-sm font-medium">
                    {completedProjects}/{totalProjects} completed
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              {/* Quick Actions Button */}
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                Quick Actions
              </button>

              {/* Close Button */}
              <button
                onClick={hideDemoBanner}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                title="Hide demo banner"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Actions Dropdown */}
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                className="mt-3 pt-3 border-t border-white/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className={`
                        ${action.color} text-white p-3 rounded-lg text-left transition-all
                        hover:scale-105 hover:shadow-lg
                      `}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {action.icon}
                        <span className="font-semibold">{action.title}</span>
                      </div>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </button>
                  ))}
                </div>

                {/* Additional demo info */}
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-purple-100">
                      <span>📊 {analytics.projectStats.total} sample projects</span>
                      <span>👥 {analytics.teamPerformance.activeMembers} team members</span>
                      <span>💰 ${(analytics.budgetOverview.totalBudget / 1000000).toFixed(1)}M total budget</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-300" />
                      <span className="text-green-100">All data is simulated</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DemoBanner;
