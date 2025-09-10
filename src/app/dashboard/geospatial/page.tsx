'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { 
  MapPin, 
  Send, 
  Navigation, 
  Satellite,
  Upload,
  Download,
  Share,
  Settings
} from 'lucide-react';

export default function GeospatialPage() {
  const surveys = [
    { id: '1', name: 'Site Survey - Downtown Office', date: '2025-01-15', area: '2.5 acres', status: 'completed' },
    { id: '2', name: 'Progress Mapping - Residential', date: '2025-01-12', area: '1.8 acres', status: 'processing' },
    { id: '3', name: 'Final Survey - Shopping Mall', date: '2025-01-10', area: '4.2 acres', status: 'completed' },
  ];

  const tools = [
    { label: 'Schedule Survey', action: () => {}, helpText: 'Plan drone mapping mission', icon: Send },
    { label: 'Upload Data', action: () => {}, helpText: 'Import GPS and LiDAR data', icon: Upload },
    { label: 'Export Maps', action: () => {}, helpText: 'Download mapping data', icon: Download },
    { label: 'Share Location', action: () => {}, helpText: 'Share coordinates with team', icon: Share },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Geospatial & Robotics</h1>
          <p className="text-muted-foreground mt-2">
            Advanced automation, mapping, and robotic operations for precise construction
          </p>
        </div>

        {/* Tools */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Geospatial Tools</h3>
          <ContextualToolbar tools={tools} />
        </SurfaceCard>

        {/* Map View */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Site Map</h3>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive site map</p>
              <p className="text-sm text-muted-foreground">GPS coordinates and drone imagery</p>
            </div>
          </div>
        </SurfaceCard>

        {/* Survey Data */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Survey Data</h3>
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div key={survey.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Satellite className="w-8 h-8 text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{survey.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {survey.date} • {survey.area}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    survey.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {survey.status}
                  </span>
                  <button className="p-2 rounded-lg hover:bg-accent">
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        {/* Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Survey Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Surveys</span>
                <span className="text-sm text-foreground font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Area Covered</span>
                <span className="text-sm text-foreground font-semibold">8.5 acres</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Survey</span>
                <span className="text-sm text-foreground font-semibold">5 days ago</span>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Drone Operations</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Send className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-foreground">Flight Time</p>
                  <p className="text-xs text-muted-foreground">2.5 hours today</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Navigation className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-foreground">GPS Accuracy</p>
                  <p className="text-xs text-muted-foreground">±2cm precision</p>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <Send className="w-4 h-4 inline mr-2" />
                Schedule Drone Survey
              </button>
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload GPS Data
              </button>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
