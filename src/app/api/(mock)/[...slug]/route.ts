// Catch-all mock: any unimplemented /api/* route returns a friendly placeholder
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET(_: Request, { params }: { params: { slug: string[] } }) {
  return NextResponse.json({ ok: true, route: `/${params.slug.join('/')}`, data: null });
}
export async function POST(_: Request, { params }: { params: { slug: string[] } }) {
  return NextResponse.json({ ok: true, route: `/${params.slug.join('/')}`, id: crypto.randomUUID() });
}
export async function PUT(_: Request, { params }: { params: { slug: string[] } }) {
  return NextResponse.json({ ok: true, route: `/${params.slug.join('/')}`, updated: true });
}
export async function DELETE(_: Request, { params }: { params: { slug: string[] } }) {
  return NextResponse.json({ ok: true, route: `/${params.slug.join('/')}`, deleted: true });
}
