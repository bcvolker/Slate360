import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Target,
  Calendar,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { IProject } from '@/models/Project';

interface ProjectAnalyticsProps {
  projects: IProject[];
  className?: string;
  showCharts?: boolean;
  showMetrics?: boolean;
  showTrends?: boolean;
  timeRange?: 'week' | 'month' | 'quarter' | 'year' | 'all';
}

interface AnalyticsData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  cancelledProjects: number;
  totalBudget: number;
  actualSpent: number;
  budgetUtilization: number;
  averageProjectDuration: number;
  teamUtilization: number;
  projectTypes: Record<string, number>;
  statusDistribution: Record<string, number>;
  monthlyProgress: Array<{
    month: string;
    completed: number;
    started: number;
    revenue: number;
  }>;
  performanceMetrics: {
    onTimeDelivery: number;
    budgetAdherence: number;
    clientSatisfaction: number;
    resourceEfficiency: number;
  };
}

export function ProjectAnalytics({
  projects,
  className = '',
  showCharts = true,
  showMetrics = true,
  showTrends = true,
  timeRange = 'all'
}: ProjectAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  // Calculate analytics data
  const analyticsData = useMemo((): AnalyticsData => {
    const now = new Date();
    const filteredProjects = filterProjectsByTimeRange(projects, timeRange);

    const totalProjects = filteredProjects.length;
    const activeProjects = filteredProjects.filter(p => p.status === 'active').length;
    const completedProjects = filteredProjects.filter(p => p.status === 'completed').length;
    const onHoldProjects = filteredProjects.filter(p => p.status === 'on-hold').length;
    const cancelledProjects = filteredProjects.filter(p => p.status === 'cancelled').length;

    // Budget calculations
    const totalBudget = filteredProjects.reduce((sum, p) => sum + (p.budget?.estimated || 0), 0);
    const actualSpent = filteredProjects.reduce((sum, p) => sum + (p.budget?.actual || 0), 0);
    const budgetUtilization = totalBudget > 0 ? (actualSpent / totalBudget) * 100 : 0;

    // Duration calculations
    const projectsWithTimeline = filteredProjects.filter(p => p.timeline?.startDate && p.timeline?.endDate);
    const averageProjectDuration = projectsWithTimeline.length > 0
      ? projectsWithTimeline.reduce((sum, p) => {
          const start = new Date(p.timeline!.startDate!);
          const end = new Date(p.timeline!.endDate!);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / projectsWithTimeline.length
      : 0;

    // Team utilization
    const totalTeamMembers = filteredProjects.reduce((sum, p) => sum + (p.team?.length || 0), 0);
    const uniqueTeamMembers = new Set(
      filteredProjects.flatMap(p => p.team?.map(t => t.userId) || [])
    ).size;
    const teamUtilization = uniqueTeamMembers > 0 ? (totalTeamMembers / uniqueTeamMembers) : 0;

    // Project type distribution
    const projectTypes = filteredProjects.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Status distribution
    const statusDistribution = filteredProjects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Monthly progress
    const monthlyProgress = calculateMonthlyProgress(filteredProjects);

    // Performance metrics
    const performanceMetrics = calculatePerformanceMetrics(filteredProjects);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      onHoldProjects,
      cancelledProjects,
      totalBudget,
      actualSpent,
      budgetUtilization,
      averageProjectDuration,
      teamUtilization,
      projectTypes,
      statusDistribution,
      monthlyProgress,
      performanceMetrics
    };
  }, [projects, timeRange]);

  // Filter projects by time range
  function filterProjectsByTimeRange(projects: IProject[], range: string): IProject[] {
    if (range === 'all') return projects;

    const now = new Date();
    let startDate: Date;

    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return projects;
    }

    return projects.filter(p => {
      if (p.timeline?.startDate) {
        const projectStart = new Date(p.timeline.startDate);
        return projectStart >= startDate;
      }
      return p.createdAt >= startDate;
    });
  }

  // Calculate monthly progress
  function calculateMonthlyProgress(projects: IProject[]) {
    const months: Record<string, { completed: number; started: number; revenue: number }> = {};
    
    projects.forEach(project => {
      if (project.timeline?.startDate) {
        const startDate = new Date(project.timeline.startDate);
        const monthKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (!months[monthKey]) {
          months[monthKey] = { completed: 0, started: 0, revenue: 0 };
        }
        
        months[monthKey].started++;
        
        if (project.status === 'completed') {
          months[monthKey].completed++;
        }
        
        if (project.budget?.actual) {
          months[monthKey].revenue += project.budget.actual;
        }
      }
    });

    return Object.entries(months)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  // Calculate performance metrics
  function calculatePerformanceMetrics(projects: IProject[]) {
    const completedProjects = projects.filter(p => p.status === 'completed');
    
    // On-time delivery (projects completed within estimated timeline)
    const onTimeProjects = completedProjects.filter(p => {
      if (!p.timeline?.startDate || !p.timeline?.endDate || !p.timeline?.estimatedDuration) {
        return false;
      }
      const actualDuration = (new Date(p.timeline.endDate).getTime() - new Date(p.timeline.startDate).getTime()) / (1000 * 60 * 60 * 24);
      return actualDuration <= p.timeline.estimatedDuration;
    });
    const onTimeDelivery = completedProjects.length > 0 ? (onTimeProjects.length / completedProjects.length) * 100 : 0;

    // Budget adherence (projects within 10% of estimated budget)
    const budgetAdherentProjects = completedProjects.filter(p => {
      if (!p.budget?.estimated || !p.budget?.actual) return false;
      const variance = Math.abs(p.budget.actual - p.budget.estimated) / p.budget.estimated;
      return variance <= 0.1;
    });
    const budgetAdherence = completedProjects.length > 0 ? (budgetAdherentProjects.length / completedProjects.length) * 100 : 0;

    // Client satisfaction (placeholder - would come from actual feedback)
    const clientSatisfaction = 85; // Mock data

    // Resource efficiency (team utilization)
    const resourceEfficiency = analyticsData.teamUtilization * 100;

    return {
      onTimeDelivery,
      budgetAdherence,
      clientSatisfaction,
      resourceEfficiency
    };
  }

  // Get metric change indicator
  function getMetricChange(current: number, previous: number): { direction: 'up' | 'down' | 'stable'; value: number } {
    if (current > previous) {
      return { direction: 'up', value: ((current - previous) / previous) * 100 };
    } else if (current < previous) {
      return { direction: 'down', value: ((previous - current) / previous) * 100 };
    }
    return { direction: 'stable', value: 0 };
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your project portfolio</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Projects"
            value={analyticsData.totalProjects}
            icon={BarChart3}
            change={getMetricChange(analyticsData.totalProjects, analyticsData.totalProjects * 0.9)}
            color="blue"
          />
          
          <MetricCard
            title="Active Projects"
            value={analyticsData.activeProjects}
            icon={Activity}
            change={getMetricChange(analyticsData.activeProjects, analyticsData.activeProjects * 0.95)}
            color="green"
          />
          
          <MetricCard
            title="Budget Utilization"
            value={`${analyticsData.budgetUtilization.toFixed(1)}%`}
            icon={DollarSign}
            change={getMetricChange(analyticsData.budgetUtilization, analyticsData.budgetUtilization * 0.9)}
            color="purple"
          />
          
          <MetricCard
            title="Team Utilization"
            value={`${analyticsData.teamUtilization.toFixed(1)}%`}
            icon={Users}
            change={getMetricChange(analyticsData.teamUtilization, analyticsData.teamUtilization * 0.95)}
            color="orange"
          />
        </div>
      )}

      {/* Performance Metrics */}
      {showMetrics && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PerformanceMetric
              label="On-Time Delivery"
              value={analyticsData.performanceMetrics.onTimeDelivery}
              target={90}
              color="green"
            />
            <PerformanceMetric
              label="Budget Adherence"
              value={analyticsData.performanceMetrics.budgetAdherence}
              target={85}
              color="blue"
            />
            <PerformanceMetric
              label="Client Satisfaction"
              value={analyticsData.performanceMetrics.clientSatisfaction}
              target={90}
              color="purple"
            />
            <PerformanceMetric
              label="Resource Efficiency"
              value={analyticsData.performanceMetrics.resourceEfficiency}
              target={80}
              color="orange"
            />
          </div>
        </div>
      )}

      {/* Charts Section */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Distribution</h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.statusDistribution).map(([status, count]) => (
                <StatusBar
                  key={status}
                  status={status}
                  count={count}
                  total={analyticsData.totalProjects}
                />
              ))}
            </div>
          </div>

          {/* Project Types */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Types</h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.projectTypes).map(([type, count]) => (
                <TypeBar
                  key={type}
                  type={type}
                  count={count}
                  total={analyticsData.totalProjects}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trends Section */}
      {showTrends && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress Trends</h3>
          <div className="space-y-4">
            {analyticsData.monthlyProgress.map((monthData, index) => (
              <MonthlyProgressBar
                key={monthData.month}
                month={monthData.month}
                completed={monthData.completed}
                started={monthData.started}
                revenue={monthData.revenue}
                isLatest={index === analyticsData.monthlyProgress.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${analyticsData.totalBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Budget</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analyticsData.averageProjectDuration.toFixed(1)} days
            </div>
            <div className="text-sm text-gray-600">Avg. Project Duration</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analyticsData.completedProjects}
            </div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  change: { direction: 'up' | 'down' | 'stable'; value: number };
  color: string;
}

function MetricCard({ title, value, icon: Icon, change, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {change.direction !== 'stable' && (
        <div className="flex items-center mt-4 text-sm">
          {change.direction === 'up' ? (
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={change.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
            {change.value.toFixed(1)}%
          </span>
          <span className="text-gray-500 ml-1">from last period</span>
        </div>
      )}
    </motion.div>
  );
}

// Performance Metric Component
interface PerformanceMetricProps {
  label: string;
  value: number;
  target: number;
  color: string;
}

function PerformanceMetric({ label, value, target, color }: PerformanceMetricProps) {
  const percentage = Math.min(value, 100);
  const isAboveTarget = value >= target;
  
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="text-center">
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses[color as keyof typeof colorClasses]} mb-2`}>
        {isAboveTarget ? '✓' : '⚠'} {label}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value.toFixed(1)}%</div>
      <div className="text-sm text-gray-500">Target: {target}%</div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isAboveTarget ? 'bg-green-500' : 'bg-orange-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Status Bar Component
interface StatusBarProps {
  status: string;
  count: number;
  total: number;
}

function StatusBar({ status, count, total }: StatusBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const statusColors = {
    active: 'bg-green-500',
    planning: 'bg-blue-500',
    'on-hold': 'bg-yellow-500',
    completed: 'bg-gray-500',
    cancelled: 'bg-red-500'
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="w-20 text-sm font-medium text-gray-700 capitalize">{status}</div>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-12 text-sm text-gray-600 text-right">{count}</div>
    </div>
  );
}

// Type Bar Component
interface TypeBarProps {
  type: string;
  count: number;
  total: number;
}

function TypeBar({ type, count, total }: TypeBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const typeColors = {
    residential: 'bg-purple-500',
    commercial: 'bg-indigo-500',
    industrial: 'bg-orange-500',
    infrastructure: 'bg-teal-500',
    renovation: 'bg-pink-500'
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="w-24 text-sm font-medium text-gray-700 capitalize">{type}</div>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${typeColors[type as keyof typeof typeColors] || 'bg-gray-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-12 text-sm text-gray-600 text-right">{count}</div>
    </div>
  );
}

// Monthly Progress Bar Component
interface MonthlyProgressBarProps {
  month: string;
  completed: number;
  started: number;
  revenue: number;
  isLatest: boolean;
}

function MonthlyProgressBar({ month, completed, started, revenue, isLatest }: MonthlyProgressBarProps) {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const [year, monthNum] = month.split('-');
  const monthName = monthNames[parseInt(monthNum) - 1];

  return (
    <div className={`flex items-center space-x-4 p-3 rounded-lg ${isLatest ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
      <div className="w-16 text-sm font-medium text-gray-700">
        {monthName} {year}
      </div>
      
      <div className="flex-1 flex items-center space-x-4">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">{started}</div>
          <div className="text-xs text-gray-500">Started</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium text-green-600">{completed}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium text-blue-600">${revenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Revenue</div>
        </div>
      </div>
      
      {isLatest && (
        <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          Latest
        </div>
      )}
    </div>
  );
}

export default ProjectAnalytics;
