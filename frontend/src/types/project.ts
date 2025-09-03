// frontend/src/types/project.ts
import { z } from 'zod';

// Define the schema for a project using Zod for runtime validation.
export const ProjectSchema = z.object({
  // Use a canonical 'id' field. Adapters will handle mapping _id to this.
  id: z.string(),
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  
  // Optional complex properties
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      done: z.boolean().default(false),
    })
  ).optional(),
});

// Infer the TypeScript type from the Zod schema.
export type Project = z.infer<typeof ProjectSchema>;
