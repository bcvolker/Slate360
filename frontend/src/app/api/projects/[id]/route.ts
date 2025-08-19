import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { ObjectId } from 'mongodb';

// Zod schema for project updates
const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters').optional(),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters').optional(),
  type: z.enum(['residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other']).optional(),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']).optional(),
  location: z.object({
    address: z.string().min(1, 'Address is required').optional(),
    city: z.string().min(1, 'City is required').optional(),
    state: z.string().min(1, 'State is required').optional(),
    zipCode: z.string().min(1, 'ZIP code is required').optional(),
    country: z.string().min(1, 'Country is required').optional(),
    coordinates: z.object({
      lat: z.number().min(-90).max(90).optional(),
      lng: z.number().min(-180).max(180).optional(),
    }).optional(),
  }).optional(),
  client: z.object({
    name: z.string().min(1, 'Client name is required').optional(),
    email: z.string().email('Invalid client email').optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
  }).optional(),
  timeline: z.object({
    startDate: z.string().datetime('Invalid start date').optional(),
    endDate: z.string().datetime('Invalid end date').optional(),
    estimatedDuration: z.number().min(1, 'Estimated duration must be at least 1 day').optional(),
  }).optional(),
  budget: z.object({
    estimated: z.number().min(0, 'Estimated budget cannot be negative').optional(),
    actual: z.number().min(0, 'Actual budget cannot be negative').optional(),
    currency: z.string().optional(),
  }).optional(),
  team: z.array(z.object({
    userId: z.string().min(1, 'User ID is required'),
    role: z.enum(['project_manager', 'architect', 'engineer', 'designer', 'contractor', 'consultant']),
    permissions: z.array(z.enum(['read', 'write', 'admin'])).default(['read']),
  })).optional(),
  tags: z.array(z.string().max(50)).max(20, 'Maximum 20 tags allowed').optional(),
  metadata: z.record(z.any()).optional(),
});

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    await connectDB();

    // Find project and check access permissions
    const project = await Project.findById(id)
      .populate('team.userId', 'name email avatar role')
      .populate('createdBy', 'name email')
      .lean();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user has access to this project
    if (!session.user.id || !session.user.role) {
      return NextResponse.json({ error: 'User information incomplete' }, { status: 400 });
    }
    
    const hasAccess = await checkProjectAccess(session.user.id, session.user.role, project);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ project });

  } catch (error) {
    console.error('GET /api/projects/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateProjectSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    await connectDB();

    // Find project and check access permissions
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user has write access to this project
    const hasWriteAccess = await checkProjectWriteAccess(session.user.id!, session.user.role!, project);
    if (!hasWriteAccess) {
      return NextResponse.json({ error: 'Write access denied' }, { status: 403 });
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).populate('team.userId', 'name email avatar role')
     .populate('createdBy', 'name email');

    return NextResponse.json({
      message: 'Project updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error);
    
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { error: 'Project with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    await connectDB();

    // Find project and check access permissions
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user has admin access to this project
    const hasAdminAccess = await checkProjectAdminAccess(session.user.id!, session.user.role!, project);
    if (!hasAdminAccess) {
      return NextResponse.json({ error: 'Admin access required to delete project' }, { status: 403 });
    }

    // Check if project can be deleted (not active or completed)
    if (project.status === 'active' || project.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot delete active or completed projects' },
        { status: 400 }
      );
    }

    // Delete the project
    await Project.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to check if user has access to a project
async function checkProjectAccess(userId: string, userRole: string, project: any): Promise<boolean> {
  // CEO and admin can access all projects
  if (userRole === 'ceo' || userRole === 'admin') {
    return true;
  }

  // Check if user is part of the project team
  const isTeamMember = project.team.some((member: any) => member.userId === userId);
  if (isTeamMember) {
    return true;
  }

  // Check if user created the project
  if (project.createdBy === userId) {
    return true;
  }

  return false;
}

// Helper function to check if user has write access to a project
async function checkProjectWriteAccess(userId: string, userRole: string, project: any): Promise<boolean> {
  // CEO and admin have write access to all projects
  if (userRole === 'ceo' || userRole === 'admin') {
    return true;
  }

  // Check if user has write permissions in the team
  const teamMember = project.team.find((member: any) => member.userId === userId);
  if (teamMember && teamMember.permissions.includes('write')) {
    return true;
  }

  // Check if user created the project
  if (project.createdBy === userId) {
    return true;
  }

  return false;
}

// Helper function to check if user has admin access to a project
async function checkProjectAdminAccess(userId: string, userRole: string, project: any): Promise<boolean> {
  // CEO and admin have admin access to all projects
  if (userRole === 'ceo' || userRole === 'admin') {
    return true;
  }

  // Check if user has admin permissions in the team
  const teamMember = project.team.find((member: any) => member.userId === userId);
  if (teamMember && teamMember.permissions.includes('admin')) {
    return true;
  }

  // Check if user created the project
  if (project.createdBy === userId) {
    return true;
  }

  return false;
}
