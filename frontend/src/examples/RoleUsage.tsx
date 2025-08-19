import React from 'react';
import { useRole, withRole, useAccessControl, useFeatureFlags } from '../hooks/useRole';

// Example 1: Basic role checking in a component
function UserProfile() {
  const { userRole, userTier, isCEO, isPremium } = useRole();

  return (
    <div>
      <h2>User Profile</h2>
      <p>Role: {userRole}</p>
      <p>Tier: {userTier}</p>
      
      {isCEO && <p>Welcome, CEO! You have full access.</p>}
      {isPremium && <p>Premium features unlocked!</p>}
    </div>
  );
}

// Example 2: Conditional rendering based on access control
function AdminPanel() {
  const { canAccessAdmin, canManageUsers, canViewAnalytics } = useAccessControl();

  if (!canAccessAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      
      {canManageUsers && (
        <div>
          <h3>User Management</h3>
          <button>Add User</button>
          <button>Remove User</button>
        </div>
      )}
      
      {canViewAnalytics && (
        <div>
          <h3>Analytics Dashboard</h3>
          <p>View detailed analytics here...</p>
        </div>
      )}
    </div>
  );
}

// Example 3: Feature flags based on user tier
function FeatureShowcase() {
  const {
    canUseAdvanced3D,
    canCreateTours,
    canCollaborate,
    tourLimit,
    storageLimit
  } = useFeatureFlags();

  return (
    <div>
      <h2>Available Features</h2>
      
      <div>
        <h3>3D Modeling</h3>
        <p>Basic 3D: ✅ Available</p>
        <p>Advanced 3D: {canUseAdvanced3D ? '✅ Available' : '❌ Premium Required'}</p>
      </div>
      
      <div>
        <h3>360° Tours</h3>
        <p>Create Tours: {canCreateTours ? '✅ Available' : '❌ Premium Required'}</p>
        <p>Tour Limit: {tourLimit === -1 ? 'Unlimited' : `${tourLimit} tours`}</p>
      </div>
      
      <div>
        <h3>Collaboration</h3>
        <p>Team Collaboration: {canCollaborate ? '✅ Available' : '❌ Premium Required'}</p>
      </div>
      
      <div>
        <h3>Storage</h3>
        <p>Storage Limit: {storageLimit}</p>
      </div>
    </div>
  );
}

// Example 4: Higher-order component for role protection
const CEOOnlyComponent = withRole(
  function CEOFeatures() {
    return (
      <div>
        <h2>CEO-Only Features</h2>
        <p>User management, pricing control, and system analytics</p>
      </div>
    );
  },
  'ceo',
  function AccessDenied() {
    return <div>CEO access required for this feature.</div>;
  }
);

// Example 5: API route protection (server-side)
async function protectedAPIHandler(req: Request) {
  // This would be used in your API routes
  const { requireRole } = await import('../middleware/requireRole');
  
  // Check if user has admin access
  const adminCheck = await requireRole(['admin', 'ceo'], {
    redirectTo: '/unauthorized'
  });
  
  if (adminCheck) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Proceed with admin-only logic
  return new Response('Admin access granted', { status: 200 });
}

// Example 6: Dashboard component with role-based navigation
function Dashboard() {
  const { isCEO, isAdmin, isManager, isPremium } = useRole();
  const { canAccessAPI, canWhiteLabel } = useFeatureFlags();

  return (
    <div>
      <h1>Dashboard</h1>
      
      <nav>
        <a href="/dashboard/project-hub">Project Hub</a>
        <a href="/dashboard/bim-studio">BIM Studio</a>
        <a href="/dashboard/360-tours">360° Tours</a>
        
        {isPremium && (
          <a href="/dashboard/analytics">Analytics</a>
        )}
        
        {canAccessAPI && (
          <a href="/dashboard/api">API Access</a>
        )}
        
        {isManager && (
          <a href="/dashboard/team">Team Management</a>
        )}
        
        {isAdmin && (
          <a href="/dashboard/admin">Admin Panel</a>
        )}
        
        {isCEO && (
          <a href="/dashboard/ceo">CEO Dashboard</a>
        )}
        
        {canWhiteLabel && (
          <a href="/dashboard/white-label">White Label</a>
        )}
      </nav>
    </div>
  );
}

// Example 7: Subscription upgrade prompt
function UpgradePrompt() {
  const { userTier, isPremium, isEnterprise } = useRole();
  const { canUseAdvanced3D, canCreateTours } = useFeatureFlags();

  if (isEnterprise) {
    return <div>You have access to all features!</div>;
  }

  if (isPremium) {
    return (
      <div>
        <h3>Upgrade to Enterprise</h3>
        <p>Get unlimited projects, on-premise options, and dedicated support.</p>
        <button>Contact Sales</button>
      </div>
    );
  }

  return (
    <div>
      <h3>Upgrade to Premium</h3>
      <p>Unlock advanced 3D modeling, 360° tours, and team collaboration.</p>
      <button>Upgrade Now</button>
    </div>
  );
}

// Export all examples
export {
  UserProfile,
  AdminPanel,
  FeatureShowcase,
  CEOOnlyComponent,
  Dashboard,
  UpgradePrompt
};
