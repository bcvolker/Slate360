import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { 
  Building2, 
  Globe, 
  Video, 
  MapPin, 
  BarChart3, 
  VrBox,
  TrendingUp,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Active Projects', value: '12', icon: Building2, change: '+2 this month' },
    { label: '360 Tours Created', value: '8', icon: Globe, change: '+3 this week' },
    { label: 'Content Items', value: '156', icon: Video, change: '+12 today' },
    { label: 'Site Surveys', value: '24', icon: MapPin, change: '+1 this week' },
  ];

  const recentActivity = [
    { id: 1, action: 'Created new BIM model', project: 'Downtown Office Complex', time: '2 hours ago', status: 'completed' },
    { id: 2, action: 'Uploaded site photos', project: 'Residential Development', time: '4 hours ago', status: 'completed' },
    { id: 3, action: 'Generated progress report', project: 'Shopping Mall Renovation', time: '6 hours ago', status: 'completed' },
    { id: 4, action: 'Scheduled drone survey', project: 'Industrial Warehouse', time: 'Tomorrow', status: 'pending' },
  ];

  const quickActions = [
    { label: 'Upload BIM Model', action: () => {}, helpText: 'Import IFC or GLTF files', icon: Building2 },
    { label: 'Create 360 Tour', action: () => {}, helpText: 'Build immersive walkthroughs', icon: Globe },
    { label: 'Generate Report', action: () => {}, helpText: 'Create project analytics', icon: BarChart3 },
    { label: 'Schedule Survey', action: () => {}, helpText: 'Plan drone mapping', icon: MapPin },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your construction projects and manage your workflow
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <SurfaceCard key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
            </SurfaceCard>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {activity.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.project}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>

          {/* Quick Actions */}
          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <ContextualToolbar tools={quickActions} className="flex-col gap-2" />
          </SurfaceCard>
        </div>

        {/* Project Overview */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Project Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-foreground">BIM Studio</h4>
              <p className="text-sm text-muted-foreground">3D modeling and collaboration</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-foreground">360 Tours</h4>
              <p className="text-sm text-muted-foreground">Immersive walkthroughs</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-foreground">Analytics</h4>
              <p className="text-sm text-muted-foreground">Data-driven insights</p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </DashboardLayout>
  );
}