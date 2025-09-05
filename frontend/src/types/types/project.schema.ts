import { z } from 'zod';

// Team member schema
export const TeamMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(['project_manager', 'architect', 'engineer', 'designer', 'contractor', 'consultant']),
  permissions: z.array(z.enum(['read', 'write', 'admin'])).default(['read']),
  joinedAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  isActive: z.boolean().default(true),
});

// Location schema
export const LocationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().default('USA'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }).optional(),
});

// Client schema
export const ClientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  company: z.string().optional(),
  contactPerson: z.string().optional(),
  billingAddress: z.string().optional(),
});

// Milestone schema
export const MilestoneSchema = z.object({
  name: z.string().min(1, 'Milestone name is required'),
  date: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  description: z.string().optional(),
  completed: z.boolean().default(false),
});

// Timeline schema
export const TimelineSchema = z.object({
  startDate: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
  endDate: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
  estimatedDuration: z.number().min(1, 'Estimated duration must be at least 1 day').optional(),
  milestones: z.array(MilestoneSchema).default([]),
});

// Budget breakdown schema
export const BudgetBreakdownSchema = z.object({
  materials: z.number().min(0, 'Materials cost cannot be negative').optional(),
  labor: z.number().min(0, 'Labor cost cannot be negative').optional(),
  equipment: z.number().min(0, 'Equipment cost cannot be negative').optional(),
  permits: z.number().min(0, 'Permits cost cannot be negative').optional(),
  contingency: z.number().min(0, 'Contingency cost cannot be negative').optional(),
});

// Invoice schema
export const InvoiceSchema = z.object({
  number: z.string().min(1, 'Invoice number is required'),
  amount: z.number().min(0, 'Invoice amount cannot be negative'),
  date: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  status: z.enum(['pending', 'paid', 'overdue']).default('pending'),
});

// Budget schema
export const BudgetSchema = z.object({
  estimated: z.number().min(0, 'Estimated budget cannot be negative').optional(),
  actual: z.number().min(0, 'Actual budget cannot be negative').optional(),
  currency: z.string().default('USD').transform((val) => val.toUpperCase()),
  breakdown: BudgetBreakdownSchema.optional(),
  invoices: z.array(InvoiceSchema).default([]),
});

// Task schema (for simple task management)
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Task title is required'),
  done: z.boolean().default(false),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Main Project schema - unified structure for online and offline versions
export const ProjectSchema = z.object({
  // Primary identifier
  id: z.string().min(1, 'Project ID is required'),
  
  // Basic project information
  name: z.string().min(1, 'Project name is required').max(100, 'Project name cannot exceed 100 characters'),
  description: z.string().min(1, 'Project description is required').max(500, 'Project description cannot exceed 500 characters'),
  type: z.enum(['residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other']),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled', 'draft', 'archived']).default('draft'),
  
  // Location and client information
  location: LocationSchema,
  client: ClientSchema,
  
  // Timeline and budget
  timeline: TimelineSchema,
  budget: BudgetSchema,
  
  // Team and collaboration
  team: z.array(TeamMemberSchema).default([]),
  
  // Metadata and organization
  tags: z.array(z.string().max(50, 'Tag cannot exceed 50 characters')).max(20, 'Maximum 20 tags allowed').default([]),
  metadata: z.record(z.any()).default({}),
  
  // Ownership and timestamps
  createdBy: z.string(),
  createdAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  updatedAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  
  // Simple task management (for offline compatibility)
  tasks: z.array(TaskSchema).default([]),
  
  // Sync and offline status
  isOffline: z.boolean().default(false),
  lastSynced: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
  syncStatus: z.enum(['synced', 'pending', 'conflict', 'error']).default('synced'),
  version: z.number().default(1),
}).refine((data) => {
  // Validate timeline dates
  if (data.timeline.startDate && data.timeline.endDate) {
    return data.timeline.startDate < data.timeline.endDate;
  }
  return true;
}, {
  message: 'Start date must be before end date',
  path: ['timeline'],
}).refine((data) => {
  // Validate budget values
  if (data.budget.actual !== undefined && data.budget.estimated !== undefined) {
    return data.budget.actual >= 0 && data.budget.estimated >= 0;
  }
  return true;
}, {
  message: 'Budget values cannot be negative',
  path: ['budget'],
});

// Inferred TypeScript type
export type Project = z.infer<typeof ProjectSchema>;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Client = z.infer<typeof ClientSchema>;
export type Timeline = z.infer<typeof TimelineSchema>;
export type Budget = z.infer<typeof BudgetSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Milestone = z.infer<typeof MilestoneSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;

// Partial schemas for updates
export const ProjectUpdateSchema = ProjectSchema.partial().omit({ id: true, createdAt: true });
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;

// Create schema (without id and timestamps)
export const ProjectCreateSchema = ProjectSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  lastSynced: true,
  syncStatus: true,
  version: true
});
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;

// Validation functions
export const validateProject = (data: unknown): Project => {
  return ProjectSchema.parse(data);
};

export const validateProjectUpdate = (data: unknown): ProjectUpdate => {
  return ProjectUpdateSchema.parse(data);
};

export const validateProjectCreate = (data: unknown): ProjectCreate => {
  return ProjectCreateSchema.parse(data);
};
