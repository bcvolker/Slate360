import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET() {
  return NextResponse.json({
    user: { id: 'demo-user', name: 'Demo User', email: 'demo@slate360.ai', role: 'admin' }
  });
}
