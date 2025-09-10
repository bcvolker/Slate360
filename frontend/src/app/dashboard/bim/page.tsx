import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { UnifiedViewer } from '@/components/viewers/UnifiedViewer';
import { 
  Upload, 
  Download, 
  Share, 
  Eye, 
  Settings,
  Building2,
  FileText,
  Users
} from 'lucide-react';

export default function BIMStudioPage() {
  const models = [
    { id: '1', name: 'Downtown Office Complex', type: 'IFC', size: '45.2 MB', lastModified: '2 hours ago' },
    { id: '2', name: 'Residential Tower', type: 'GLTF', size: '23.8 MB', lastModified: '1 day ago' },
    { id: '3', name: 'Shopping Mall', type: 'IFC', size: '67.1 MB', lastModified: '3 days ago' },
  ];

  const tools = [
    { label: 'Upload Model', action: () => {}, helpText: 'Import IFC or GLTF files', icon: Upload },
    { label: 'Export Model', action: () => {}, helpText: 'Download in various formats', icon: Download },
    { label: 'Share Model', action: () => {}, helpText: 'Collaborate with team members', icon: Share },
    { label: 'View Settings', action: () => {}, helpText: 'Configure viewer preferences', icon: Settings },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">BIM Studio</h1>
          <p className="text-muted-foreground mt-2">
            Import, view, and collaborate on 3D building models
          </p>
        </div>

        {/* Tools */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Model Tools</h3>
          <ContextualToolbar tools={tools} />
        </SurfaceCard>

        {/* Model Viewer */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">3D Model Viewer</h3>
          <div className="h-96 bg-muted rounded-lg overflow-hidden">
            <UnifiedViewer 
              title="Downtown Office Complex"
              type="model"
              src="/mock/office-complex.ifc"
            />
          </div>
        </SurfaceCard>

        {/* Model Library */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Model Library</h3>
          <div className="space-y-4">
            {models.map((model) => (
              <div key={model.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{model.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {model.type} • {model.size} • {model.lastModified}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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

        {/* Collaboration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Team Collaboration</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground">Active Collaborators</p>
                  <p className="text-xs text-muted-foreground">5 team members online</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground">Recent Comments</p>
                  <p className="text-xs text-muted-foreground">12 new annotations</p>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Model Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Models</span>
                <span className="text-sm text-foreground font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="text-sm text-foreground font-semibold">136.1 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Sync</span>
                <span className="text-sm text-foreground font-semibold">2 hours ago</span>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
