import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Share,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function AnalyticsPage() {
  const reports = [
    { id: '1', name: 'Monthly Progress Report', date: '2025-01-15', status: 'completed', views: 12 },
    { id: '2', name: 'Cost Analysis Q4', date: '2025-01-10', status: 'completed', views: 8 },
    { id: '3', name: 'Safety Metrics', date: '2025-01-08', status: 'draft', views: 3 },
  ];

  const metrics = [
    { label: 'Project Completion', value: '78%', trend: '+5%', color: 'text-green-600' },
    { label: 'Budget Utilization', value: '65%', trend: '+2%', color: 'text-blue-600' },
    { label: 'Safety Score', value: '94%', trend: '+1%', color: 'text-green-600' },
    { label: 'Team Productivity', value: '87%', trend: '+3%', color: 'text-purple-600' },
  ];

  const tools = [
    { label: 'Generate Report', action: () => {}, helpText: 'Create custom analytics report', icon: BarChart3 },
    { label: 'Export Data', action: () => {}, helpText: 'Download data in various formats', icon: Download },
    { label: 'Share Report', action: () => {}, helpText: 'Share with stakeholders', icon: Share },
    { label: 'Schedule Report', action: () => {}, helpText: 'Set up automated reporting', icon: Calendar },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Data-driven insights for informed decision-making and project optimization
          </p>
        </div>

        {/* Tools */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Analytics Tools</h3>
          <ContextualToolbar tools={tools} />
        </SurfaceCard>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <SurfaceCard key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className={`text-xs mt-1 ${metric.color}`}>{metric.trend}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </SurfaceCard>
          ))}
        </div>

        {/* Chart Placeholder */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Project Performance</h3>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive performance charts</p>
              <p className="text-sm text-muted-foreground">Timeline, budget, and progress visualization</p>
            </div>
          </div>
        </SurfaceCard>

        {/* Reports */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Reports</h3>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {report.date} • {report.views} views
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <button className="p-2 rounded-lg hover:bg-accent">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-accent">
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        {/* Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">Project on track for completion</p>
                  <p className="text-xs text-muted-foreground">78% completion rate exceeds target</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">Budget monitoring needed</p>
                  <p className="text-xs text-muted-foreground">65% utilization requires attention</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">Safety performance excellent</p>
                  <p className="text-xs text-muted-foreground">94% safety score above target</p>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Generate Custom Report
              </button>
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <Target className="w-4 h-4 inline mr-2" />
                Set Performance Targets
              </button>
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <Calendar className="w-4 h-4 inline mr-2" />
                Schedule Weekly Reports
              </button>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
