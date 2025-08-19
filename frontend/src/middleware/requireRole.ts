import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export interface RoleConfig {
  role: string;
  redirectTo?: string;
  allowUnauthenticated?: boolean;
}

export interface RequireRoleOptions {
  roles?: string[];
  redirectTo?: string;
  allowUnauthenticated?: boolean;
  fallbackRole?: string;
}

/**
 * Middleware function to require specific user roles
 * @param role - Required role(s) for access
 * @param options - Additional configuration options
 * @returns NextResponse or null if access is allowed
 */
export async function requireRole(
  role: string | string[],
  options: RequireRoleOptions = {}
): Promise<NextResponse | null> {
  const {
    redirectTo = '/login',
    allowUnauthenticated = false,
    fallbackRole = 'user'
  } = options;

  // Convert single role to array for consistent handling
  const requiredRoles = Array.isArray(role) ? role : [role];

  try {
    // Get the JWT token from the request
    const token = await getToken({ 
      req: new NextRequest(), 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // If no token and unauthenticated access is not allowed
    if (!token && !allowUnauthenticated) {
      return NextResponse.redirect(new URL(redirectTo, process.env.NEXTAUTH_URL || 'http://localhost:3000'));
    }

    // If no token but unauthenticated access is allowed
    if (!token && allowUnauthenticated) {
      return null; // Allow access
    }

    // If token exists, check user role
    if (token) {
      const userRole = token.role || fallbackRole;
      
      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some(requiredRole => {
        // Handle role hierarchy (admin > manager > user)
        if (requiredRole === 'admin' && userRole === 'admin') return true;
        if (requiredRole === 'manager' && (userRole === 'admin' || userRole === 'manager')) return true;
        if (requiredRole === 'user' && (userRole === 'admin' || userRole === 'manager' || userRole === 'user')) return true;
        if (requiredRole === 'ceo' && userRole === 'ceo') return true;
        
        // Direct role match
        return userRole === requiredRole;
      });

      if (!hasRequiredRole) {
        // Redirect to unauthorized page or dashboard
        const unauthorizedRedirect = options.redirectTo || '/unauthorized';
        return NextResponse.redirect(new URL(unauthorizedRedirect, process.env.NEXTAUTH_URL || 'http://localhost:3000'));
      }
    }

    // Access granted
    return null;

  } catch (error) {
    console.error('Role middleware error:', error);
    
    // On error, redirect to login for security
    return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
  }
}

/**
 * Higher-order function to create role-specific middleware
 * @param role - Required role(s)
 * @param options - Middleware options
 * @returns Middleware function
 */
export function withRole(
  role: string | string[],
  options: RequireRoleOptions = {}
) {
  return async function roleMiddleware(request: NextRequest): Promise<NextResponse | null> {
    return requireRole(role, options);
  };
}

/**
 * Middleware for CEO-only access
 */
export const requireCEO = () => requireRole('ceo', { redirectTo: '/unauthorized' });

/**
 * Middleware for admin access (admin, ceo)
 */
export const requireAdmin = () => requireRole(['admin', 'ceo'], { redirectTo: '/unauthorized' });

/**
 * Middleware for manager access (manager, admin, ceo)
 */
export const requireManager = () => requireRole(['manager', 'admin', 'ceo'], { redirectTo: '/unauthorized' });

/**
 * Middleware for authenticated users only
 */
export const requireAuth = () => requireRole('user', { 
  redirectTo: '/login',
  allowUnauthenticated: false 
});

/**
 * Middleware for premium tier access
 */
export const requirePremium = () => requireRole('user', {
  redirectTo: '/pricing',
  allowUnauthenticated: false,
  // Note: This would need additional tier checking logic in the actual implementation
});

/**
 * Middleware for enterprise tier access
 */
export const requireEnterprise = () => requireRole('user', {
  redirectTo: '/contact?subject=enterprise-upgrade',
  allowUnauthenticated: false,
  // Note: This would need additional tier checking logic in the actual implementation
});

/**
 * Role and tier checking utilities for middleware and server-side validation
 */

/**
 * Check if user has required role
 * @param userRole - User's current role
 * @param requiredRole - Required role(s) - can be string or array
 * @returns boolean indicating if user has access
 */
export function hasRole(userRole: string, requiredRole: string | string[]): boolean {
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole.toLowerCase());
  }
  
  return userRole.toLowerCase() === requiredRole.toLowerCase();
}

/**
 * Check if user has required tier
 * @param userTier - User's current tier
 * @param requiredTier - Required tier
 * @returns boolean indicating if user has access
 */
export function hasTier(userTier: string, requiredTier: string): boolean {
  if (!userTier) return false;
  
  const tierHierarchy = {
    'free': 0,
    'basic': 1,
    'premium': 2,
    'enterprise': 3
  };
  
  const userTierLevel = tierHierarchy[userTier.toLowerCase() as keyof typeof tierHierarchy] || 0;
  const requiredTierLevel = tierHierarchy[requiredTier.toLowerCase() as keyof typeof tierHierarchy] || 0;
  
  return userTierLevel >= requiredTierLevel;
}

/**
 * Get role hierarchy level
 * @param role - User role
 * @returns numeric level (higher = more permissions)
 */
export function getRoleLevel(role: string): number {
  const roleHierarchy = {
    'user': 0,
    'viewer': 1,
    'member': 2,
    'manager': 3,
    'admin': 4,
    'ceo': 5
  };
  
  return roleHierarchy[role.toLowerCase() as keyof typeof roleHierarchy] || 0;
}

/**
 * Check if user has minimum role level
 * @param userRole - User's current role
 * @param minLevel - Minimum required level
 * @returns boolean indicating if user meets minimum level
 */
export function hasMinimumRole(userRole: string, minLevel: number): boolean {
  const userLevel = getRoleLevel(userRole);
  return userLevel >= minLevel;
}
