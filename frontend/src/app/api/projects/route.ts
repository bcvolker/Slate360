import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Placeholder for authentication logic
    const session = { user: { id: 'placeholder_user_id', email: 'user@example.com' } };

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return placeholder project data
    const project = {
      id: 'placeholder_project_id',
      supabaseUserId: session.user.id,
      name: `${session.user.email?.split('@')[0]}'s Project`,
      tasks: [],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(project);
  } catch (err: any) {
    console.error('Projects fetch error:', err.message);
    return NextResponse.json({ error: 'Server error while fetching project data.' }, { status: 500 });
  }
}
