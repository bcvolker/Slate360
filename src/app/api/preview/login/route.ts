import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET() {
  const res = NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  // Set a cookie your guards can look for (adjust name if you already have a guard)
  res.headers.append('Set-Cookie', `previewLoggedIn=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
  return res;
}
