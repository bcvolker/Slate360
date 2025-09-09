// frontend/src/lib/adapters/status.ts
import type { LegacyStatus, UnifiedStatus, AnyStatus } from '@/types/unified';

const legacyToUnifiedMap: Record<LegacyStatus, UnifiedStatus> = {
  'In Progress': 'active',
  'On Hold': 'on-hold',
  'Completed': 'completed',
};

export function toUnifiedStatus(s?: AnyStatus): UnifiedStatus | undefined {
  if (!s) return undefined;
  if (['active', 'planning', 'on-hold', 'completed', 'cancelled', 'draft'].includes(s)) {
    return s as UnifiedStatus;
  }
  return legacyToUnifiedMap[s as LegacyStatus] ?? 'active';
}
