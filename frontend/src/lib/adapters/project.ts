// frontend/src/lib/adapters/project.ts
import { toUnifiedStatus } from './status';
import type { UnifiedProject, AnyStatus } from '@/types/unified';

type LooseProject = Partial<UnifiedProject> & { [key: string]: any; };

export function toUnifiedProject(p: Partial<LooseProject>): UnifiedProject {
  const _id = String(p._id ?? p.id ?? 'temp_' + Math.random().toString(36).slice(2, 10));
  return {
    _id,
    id: p.id,
    name: p.name ?? 'Untitled',
    description: p.description,
    imageUrl: p.imageUrl,
    status: toUnifiedStatus(p.status),
    bimModelUrl: p.bimModelUrl,
  };
}
