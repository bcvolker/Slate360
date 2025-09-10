'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useTheme } from 'next-themes';
import { 
  Sun, 
  Moon, 
  Monitor, 
  User, 
  Bell, 
  Shield, 
  Download,
  Upload,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const accountSettings = [
    { label: 'Profile Information', description: 'Update your personal details', icon: User },
    { label: 'Notification Preferences', description: 'Manage email and push notifications', icon: Bell },
    { label: 'Privacy & Security', description: 'Control your privacy settings', icon: Shield },
  ];

  const dataSettings = [
    { label: 'Export Data', description: 'Download your project data', icon: Download },
    { label: 'Import Data', description: 'Upload project files', icon: Upload },
    { label: 'Delete Account', description: 'Permanently remove your account', icon: Trash2 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and application settings
          </p>
        </div>

        {/* Theme Settings */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Appearance</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Theme</label>
              <div className="flex gap-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      theme === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:bg-accent'
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>

        {/* Account Settings */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account</h3>
          <div className="space-y-4">
            {accountSettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <setting.icon className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{setting.label}</h4>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Manage
                </button>
              </div>
            ))}
          </div>
        </SurfaceCard>

        {/* Data Management */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
          <div className="space-y-4">
            {dataSettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <setting.icon className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{setting.label}</h4>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-lg transition-colors ${
                  setting.label === 'Delete Account'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}>
                  {setting.label === 'Delete Account' ? 'Delete' : 'Action'}
                </button>
              </div>
            ))}
          </div>
        </SurfaceCard>

        {/* Application Info */}
        <SurfaceCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Application</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm text-foreground font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm text-foreground font-semibold">January 15, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Storage Used</span>
              <span className="text-sm text-foreground font-semibold">2.3 GB</span>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </DashboardLayout>
  );
}
