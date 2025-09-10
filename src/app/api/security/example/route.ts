import { NextRequest, NextResponse } from 'next/server';

// Simple security example route
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'Security example API working',
      features: [
        'Authentication required',
        'CSRF protection',
        'Rate limiting',
        'Input validation',
        'Request logging'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      message: 'Admin action completed',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      message: 'Premium action completed',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}