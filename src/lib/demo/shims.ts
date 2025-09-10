// frontend/src/lib/demo/shims.ts
import { toUnifiedProject } from '@/lib/adapters/project';
import type { UnifiedProject } from '@/types/unified';
import { simulateProjectCreation } from '@/lib/demo/demoData';

export async function createDemoProjectCompat(data: Partial<any>): Promise<ReturnType<typeof simulateProjectCreation>> {
  const unifiedData: Partial<UnifiedProject> = toUnifiedProject(data);
  return simulateProjectCreation(unifiedData);
}
