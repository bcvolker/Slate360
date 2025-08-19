import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireRole, withRole } from './middleware/requireRole';

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/contact', '/pricing', '/about', '/terms', '/privacy'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // API routes - let them handle their own authentication
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Static files
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // Dashboard routes - require authentication
  if (pathname.startsWith('/dashboard')) {
    // CEO tab - require CEO role
    if (pathname === '/dashboard/ceo') {
      const ceoCheck = await requireRole('ceo', { redirectTo: '/unauthorized' });
      if (ceoCheck) return ceoCheck;
    }

    // All other dashboard routes - require basic authentication
    const authCheck = await requireRole('user', { redirectTo: '/login' });
    if (authCheck) return authCheck;
  }

  // Admin routes - require admin or CEO role
  if (pathname.startsWith('/admin')) {
    const adminCheck = await requireRole(['admin', 'ceo'], { redirectTo: '/unauthorized' });
    if (adminCheck) return adminCheck;
  }

  // Premium features - require premium tier or higher
  if (pathname.startsWith('/premium')) {
    const premiumCheck = await requireRole('user', { redirectTo: '/pricing' });
    if (premiumCheck) return premiumCheck;
    
    // Additional tier checking would go here
    // This would require checking the user's subscription tier
  }

  // Enterprise features - require enterprise tier
  if (pathname.startsWith('/enterprise')) {
    const enterpriseCheck = await requireRole('user', { redirectTo: '/contact?subject=enterprise-upgrade' });
    if (enterpriseCheck) return enterpriseCheck;
    
    // Additional tier checking would go here
  }

  // User profile and account management - require authentication
  if (pathname.startsWith('/profile') || pathname.startsWith('/account')) {
    const authCheck = await requireRole('user', { redirectTo: '/login' });
    if (authCheck) return authCheck;
  }

  // Billing and subscription management - require authentication
  if (pathname.startsWith('/billing') || pathname.startsWith('/subscription')) {
    const authCheck = await requireRole('user', { redirectTo: '/login' });
    if (authCheck) return authCheck;
  }

  // Allow access to all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
