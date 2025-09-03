import React, { useState } from 'react';
import mongoose from 'mongoose';
import {
  logAudit,
  getAuditLogs,
  getAuditStats,
  cleanOldAuditLogs
} from '../lib/audit';
import { toast } from 'react-hot-toast';

// Example 1: Basic Audit Logging
export function BasicAuditLogExample() {
  const [loading, setLoading] = useState(false);

  const handleBasicLog = async () => {
    setLoading(true);
    try {
      await logAudit(
        new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // userId
        'user.login', // action
        'user', // resource
        'user123', // resourceId
        {
          method: 'email',
          success: true,
          ipAddress: '192.168.1.1'
        }, // details
        '192.168.1.1', // ipAddress
        'Mozilla/5.0...', // userAgent
        'low', // severity
        'security', // category
        'success', // outcome
        {} // metadata
      );

      toast.success('Audit logged successfully!');
    } catch (error) {
      toast.error('Error logging audit');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Audit Logging</h3>
      
      <button
        onClick={handleBasicLog}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Log User Login'}
      </button>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">What gets logged:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• User ID, email, and role</li>
          <li>• Action performed (user.login)</li>
          <li>• Detailed context (login method, success status, IP)</li>
          <li>• Category and severity classification</li>
          <li>• Timestamp and unique audit ID</li>
        </ul>
      </div>
    </div>
  );
}

// Example 2: Convenience Functions
export function ConvenienceFunctionsExample() {
  const [loading, setLoading] = useState(false);

  const handleUserAction = async () => {
    setLoading(true);
    try {
      await logAudit(
        new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // userId
        'user.update', // action
        'user', // resource
        'user123', // resourceId
        {
          field: 'profile',
          oldValue: 'John Doe',
          newValue: 'John Smith',
          reason: 'Name correction'
        }, // details
        '192.168.1.1', // ipAddress
        'Mozilla/5.0...', // userAgent
        'low', // severity
        'data', // category
        'success', // outcome
        {} // metadata
      );
      toast.success('User action logged');
    } catch (error) {
      toast.error('Failed to log user action');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityEvent = async () => {
    setLoading(true);
    try {
      await logAudit(
        new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // userId
        'security.permission_denied', // action
        'security', // resource
        'permission_denied', // resourceId
        {
          resource: '/admin/users',
          reason: 'Insufficient privileges',
          userRole: 'manager',
          requiredRole: 'admin'
        }, // details
        '192.168.1.1', // ipAddress
        'Mozilla/5.0...', // userAgent
        'high', // severity
        'security', // category
        'failure', // outcome
        {} // metadata
      );
      toast.success('Security event logged');
    } catch (error) {
      toast.error('Failed to log security event');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectAction = async () => {
    setLoading(true);
    try {
      await logAudit(
        new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // userId
        'project.create', // action
        'project', // resource
        'proj_456', // resourceId
        {
          projectName: 'New Office Building',
          budget: 500000,
          timeline: '12 months',
          client: 'ABC Corp'
        }, // details
        '192.168.1.1', // ipAddress
        'Mozilla/5.0...', // userAgent
        'low', // severity
        'project', // category
        'success', // outcome
        {} // metadata
      );
      toast.success('Project action logged');
    } catch (error) {
      toast.error('Failed to log project action');
    } finally {
      setLoading(false);
    }
  };

  const handleBillingEvent = async () => {
    setLoading(true);
    try {
      await logAudit(
        new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // userId
        'billing.subscription_created', // action
        'billing', // resource
        'sub_123456', // resourceId
        {
          plan: 'Premium',
          amount: 99.99,
          currency: 'USD',
          billingCycle: 'monthly',
          stripeSubscriptionId: 'sub_123456'
        }, // details
        '192.168.1.1', // ipAddress
        'Mozilla/5.0...', // userAgent
        'low', // severity
        'billing', // category
        'success', // outcome
        {} // metadata
      );
      toast.success('Billing event logged');
    } catch (error) {
      toast.error('Failed to log billing event');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemEvent = async () => {
    setLoading(true);
    try {
      await logAudit(
        new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // userId
        'system.maintenance', // action
        'system', // resource
        'maintenance_001', // resourceId
        {
          type: 'scheduled',
          duration: '2 hours',
          affectedServices: ['database', 'api'],
          maintenanceWindow: '2024-01-15 02:00-04:00 UTC'
        }, // details
        '192.168.1.1', // ipAddress
        'Mozilla/5.0...', // userAgent
        'medium', // severity
        'system', // category
        'success', // outcome
        {} // metadata
      );
      toast.success('System event logged');
    } catch (error) {
      toast.error('Failed to log system event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Convenience Functions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={handleUserAction}
          disabled={loading}
          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
        >
          Log User Action
        </button>
        
        <button
          onClick={handleSecurityEvent}
          disabled={loading}
          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
        >
          Log Security Event
        </button>
        
        <button
          onClick={handleProjectAction}
          disabled={loading}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
        >
          Log Project Action
        </button>
        
        <button
          onClick={handleBillingEvent}
          disabled={loading}
          className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 text-sm"
        >
          Log Billing Event
        </button>
        
        <button
          onClick={handleSystemEvent}
          disabled={loading}
          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 text-sm"
        >
          Log System Event
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Available convenience functions:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <code>logUserAction()</code> - For general user activities</li>
          <li>• <code>logSecurityEvent()</code> - For security-related events</li>
          <li>• <code>logProjectAction()</code> - For project-related activities</li>
          <li>• <code>logBillingEvent()</code> - For billing and subscription events</li>
          <li>• <code>logSystemEvent()</code> - For system-level events</li>
        </ul>
      </div>
    </div>
  );
}

// Example 3: Batch Logging
export function BatchLoggingExample() {
  const [loading, setLoading] = useState(false);

  const handleBatchLog = async () => {
    setLoading(true);
    try {
      const auditEvents = [
        {
          userId: 'user123',
          action: 'user.login',
          details: { method: 'email', success: true },
          category: 'security' as const
        },
        {
          userId: 'user123',
          action: 'user.page_view',
          details: { page: '/dashboard', duration: '5 minutes' },
          category: 'user' as const
        },
        {
          userId: 'user123',
          action: 'user.action',
          details: { action: 'export_data', format: 'csv' },
          category: 'data' as const
        }
      ];

      const results = await Promise.all(auditEvents.map(async (event) => {
        try {
          await logAudit(
            new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // userId
            event.action, // action
            'user', // resource
            'batch_event', // resourceId
            event.details, // details
            '192.168.1.1', // ipAddress
            'Mozilla/5.0...', // userAgent
            'low', // severity
            event.category, // category
            'success', // outcome
            {} // metadata
          );
          return { success: true };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      }));
      
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;
      
      toast.success(`Batch logged: ${successCount} success, ${failureCount} failed`);
      
      console.log('Batch audit results:', results);
      
    } catch (error) {
      toast.error('Failed to batch log audits');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Batch Audit Logging</h3>
      
      <button
        onClick={handleBatchLog}
        disabled={loading}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Log Multiple Events'}
      </button>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Batch logging benefits:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Log multiple related events at once</li>
          <li>• Better performance for bulk operations</li>
          <li>• Atomic logging for related activities</li>
          <li>• Individual success/failure tracking</li>
        </ul>
      </div>
    </div>
  );
}

// Example 4: Retrieving Audit Logs
export function RetrieveAuditLogsExample() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGetLogs = async () => {
    setLoading(true);
    try {
      const result = await getAuditLogs({}, 10, 0);
      
      setLogs(result);
      toast.success(`Retrieved ${result.length} audit logs`);
      
    } catch (error) {
      toast.error('Failed to retrieve audit logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStats = async () => {
    setLoading(true);
    try {
      const stats = await getAuditStats();
      setStats(stats);
      toast.success('Audit statistics retrieved');
      
    } catch (error) {
      toast.error('Failed to retrieve audit stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
      const endDate = new Date();
      
      const logs = await getAuditLogs({
        startDate,
        endDate
      }, 1000, 0);
      
      const jsonData = JSON.stringify(logs, null, 2);
      
      // Create download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Audit logs exported successfully');
      
    } catch (error) {
      toast.error('Failed to export audit logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Retrieve & Export Audit Logs</h3>
      
      <div className="flex space-x-3">
        <button
          onClick={handleGetLogs}
          disabled={loading}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
        >
          Get Recent Logs
        </button>
        
        <button
          onClick={handleGetStats}
          disabled={loading}
          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
        >
          Get Statistics
        </button>
        
        <button
          onClick={handleExportLogs}
          disabled={loading}
          className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 text-sm"
        >
          Export Logs (JSON)
        </button>
      </div>

      {/* Display Stats */}
      {stats && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">Audit Statistics:</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-green-700">Total Logs:</span>
              <span className="font-medium ml-2">{stats.totalLogs}</span>
            </div>
            <div>
              <span className="text-green-700">Unique Users:</span>
              <span className="font-medium ml-2">{stats.uniqueUsers}</span>
            </div>
            <div>
              <span className="text-green-700">Actions:</span>
              <span className="font-medium ml-2">{stats.uniqueActions}</span>
            </div>
            <div>
              <span className="text-green-700">Categories:</span>
              <span className="font-medium ml-2">{stats.uniqueCategories}</span>
            </div>
            <div>
              <span className="text-green-700">Severities:</span>
              <span className="font-medium ml-2">{stats.uniqueSeverities}</span>
            </div>
          </div>
        </div>
      )}

      {/* Display Logs */}
      {logs.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Recent Audit Logs:</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="bg-white p-3 rounded border text-sm">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{log.action}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    log.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    log.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    log.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {log.severity}
                  </span>
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  {log.userId} • {new Date(log.timestamp).toLocaleString()} • {log.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Example 5: Advanced Usage with Request Context
export function AdvancedAuditExample() {
  const [loading, setLoading] = useState(false);

  const handleAdvancedLog = async () => {
    setLoading(true);
    try {
      // Simulate getting request context
      const requestContext = {
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess_123456',
        requestId: 'req_789012'
      };

      await logAudit(
        new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // userId
        'admin.user_management', // action
        'user_management', // resource
        'bulk_update_001', // resourceId
        {
          operation: 'bulk_user_update',
          affectedUsers: ['user1', 'user2', 'user3'],
          changes: {
            role: 'manager',
            tier: 'premium'
          },
          reason: 'Department restructuring',
          sessionId: requestContext.sessionId,
          requestId: requestContext.requestId,
          processingTime: '2.5s',
          batchSize: 3
        }, // details
        requestContext.ipAddress, // ipAddress
        requestContext.userAgent, // userAgent
        'high', // severity
        'system', // category
        'success', // outcome
        {
          sessionId: requestContext.sessionId,
          requestId: requestContext.requestId,
          processingTime: '2.5s',
          batchSize: 3
        } // metadata
      );

      toast.success('Advanced audit logged successfully!');
      
    } catch (error) {
      toast.error('Error logging advanced audit');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Advanced Audit Logging</h3>
      
      <button
        onClick={handleAdvancedLog}
        disabled={loading}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Log Advanced Event'}
      </button>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Advanced features demonstrated:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Request context (IP, User-Agent)</li>
          <li>• Resource tracking (type and ID)</li>
          <li>• Rich metadata (session, request IDs, timing)</li>
          <li>• Detailed operation context</li>
          <li>• Severity classification</li>
        </ul>
      </div>
    </div>
  );
}

// Main example component
export function AuditLogExamples() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Audit Logging Utility Examples</h2>
      
      <BasicAuditLogExample />
      <ConvenienceFunctionsExample />
      <BatchLoggingExample />
      <RetrieveAuditLogsExample />
      <AdvancedAuditExample />
    </div>
  );
}
