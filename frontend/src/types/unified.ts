// frontend/src/types/unified.ts
export type UnifiedStatus =
  | 'active'
  | 'planning'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'draft';

export type LegacyStatus = 'In Progress' | 'Completed' | 'On Hold';

export type AnyStatus = UnifiedStatus | LegacyStatus;

export interface UnifiedProject {
  _id: string;          // canonical id for unified
  id?: string;          // optional legacy field for compatibility
  name: string;
  description?: string;
  imageUrl?: string;
  status?: UnifiedStatus;
  bimModelUrl?: string;
}
