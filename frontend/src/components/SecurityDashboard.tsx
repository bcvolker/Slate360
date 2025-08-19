import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Settings, 
  Activity,
  FileText,
  Lock,
  Eye,
  Zap
} from 'lucide-react';

interface SecurityStatus {
  csrf: boolean;
  headers: boolean;
  validation: boolean;
  rateLimit: boolean;
  session: boolean;
  logging: boolean;
  mfa: boolean;
  encryption: boolean;
  monitoring: boolean;
  fileUpload: boolean;
  errorHandling: boolean;
  apiSecurity: boolean;
}

interface SecurityHealth {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
}

interface SecurityConfig {
  csrf: { enabled: boolean; secret: string };
  headers: { enabled: boolean; strictMode: boolean };
  validation: { sanitization: boolean; strictMode: boolean };
  rateLimit: { enabled: boolean; strictMode: boolean; redisEnabled: boolean };
  session: { timeout: number; maxConcurrent: number; deviceFingerprinting: boolean };
  logging: { level: string; securityEvents: boolean; auditTrail: boolean };
  mfa: { enabled: boolean; required: boolean; backupCodes: boolean };
  encryption: { enabled: boolean; algorithm: string; keyRotation: boolean };
  monitoring: { enabled: boolean; realTime: boolean; alerting: boolean };
  fileUpload: { enabled: boolean; maxFileSize: number; malwareScanning: boolean };
  errorHandling: { enabled: boolean; sanitizeErrors: boolean; logAllErrors: boolean };
  apiSecurity: { enabled: boolean; requireAuth: boolean; requireCSRF: boolean };
}

const SecurityDashboard: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [securityHealth, setSecurityHealth] = useState<SecurityHealth | null>(null);
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'config' | 'logs'>('overview');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading security data
      // In production, these would be actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setSecurityStatus({
        csrf: true,
        headers: true,
        validation: true,
        rateLimit: true,
        session: true,
        logging: true,
        mfa: false,
        encryption: true,
        monitoring: true,
        fileUpload: true,
        errorHandling: true,
        apiSecurity: true
      });

      setSecurityHealth({
        status: 'warning',
        issues: [
          'MFA is not enabled for any users',
          'CSRF secret is using default value in development',
          'File upload malware scanning configured but no engines active'
        ],
        recommendations: [
          'Enable MFA for all admin users',
          'Change CSRF secret in production',
          'Configure VirusTotal API key or ClamAV for malware scanning'
        ]
      });

      setSecurityConfig({
        csrf: { enabled: true, secret: 'default-csrf-secret' },
        headers: { enabled: true, strictMode: false },
        validation: { sanitization: true, strictMode: false },
        rateLimit: { enabled: true, strictMode: false, redisEnabled: false },
        session: { timeout: 86400000, maxConcurrent: 3, deviceFingerprinting: true },
        logging: { level: 'info', securityEvents: true, auditTrail: true },
        mfa: { enabled: true, required: false, backupCodes: true },
        encryption: { enabled: true, algorithm: 'aes-256-gcm', keyRotation: false },
        monitoring: { enabled: true, realTime: true, alerting: true },
        fileUpload: { enabled: true, maxFileSize: 10485760, malwareScanning: true },
        errorHandling: { enabled: true, sanitizeErrors: true, logAllErrors: true },
        apiSecurity: { enabled: true, requireAuth: true, requireCSRF: true }
      });

    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runHealthCheck = async () => {
    try {
      setIsLoading(true);
      // Simulate health check
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update health status
      setSecurityHealth(prev => prev ? {
        ...prev,
        status: 'healthy',
        issues: ['All security features are properly configured'],
        recommendations: ['Continue monitoring security metrics']
      } : null);
      
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSecurityFeature = (feature: keyof SecurityConfig, subFeature: string) => {
    if (!securityConfig) return;
    
    setSecurityConfig(prev => {
      if (!prev) return prev;
      
      const newConfig = { ...prev };
      if (subFeature in newConfig[feature]) {
        (newConfig[feature] as any)[subFeature] = !(newConfig[feature] as any)[subFeature];
      }
      return newConfig;
    });
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
        </div>
        <button
          onClick={runHealthCheck}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Activity className="w-4 h-4" />
          <span>Run Health Check</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'health', label: 'Health Check', icon: CheckCircle },
            { id: 'config', label: 'Configuration', icon: Settings },
            { id: 'logs', label: 'Security Logs', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Security Status Grid */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Features Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {securityStatus && Object.entries(securityStatus).map(([feature, status]) => (
                  <div key={feature} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(status)}
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lock className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">Active Sessions</p>
                    <p className="text-2xl font-bold text-blue-900">12</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Security Score</p>
                    <p className="text-2xl font-bold text-green-900">85%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Active Threats</p>
                    <p className="text-2xl font-bold text-yellow-900">2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-6">
            {securityHealth && (
              <>
                {/* Health Status */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getHealthStatusColor(securityHealth.status)}`}>
                  <span className="capitalize">{securityHealth.status}</span>
                </div>

                {/* Issues */}
                {securityHealth.issues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Issues Found</h3>
                    <div className="space-y-2">
                      {securityHealth.issues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-700">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {securityHealth.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                    <div className="space-y-2">
                      {securityHealth.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-blue-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            {securityConfig && (
              <div className="space-y-6">
                {/* CSRF Configuration */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">CSRF Protection</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Enabled</span>
                      <button
                        onClick={() => toggleSecurityFeature('csrf', 'enabled')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          securityConfig.csrf.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securityConfig.csrf.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Secret: {securityConfig.csrf.secret.substring(0, 8)}...
                    </div>
                  </div>
                </div>

                {/* Headers Configuration */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Headers</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Enabled</span>
                      <button
                        onClick={() => toggleSecurityFeature('headers', 'enabled')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          securityConfig.headers.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securityConfig.headers.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Strict Mode</span>
                      <button
                        onClick={() => toggleSecurityFeature('headers', 'strictMode')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          securityConfig.headers.strictMode ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securityConfig.headers.strictMode ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* MFA Configuration */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Multi-Factor Authentication</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Enabled</span>
                      <button
                        onClick={() => toggleSecurityFeature('mfa', 'enabled')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          securityConfig.mfa.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securityConfig.mfa.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Required for All Users</span>
                      <button
                        onClick={() => toggleSecurityFeature('mfa', 'required')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          securityConfig.mfa.required ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securityConfig.mfa.required ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Security Logs</h3>
              </div>
              <p className="text-sm text-gray-600">
                Security logs and audit trails are being collected and monitored in real-time.
                Access to detailed logs requires appropriate permissions.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Recent Events:</span>
                  <span className="ml-2 text-gray-600">1,247</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Security Alerts:</span>
                  <span className="ml-2 text-gray-600">3</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Failed Logins:</span>
                  <span className="ml-2 text-gray-600">12</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Suspicious Activity:</span>
                  <span className="ml-2 text-gray-600">1</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
