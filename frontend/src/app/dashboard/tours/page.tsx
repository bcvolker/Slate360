import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { TourViewer } from '@/components/viewers/TourViewer';
import { 
  Plus, 
  Camera, 
  Share, 
  Eye,
  Globe,
  Clock,
  Users
} from 'lucide-react';

const mockTourSteps = [
  {
    id: 'step1',
    title: 'Project Overview',
    description: 'Get a comprehensive view of the construction project',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5'
  },
  {
    id: 'step2',
    title: 'Site Analysis',
    description: 'Detailed analysis of the construction site',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12'
  },
  {
    id: 'step3',
    title: 'Progress Tracking',
    description: 'Monitor construction progress in real-time',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd'
  }
];

export default function ToursPage() {
  const tours = [
    { id: '1', name: 'Downtown Office Tour', views: 45, created: '2 days ago', status: 'published' },
    { id: '2', name: 'Residential Complex', views: 23, created: '1 week ago', status: 'draft' },
    { id: '3', name: 'Shopping Mall Walkthrough', views: 67, created: '2 weeks ago', status: 'published' },
  ];

  const tools = [
    { label: 'Create Tour', action: () => {}, helpText: 'Start a new 360° tour', icon: Plus },
    { label: 'Upload Photos', action: () => {}, helpText: 'Add 360° images', icon: Camera },
    { label: 'Share Tour', action: () => {}, helpText: 'Share with stakeholders', icon: Share },
    { label: 'Preview', action: () => {}, helpText: 'Test tour experience', icon: Eye },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">360 Tour Builder</h1>
          <p className="text-muted-foreground mt-2">
            Create immersive virtual walkthroughs of your construction projects
          </p>
        </div>

        {/* Tools */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tour Tools</h3>
          <ContextualToolbar tools={tools} />
        </SurfaceCard>

        {/* Tour Preview */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tour Preview</h3>
          <div className="h-96 bg-muted rounded-lg overflow-hidden">
            <TourViewer 
              title="Downtown Office Tour"
              steps={mockTourSteps}
            />
          </div>
        </SurfaceCard>

        {/* Tour Library */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Tours</h3>
          <div className="space-y-4">
            {tours.map((tour) => (
              <div key={tour.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{tour.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tour.views} views • Created {tour.created}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tour.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tour.status}
                  </span>
                  <button className="p-2 rounded-lg hover:bg-accent">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-accent">
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        {/* Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tour Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Tours</span>
                <span className="text-sm text-foreground font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Views</span>
                <span className="text-sm text-foreground font-semibold">135</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Published</span>
                <span className="text-sm text-foreground font-semibold">2</span>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-foreground">Tour published</p>
                  <p className="text-xs text-muted-foreground">Downtown Office Tour</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-foreground">New viewer</p>
                  <p className="text-xs text-muted-foreground">Shopping Mall Walkthrough</p>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                Create New Tour
              </button>
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <Camera className="w-4 h-4 inline mr-2" />
                Upload 360° Photos
              </button>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
