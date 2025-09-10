// src/lib/schemas.ts
import { z } from 'zod';

export const ProjectSchema = z.object({
  _id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters long."),
  description: z.string().optional(),
  status: z.enum(['In Progress', 'Completed', 'On Hold']),
  imageUrl: z.string().url().optional(),
  bimModelUrl: z.string().url().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
