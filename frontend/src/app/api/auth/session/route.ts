// Minimal "looks like I'm logged in" session for preview UIs that ping /api/auth/session
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET() {
  const far = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
  return NextResponse.json({
    user: { id: 'demo-user', name: 'Demo User', email: 'demo@slate360.ai' },
    expires: far
  });
}
