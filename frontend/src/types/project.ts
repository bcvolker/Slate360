// frontend/src/types/project.ts
import { z } from 'zod';

// This Zod schema is the single, canonical definition for a project's structure.
// It provides runtime validation, making the application far more robust.
export const ProjectSchema = z.object({
  // The 'id' will be the standardized identifier. Adapters will handle conversion.
  id: z.string(),
  name: z.string().min(1, { message: "Project name cannot be empty" }),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      done: z.boolean().default(false),
    })
  ).optional(),
});

// This is the only Project type that should be imported across the entire application.
export type Project = z.infer<typeof ProjectSchema>;
