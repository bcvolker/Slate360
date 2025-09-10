import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { VideoViewer } from '@/components/viewers/VideoViewer';
import { 
  Upload, 
  Edit, 
  Share, 
  Download,
  Video,
  Image,
  FileText,
  Clock
} from 'lucide-react';

export default function ContentStudioPage() {
  const content = [
    { id: '1', name: 'Project Overview Video', type: 'video', size: '125.3 MB', duration: '3:45', created: '1 day ago' },
    { id: '2', name: 'Site Progress Photos', type: 'image', size: '45.2 MB', count: '24 photos', created: '2 days ago' },
    { id: '3', name: 'Construction Report', type: 'document', size: '2.1 MB', pages: '12 pages', created: '3 days ago' },
  ];

  const tools = [
    { label: 'Upload Media', action: () => {}, helpText: 'Add videos, images, or documents', icon: Upload },
    { label: 'Edit Content', action: () => {}, helpText: 'Modify existing media', icon: Edit },
    { label: 'Share Content', action: () => {}, helpText: 'Share with team or clients', icon: Share },
    { label: 'Download', action: () => {}, helpText: 'Export content files', icon: Download },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Creation Studio</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage professional media content for your construction projects
          </p>
        </div>

        {/* Tools */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Content Tools</h3>
          <ContextualToolbar tools={tools} />
        </SurfaceCard>

        {/* Video Preview */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Featured Content</h3>
          <div className="h-96 bg-muted rounded-lg overflow-hidden">
            <VideoViewer 
              title="Project Overview Video"
              src="/mock/project-overview.mp4"
            />
          </div>
        </SurfaceCard>

        {/* Content Library */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Content Library</h3>
          <div className="space-y-4">
            {content.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {item.type === 'video' && <Video className="w-8 h-8 text-primary" />}
                  {item.type === 'image' && <Image className="w-8 h-8 text-primary" />}
                  {item.type === 'document' && <FileText className="w-8 h-8 text-primary" />}
                  <div>
                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.size} • {item.duration || item.count || item.pages} • Created {item.created}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-accent">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-accent">
                    <Share className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-accent">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        {/* Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Content Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Files</span>
                <span className="text-sm text-foreground font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="text-sm text-foreground font-semibold">172.6 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Upload</span>
                <span className="text-sm text-foreground font-semibold">1 day ago</span>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-foreground">Video uploaded</p>
                  <p className="text-xs text-muted-foreground">Project Overview Video</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-foreground">Photos processed</p>
                  <p className="text-xs text-muted-foreground">Site Progress Photos</p>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload New Media
              </button>
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <Edit className="w-4 h-4 inline mr-2" />
                Edit Content
              </button>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
