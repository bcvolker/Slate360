'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface RoleAccess {
  isAuthenticated: boolean;
  userRole: string | null;
  userTier: string | null;
  isCEO: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  isEnterprise: boolean;
  canAccessFeature: (feature: string) => boolean;
}

export function useRole(): RoleAccess {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const userRole = session?.user?.role || null;
  const userTier = session?.user?.tier || null;
  
  const isCEO = userRole === 'ceo';
  const isAdmin = userRole === 'admin' || userRole === 'ceo';
  const isPremium = userTier === 'premium' || userTier === 'enterprise';
  const isEnterprise = userTier === 'enterprise';

  const canAccessFeature = (feature: string): boolean => {
    if (!isAuthenticated) return false;
    
    switch (feature) {
      case 'project-hub':
        return true; // All authenticated users
      case 'bim-viewer':
        return isPremium;
      case '360-tours':
        return isPremium;
      case 'vr-ar':
        return isEnterprise;
      case 'geospatial':
        return isEnterprise;
      case 'ceo-dashboard':
        return isCEO;
      case 'admin-panel':
        return isAdmin;
      default:
        return false;
    }
  };

  return {
    isAuthenticated,
    userRole,
    userTier,
    isCEO,
    isAdmin,
    isPremium,
    isEnterprise,
    canAccessFeature,
  };
}

// HOC for role-based component protection
export function withRole<T extends object>(
  Component: React.ComponentType<T>,
  requiredRole?: string,
  requiredTier?: string
) {
  return function RoleProtectedComponent(props: T) {
    const { isAuthenticated, userRole, userTier, canAccessFeature } = useRole();
    
    if (!isAuthenticated) {
      return <div>Please log in to access this feature.</div>;
    }
    
    if (requiredRole && userRole !== requiredRole) {
      return <div>Access denied. Required role: {requiredRole}</div>;
    }
    
    if (requiredTier && userTier !== requiredTier) {
      return <div>Access denied. Required tier: {requiredTier}</div>;
    }
    
    return <Component {...props} />;
  };
}

// Hook for access control in components
export function useAccessControl() {
  const { isAuthenticated, userRole, userTier } = useRole();
  
  return {
    isAuthenticated,
    userRole,
    userTier,
    hasRole: (role: string) => userRole === role,
    hasTier: (tier: string) => userTier === tier,
    hasMinimumRole: (minRole: string) => {
      const roleHierarchy = ['user', 'admin', 'ceo'];
      const userRoleIndex = roleHierarchy.indexOf(userRole || 'user');
      const minRoleIndex = roleHierarchy.indexOf(minRole);
      return userRoleIndex >= minRoleIndex;
    },
  };
}

// Hook for feature flags
export function useFeatureFlags() {
  const { userRole, userTier } = useRole();
  
  return {
    features: {
      demoMode: userRole === 'ceo' || userRole === 'admin',
      advancedAnalytics: userTier === 'premium' || userTier === 'enterprise',
      offlineSync: true,
      realTimeCollaboration: userTier === 'enterprise',
      aiInsights: userTier === 'enterprise',
      customBranding: userTier === 'enterprise',
    },
    isFeatureEnabled: (feature: string) => {
      const features = {
        demoMode: userRole === 'ceo' || userRole === 'admin',
        advancedAnalytics: userTier === 'premium' || userTier === 'enterprise',
        offlineSync: true,
        realTimeCollaboration: userTier === 'enterprise',
        aiInsights: userTier === 'enterprise',
        customBranding: userTier === 'enterprise',
      };
      return features[feature as keyof typeof features] || false;
    },
  };
}
