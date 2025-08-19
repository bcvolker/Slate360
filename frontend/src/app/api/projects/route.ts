import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { requireRole } from '@/middleware/requireRole';

// Zod schemas for validation
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  type: z.enum(['residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other']),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']).default('planning'),
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required').default('USA'),
    coordinates: z.object({
      lat: z.number().min(-90).max(90).optional(),
      lng: z.number().min(-180).max(180).optional(),
    }).optional(),
  }),
  client: z.object({
    name: z.string().min(1, 'Client name is required'),
    email: z.string().email('Invalid client email'),
    phone: z.string().optional(),
    company: z.string().optional(),
  }),
  timeline: z.object({
    startDate: z.string().datetime('Invalid start date').optional(),
    endDate: z.string().datetime('Invalid end date').optional(),
    estimatedDuration: z.number().min(1, 'Estimated duration must be at least 1 day').optional(),
  }),
  budget: z.object({
    estimated: z.number().min(0, 'Estimated budget cannot be negative').optional(),
    actual: z.number().min(0, 'Actual budget cannot be negative').optional(),
    currency: z.string().default('USD'),
  }),
  team: z.array(z.object({
    userId: z.string().min(1, 'User ID is required'),
    role: z.enum(['project_manager', 'architect', 'engineer', 'designer', 'contractor', 'consultant']),
    permissions: z.array(z.enum(['read', 'write', 'admin'])).default(['read']),
  })).optional(),
  tags: z.array(z.string().max(50)).max(20, 'Maximum 20 tags allowed').optional(),
  metadata: z.record(z.any()).optional(),
});

const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().min(1, 'Project ID is required'),
});

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('20'),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']).optional(),
  type: z.enum(['residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other']).optional(),
  client: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'startDate', 'endDate', 'budget']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// GET /api/projects - List projects with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryResult = querySchema.safeParse(Object.fromEntries(searchParams));
    
    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.errors },
        { status: 400 }
      );
    }

    const { page, limit, status, type, client, search, sortBy, sortOrder } = queryResult.data;

    await connectDB();

    // Build filter query
    const filter: any = {};
    
    // Filter by user's access level
    if (session.user.role === 'ceo' || session.user.role === 'admin') {
      // CEO and admin can see all projects
    } else if (session.user.role === 'manager') {
      // Managers can see projects they manage or are part of
      filter.$or = [
        { 'team.userId': session.user.id },
        { createdBy: session.user.id }
      ];
    } else {
      // Regular users can only see projects they're part of
      filter['team.userId'] = session.user.id;
    }

    // Apply additional filters
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (client) filter['client.name'] = { $regex: client, $options: 'i' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'client.name': { $regex: search, $options: 'i' } },
        { 'client.company': { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('team.userId', 'name email avatar')
        .populate('createdBy', 'name email')
        .lean(),
      Project.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        status,
        type,
        client,
        search,
        sortBy,
        sortOrder,
      }
    });

  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createProjectSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const projectData = validationResult.data;

    await connectDB();

    // Check if user has permission to create projects
    if (!session.user.id || !session.user.tier) {
      return NextResponse.json({ error: 'User information incomplete' }, { status: 400 });
    }
    
    const canCreate = await checkProjectCreationPermission(session.user.id, session.user.tier);
    if (!canCreate) {
      return NextResponse.json(
        { error: 'Project creation limit reached for your tier' },
        { status: 403 }
      );
    }

    // Create the project
    const project = new Project({
      ...projectData,
      createdBy: session.user.id,
      team: projectData.team || [{
        userId: session.user.id,
        role: 'project_manager',
        permissions: ['read', 'write', 'admin']
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await project.save();

    // Populate references for response
    await project.populate('team.userId', 'name email avatar');
    await project.populate('createdBy', 'name email');

    return NextResponse.json(
      { 
        message: 'Project created successfully',
        project 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/projects error:', error);
    
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

// Helper function to check project creation permissions based on user tier
async function checkProjectCreationPermission(userId: string, userTier: string): Promise<boolean> {
  try {
    const projectCount = await Project.countDocuments({ createdBy: userId });
    
    const tierLimits = {
      'free': 3,
      'premium': 25,
      'enterprise': -1 // Unlimited
    };

    const limit = tierLimits[userTier as keyof typeof tierLimits] || 3;
    
    if (limit === -1) return true; // Unlimited
    return projectCount < limit;
    
  } catch (error) {
    console.error('Error checking project creation permission:', error);
    return false;
  }
}
