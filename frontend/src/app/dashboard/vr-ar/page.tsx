'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { 
  View, 
  Eye, 
  Share, 
  Download,
  Headphones,
  Smartphone,
  Monitor,
  Users
} from 'lucide-react';

export default function VRARPage() {
  const experiences = [
    { id: '1', name: 'Office Complex VR Tour', type: 'VR', devices: 'Oculus, HTC Vive', views: 23, status: 'published' },
    { id: '2', name: 'Site AR Overlay', type: 'AR', devices: 'iOS, Android', views: 45, status: 'draft' },
    { id: '3', name: 'Design Review VR', type: 'VR', devices: 'Oculus, Pico', views: 12, status: 'published' },
  ];

  const tools = [
    { label: 'Create VR Experience', action: () => {}, helpText: 'Build immersive VR walkthroughs', icon: View },
    { label: 'Preview Experience', action: () => {}, helpText: 'Test VR/AR content', icon: Eye },
    { label: 'Share Experience', action: () => {}, helpText: 'Share with team and clients', icon: Share },
    { label: 'Export Assets', action: () => {}, helpText: 'Download VR/AR files', icon: Download },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">VR/AR Studio</h1>
          <p className="text-muted-foreground mt-2">
            Immersive technologies for enhanced visualization and collaboration
          </p>
        </div>

        {/* Tools */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">VR/AR Tools</h3>
          <ContextualToolbar tools={tools} />
        </SurfaceCard>

        {/* VR Preview */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">VR Experience Preview</h3>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <View className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Immersive VR environment</p>
              <p className="text-sm text-muted-foreground">360° project walkthrough</p>
            </div>
          </div>
        </SurfaceCard>

        {/* Experiences */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">VR/AR Experiences</h3>
          <div className="space-y-4">
            {experiences.map((experience) => (
              <div key={experience.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {experience.type === 'VR' ? (
                    <View className="w-8 h-8 text-primary" />
                  ) : (
                    <Smartphone className="w-8 h-8 text-primary" />
                  )}
                  <div>
                    <h4 className="font-semibold text-foreground">{experience.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {experience.devices} • {experience.views} views
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    experience.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {experience.status}
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

        {/* Device Support */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">VR Devices</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <View className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground">Oculus Quest</p>
                  <p className="text-xs text-muted-foreground">Wireless VR headset</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground">HTC Vive</p>
                  <p className="text-xs text-muted-foreground">Room-scale VR</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground">Pico 4</p>
                  <p className="text-xs text-muted-foreground">Enterprise VR</p>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">AR Platforms</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground">iOS ARKit</p>
                  <p className="text-xs text-muted-foreground">iPhone/iPad support</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground">Android ARCore</p>
                  <p className="text-xs text-muted-foreground">Android devices</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground">HoloLens</p>
                  <p className="text-xs text-muted-foreground">Mixed reality</p>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <View className="w-4 h-4 inline mr-2" />
                Create VR Experience
              </button>
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <Smartphone className="w-4 h-4 inline mr-2" />
                Build AR Overlay
              </button>
              <button className="w-full p-3 text-left bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                <Users className="w-4 h-4 inline mr-2" />
                Schedule Demo
              </button>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
