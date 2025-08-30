import React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface BillingPortalAccess {
  canAccess: boolean;
  hasStripeCustomer: boolean;
  tier: string;
  role: string;
}

export interface BillingPortalSession {
  url: string;
  expiresAt: number;
}

export interface UseBillingPortalReturn {
  // State
  loading: boolean;
  error: string | null;
  accessInfo: BillingPortalAccess | null;
  
  // Actions
  checkAccess: () => Promise<BillingPortalAccess>;
  createPortalSession: (returnUrl?: string) => Promise<string>;
  redirectToPortal: (returnUrl?: string) => Promise<void>;
  
  // Utilities
  canAccessBilling: boolean;
  hasActiveSubscription: boolean;
}

/**
 * React hook for managing Stripe billing portal access
 * @returns Object with billing portal utilities and state
 */
export function useBillingPortal(): UseBillingPortalReturn {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessInfo, setAccessInfo] = useState<BillingPortalAccess | null>(null);

  /**
   * Check if user can access the billing portal
   */
  const checkAccess = async (): Promise<BillingPortalAccess> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/billing/portal');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check billing access');
      }

      const accessData = await response.json();
      setAccessInfo(accessData);
      return accessData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a billing portal session and return the URL
   */
  const createPortalSession = async (returnUrl?: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ returnUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create billing portal session');
      }

      const sessionData: BillingPortalSession = await response.json();
      return sessionData.url;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Redirect user to the billing portal
   */
  const redirectToPortal = async (returnUrl?: string): Promise<void> => {
    try {
      const portalUrl = await createPortalSession(returnUrl);
      window.location.href = portalUrl;
    } catch (err) {
      // Error is already set in createPortalSession
      console.error('Failed to redirect to billing portal:', err);
    }
  };

  // Computed values
  const canAccessBilling = accessInfo?.canAccess || false;
  const hasActiveSubscription = accessInfo?.hasStripeCustomer || false;

  return {
    // State
    loading,
    error,
    accessInfo,
    
    // Actions
    checkAccess,
    createPortalSession,
    redirectToPortal,
    
    // Utilities
    canAccessBilling,
    hasActiveSubscription,
  };
}

/**
 * Hook for checking billing portal access on component mount
 */
export function useBillingPortalAccess() {
  const { checkAccess, ...rest } = useBillingPortal();

  // Check access when hook is used
  React.useEffect(() => {
    checkAccess().catch(console.error);
  }, []);

  return rest;
}
