import { z } from 'zod';

// Basic sanitization function (in production, use DOMPurify)
const sanitizeString = (input: unknown): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Enhanced Zod schemas with sanitization
export const sanitizedStringSchema = z.string()
  .min(1, 'Field is required')
  .max(1000, 'Field must be less than 1000 characters')
  .transform(sanitizeString);

export const sanitizedEmailSchema = z.string()
  .email('Invalid email format')
  .max(255, 'Email must be less than 255 characters')
  .transform(sanitizeString);

export const sanitizedUrlSchema = z.string()
  .url('Invalid URL format')
  .max(500, 'URL must be less than 500 characters')
  .transform(sanitizeString);

export const sanitizedPhoneSchema = z.string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
  .max(20, 'Phone number must be less than 20 characters')
  .transform(sanitizeString);

// Project-related schemas
export const projectNameSchema = sanitizedStringSchema
  .min(3, 'Project name must be at least 3 characters')
  .max(100, 'Project name must be less than 100 characters');

export const projectDescriptionSchema = sanitizedStringSchema
  .min(10, 'Description must be at least 10 characters')
  .max(2000, 'Description must be less than 2000 characters');

export const projectTypeSchema = z.enum([
  'residential',
  'commercial', 
  'industrial',
  'infrastructure',
  'renovation',
  'other'
]);

export const projectStatusSchema = z.enum([
  'planning',
  'active',
  'on-hold',
  'completed',
  'cancelled'
]);

export const projectPrioritySchema = z.enum([
  'low',
  'medium',
  'high',
  'critical'
]);

// Client schemas
export const clientNameSchema = sanitizedStringSchema
  .min(2, 'Client name must be at least 2 characters')
  .max(100, 'Client name must be less than 100 characters');

export const clientCompanySchema = sanitizedStringSchema
  .max(200, 'Company name must be less than 200 characters')
  .optional();

// Location schemas
export const addressSchema = sanitizedStringSchema
  .min(5, 'Address must be at least 5 characters')
  .max(500, 'Address must be less than 500 characters');

export const citySchema = sanitizedStringSchema
  .min(2, 'City must be at least 2 characters')
  .max(100, 'City must be less than 100 characters');

export const stateSchema = sanitizedStringSchema
  .min(2, 'State must be at least 2 characters')
  .max(100, 'State must be less than 100 characters');

export const zipCodeSchema = z.string()
  .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
  .max(10, 'ZIP code must be less than 10 characters');

// Budget schemas
export const budgetSchema = z.object({
  estimated: z.number()
    .min(0, 'Budget must be non-negative')
    .max(1000000000, 'Budget must be less than 1 billion'),
  actual: z.number()
    .min(0, 'Actual cost must be non-negative')
    .max(1000000000, 'Actual cost must be less than 1 billion')
    .optional(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD']).default('USD')
});

// Timeline schemas
export const timelineSchema = z.object({
  startDate: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    return undefined;
  }, z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start date must be a valid date'
  })),
  endDate: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    return undefined;
  }, z.date({
    invalid_type_error: 'End date must be a valid date'
  })).optional(),
  milestones: z.array(z.object({
    title: sanitizedStringSchema.min(3).max(100),
    date: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
      return undefined;
    }, z.date()),
    description: sanitizedStringSchema.max(500).optional()
  })).optional()
});

// Team schemas
export const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: sanitizedStringSchema.min(2).max(100),
  role: sanitizedStringSchema.min(2).max(100),
  email: sanitizedEmailSchema,
  phone: sanitizedPhoneSchema.optional(),
  hourlyRate: z.number().min(0).max(1000).optional()
});

// Tags schema
export const tagsSchema = z.array(sanitizedStringSchema
  .min(2, 'Tag must be at least 2 characters')
  .max(50, 'Tag must be less than 50 characters')
).max(20, 'Maximum 20 tags allowed');

// Main project schema
export const projectSchema = z.object({
  name: projectNameSchema,
  description: projectDescriptionSchema,
  type: projectTypeSchema,
  status: projectStatusSchema.default('planning'),
  priority: projectPrioritySchema.default('medium'),
  client: z.object({
    name: clientNameSchema,
    email: sanitizedEmailSchema,
    company: clientCompanySchema,
    phone: sanitizedPhoneSchema.optional()
  }),
  location: z.object({
    address: addressSchema,
    city: citySchema,
    state: stateSchema,
    zipCode: zipCodeSchema,
    country: z.string().default('USA')
  }),
  budget: budgetSchema,
  timeline: timelineSchema.optional(),
  team: z.array(teamMemberSchema).optional(),
  tags: tagsSchema.optional(),
  notes: sanitizedStringSchema.max(5000).optional()
});

// Update project schema (all fields optional)
export const projectUpdateSchema = projectSchema.partial();

// Search and filter schemas
export const projectSearchSchema = z.object({
  query: sanitizedStringSchema.max(200).optional(),
  status: projectStatusSchema.optional(),
  type: projectTypeSchema.optional(),
  priority: projectPrioritySchema.optional(),
  client: sanitizedStringSchema.max(200).optional(),
  tags: z.array(sanitizedStringSchema).optional(),
  dateRange: z.object({
    start: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
      return undefined;
    }, z.date().optional()),
    end: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
      return undefined;
    }, z.date().optional())
  }).optional(),
  budgetRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional()
  }).optional()
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'status', 'priority', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Export types
export type Project = z.infer<typeof projectSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export type ProjectSearch = z.infer<typeof projectSearchSchema>;
export type Pagination = z.infer<typeof paginationSchema>;

// Validation helper functions
export const validateProject = (data: unknown): Project => {
  return projectSchema.parse(data);
};

export const validateProjectUpdate = (data: unknown): ProjectUpdate => {
  return projectUpdateSchema.parse(data);
};

export const validateProjectSearch = (data: unknown): ProjectSearch => {
  return projectSearchSchema.parse(data);
};

export const validatePagination = (data: unknown): Pagination => {
  return paginationSchema.parse(data);
};

// Safe validation (returns null on error instead of throwing)
export const safeValidateProject = (data: unknown): Project | null => {
  try {
    return projectSchema.parse(data);
  } catch {
    return null;
  }
};

export const safeValidateProjectUpdate = (data: unknown): ProjectUpdate | null => {
  try {
    return projectUpdateSchema.parse(data);
  } catch {
    return null;
  }
};