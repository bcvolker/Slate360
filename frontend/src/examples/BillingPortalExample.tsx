import React from 'react';
import { useBillingPortal, useBillingPortalAccess } from '../hooks/useBillingPortal';
import toast from 'react-hot-toast';

// Example 1: Basic billing portal access check
export function BillingPortalAccessCheck() {
  const { loading, error, accessInfo, canAccessBilling, hasActiveSubscription } = useBillingPortalAccess();

  if (loading) {
    return <div>Checking billing access...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="billing-access-info">
      <h3>Billing Portal Access</h3>
      <div className="access-details">
        <p><strong>Can Access:</strong> {canAccessBilling ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Has Subscription:</strong> {hasActiveSubscription ? '✅ Yes' : '❌ No'}</p>
        {accessInfo && (
          <>
            <p><strong>Account Tier:</strong> {accessInfo.tier}</p>
            <p><strong>User Role:</strong> {accessInfo.role}</p>
          </>
        )}
      </div>
    </div>
  );
}

// Example 2: Billing portal button with access control
export function BillingPortalButton() {
  const { 
    loading, 
    error, 
    canAccessBilling, 
    redirectToPortal 
  } = useBillingPortalAccess();

  const handlePortalAccess = async () => {
    try {
      await redirectToPortal('/dashboard/billing?returned=true');
      toast.success('Redirecting to billing portal...');
    } catch (err) {
      toast.error('Failed to access billing portal');
    }
  };

  if (loading) {
    return <button disabled>Loading...</button>;
  }

  if (!canAccessBilling) {
    return (
      <div className="billing-access-denied">
        <p>Billing portal access not available for your account type.</p>
        <p>Please upgrade to Premium or Enterprise to manage your billing.</p>
      </div>
    );
  }

  return (
    <button 
      onClick={handlePortalAccess}
      className="billing-portal-button"
      disabled={loading}
    >
      {loading ? 'Accessing...' : 'Manage Billing & Subscription'}
    </button>
  );
}

// Example 3: Advanced billing portal management
export function AdvancedBillingPortal() {
  const { 
    loading, 
    error, 
    accessInfo, 
    canAccessBilling, 
    hasActiveSubscription,
    checkAccess,
    createPortalSession,
    redirectToPortal 
  } = useBillingPortal();

  const [customReturnUrl, setCustomReturnUrl] = React.useState('');

  const handleRefreshAccess = async () => {
    try {
      await checkAccess();
      toast.success('Billing access refreshed');
    } catch (err) {
      toast.error('Failed to refresh billing access');
    }
  };

  const handleCustomPortalSession = async () => {
    try {
      const portalUrl = await createPortalSession(customReturnUrl || undefined);
      toast.success('Portal session created successfully');
      
      // Option 1: Open in new tab
      window.open(portalUrl, '_blank');
      
      // Option 2: Redirect in current tab
      // window.location.href = portalUrl;
      
    } catch (err) {
      toast.error('Failed to create portal session');
    }
  };

  const handleDirectRedirect = async () => {
    try {
      await redirectToPortal(customReturnUrl || undefined);
    } catch (err) {
      toast.error('Failed to redirect to portal');
    }
  };

  if (loading && !accessInfo) {
    return <div>Loading billing information...</div>;
  }

  return (
    <div className="advanced-billing-portal">
      <h3>Advanced Billing Portal Management</h3>
      
      {/* Access Information */}
      <div className="access-section">
        <h4>Current Access Status</h4>
        <div className="status-grid">
          <div className="status-item">
            <span className="label">Portal Access:</span>
            <span className={`value ${canAccessBilling ? 'success' : 'error'}`}>
              {canAccessBilling ? 'Available' : 'Not Available'}
            </span>
          </div>
          <div className="status-item">
            <span className="label">Subscription:</span>
            <span className={`value ${hasActiveSubscription ? 'success' : 'warning'}`}>
              {hasActiveSubscription ? 'Active' : 'None'}
            </span>
          </div>
          {accessInfo && (
            <>
              <div className="status-item">
                <span className="label">Account Tier:</span>
                <span className="value">{accessInfo.tier}</span>
              </div>
              <div className="status-item">
                <span className="label">User Role:</span>
                <span className="value">{accessInfo.role}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-section">
          <h4>Error</h4>
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="actions-section">
        <h4>Actions</h4>
        
        <div className="action-group">
          <button 
            onClick={handleRefreshAccess}
            disabled={loading}
            className="action-button secondary"
          >
            {loading ? 'Refreshing...' : 'Refresh Access Status'}
          </button>
        </div>

        <div className="action-group">
          <label htmlFor="returnUrl">Custom Return URL (optional):</label>
          <input
            id="returnUrl"
            type="text"
            value={customReturnUrl}
            onChange={(e) => setCustomReturnUrl(e.target.value)}
            placeholder="https://yoursite.com/dashboard"
            className="return-url-input"
          />
        </div>

        <div className="action-group">
          <button 
            onClick={handleCustomPortalSession}
            disabled={loading || !canAccessBilling}
            className="action-button primary"
          >
            {loading ? 'Creating...' : 'Create Portal Session (New Tab)'}
          </button>
          
          <button 
            onClick={handleDirectRedirect}
            disabled={loading || !canAccessBilling}
            className="action-button primary"
          >
            {loading ? 'Redirecting...' : 'Redirect to Portal'}
          </button>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="examples-section">
        <h4>Usage Examples</h4>
        <div className="code-examples">
          <div className="code-block">
            <h5>Basic Portal Access</h5>
            <pre>
{`const { redirectToPortal } = useBillingPortal();
await redirectToPortal();`}
            </pre>
          </div>
          
          <div className="code-block">
            <h5>Custom Return URL</h5>
            <pre>
{`const { redirectToPortal } = useBillingPortal();
await redirectToPortal('/dashboard/billing?returned=true');`}
            </pre>
          </div>
          
          <div className="code-block">
            <h5>Manual Session Creation</h5>
            <pre>
{`const { createPortalSession } = useBillingPortal();
const portalUrl = await createPortalSession('/dashboard');
window.open(portalUrl, '_blank');`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 4: Billing portal integration in dashboard
export function DashboardBillingSection() {
  const { 
    loading, 
    error, 
    canAccessBilling, 
    hasActiveSubscription,
    accessInfo,
    redirectToPortal 
  } = useBillingPortalAccess();

  const handleManageBilling = async () => {
    try {
      await redirectToPortal('/dashboard?billing=managed');
    } catch (err) {
      toast.error('Unable to access billing portal');
    }
  };

  const handleUpgradeSubscription = () => {
    // Redirect to pricing page
    window.location.href = '/pricing';
  };

  if (loading) {
    return (
      <div className="dashboard-billing-section loading">
        <div className="skeleton-loader">Loading billing information...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-billing-section">
      <h3>Billing & Subscription</h3>
      
      {error ? (
        <div className="error-message">
          <p>Unable to load billing information: {error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      ) : (
        <div className="billing-content">
          {/* Current Plan Display */}
          <div className="current-plan">
            <h4>Current Plan</h4>
            <div className="plan-details">
              <span className="plan-name">{accessInfo?.tier || 'Free'}</span>
              <span className="plan-status">
                {hasActiveSubscription ? 'Active' : 'No Active Subscription'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="billing-actions">
            {canAccessBilling && hasActiveSubscription ? (
              <button 
                onClick={handleManageBilling}
                className="manage-billing-button"
              >
                Manage Billing & Subscription
              </button>
            ) : (
              <button 
                onClick={handleUpgradeSubscription}
                className="upgrade-button"
              >
                Upgrade to Premium
              </button>
            )}
          </div>

          {/* Additional Information */}
          {accessInfo && (
            <div className="billing-info">
              <p><strong>Account Type:</strong> {accessInfo.role}</p>
              <p><strong>Billing Access:</strong> {canAccessBilling ? 'Available' : 'Not Available'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
