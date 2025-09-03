'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface RoleAccess {
  isAuthenticated: boolean;
  userRole: string | null;
  userTier: string | null;
  isCEO: boolean;
  isAdmin: boolean;
  isManager: boolean; // Add the missing property
  isPremium: boolean;
  isEnterprise: boolean;
  canAccessFeature: (feature: string) => boolean;
}

export function useRole(): RoleAccess {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState<'authenticated' | 'loading' | 'unauthenticated'>('loading');

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setSession(data);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        setStatus('unauthenticated');
      }
    };

    loadSession();
    const interval = setInterval(loadSession, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const isAuthenticated = status === 'authenticated';
  const userRole = (session as any)?.user?.role || null;
  const userTier = (session as any)?.user?.tier || null;
  
  const isCEO = userRole === 'ceo';
  const isAdmin = userRole === 'admin' || userRole === 'ceo';
  const isManager = userRole === 'manager' || isAdmin; // Add manager logic
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
    isManager,
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
  const { isAuthenticated, userRole, userTier, isAdmin, isCEO } = useRole();
  
  return {
    isAuthenticated,
    userRole,
    userTier,
    canAccessAdmin: isAdmin || isCEO,
    canManageUsers: isAdmin || isCEO,
    canViewAnalytics: isAdmin || isCEO || userTier === 'premium' || userTier === 'enterprise',
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
