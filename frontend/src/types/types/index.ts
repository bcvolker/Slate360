// frontend/src/types/types/index.ts
// Unified type exports - single source of truth for all project-related types

export {
  ProjectSchema,
  ProjectCreateSchema,
  ProjectUpdateSchema,
  TeamMemberSchema,
  LocationSchema,
  ClientSchema,
  TimelineSchema,
  BudgetSchema,
  TaskSchema,
  MilestoneSchema,
  InvoiceSchema,
  validateProject,
  validateProjectUpdate,
  validateProjectCreate
} from './project.schema';

// Export the inferred types
export type Project = import('./project.schema').Project;
export type ProjectCreate = import('./project.schema').ProjectCreate;
export type ProjectUpdate = import('./project.schema').ProjectUpdate;
export type TeamMember = import('./project.schema').TeamMember;
export type Location = import('./project.schema').Location;
export type Client = import('./project.schema').Client;
export type Timeline = import('./project.schema').Timeline;
export type Budget = import('./project.schema').Budget;
export type Task = import('./project.schema').Task;
export type Milestone = import('./project.schema').Milestone;
export type Invoice = import('./project.schema').Invoice;
