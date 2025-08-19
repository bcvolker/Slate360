import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { 
          error: 'Billing service temporarily unavailable',
          message: 'Stripe integration is being configured. Please try again later.'
        },
        { status: 503 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Dynamically import Stripe to avoid import errors when not configured
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Dynamically import database connection
    const connectDB = (await import('@/lib/db')).default;
    await connectDB();

    // Get user from database to check if they have a Stripe customer ID
    if (!session.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const User = (await import('@/models/User')).default;
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has a Stripe customer ID
    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found. Please contact support.' },
        { status: 400 }
      );
    }

    // Get the return URL from the request body (optional)
    const { returnUrl } = await request.json();
    const defaultReturnUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`;

    // Create Stripe billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl || defaultReturnUrl,
      configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID, // Optional: custom portal configuration
    });

    return NextResponse.json({
      url: portalSession.url,
      expiresAt: (portalSession as any).expires_at || null,
    });

  } catch (error) {
    console.error('Billing portal error:', error);

    // Check if it's a Stripe error
    if (error && typeof error === 'object' && 'type' in error) {
      const errorType = (error as any).type;
      switch (errorType) {
        case 'invalid_request_error':
          return NextResponse.json(
            { error: 'Invalid billing portal request' },
            { status: 400 }
          );
        case 'api_error':
          return NextResponse.json(
            { error: 'Stripe service temporarily unavailable' },
            { status: 503 }
          );
        default:
          return NextResponse.json(
            { error: 'Billing portal error occurred' },
            { status: 400 }
          );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method to check if user can access billing portal
export async function GET(request: NextRequest) {
  try {
    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { 
          error: 'Billing service temporarily unavailable',
          message: 'Stripe integration is being configured. Please try again later.'
        },
        { status: 503 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Dynamically import database connection
    const connectDB = (await import('@/lib/db')).default;
    await connectDB();

    // Get user from database
    const User = (await import('@/models/User')).default;
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has billing access
    const hasBillingAccess = user.stripeCustomerId && (
      user.tier === 'premium' || 
      user.tier === 'enterprise' || 
      user.role === 'admin' || 
      user.role === 'ceo'
    );

    if (!hasBillingAccess) {
      return NextResponse.json(
        { error: 'Billing portal access not available for your account type' },
        { status: 403 }
      );
    }

    // Return billing portal access information
    return NextResponse.json({
      canAccess: true,
      hasStripeCustomer: !!user.stripeCustomerId,
      tier: user.tier,
      role: user.role,
    });

  } catch (error) {
    console.error('Billing portal access check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
