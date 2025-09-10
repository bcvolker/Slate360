import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET() {
  // Minimal shape to keep dashboards happy
  return NextResponse.json({ projects: [] });
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const now = new Date().toISOString();
  return NextResponse.json({
    project: { id: crypto.randomUUID(), name: body?.name || 'Untitled', createdAt: now, updatedAt: now }
  });
}
