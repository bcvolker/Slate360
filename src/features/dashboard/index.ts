// src/features/dashboard/index.ts

// This is a legacy shim file.
// Its purpose is to export harmless placeholders to prevent the build from failing
// due to "module not found" errors from old, partially deleted code.
// This allows us to get a stable build before completing the full cleanup.

export const VirtualProjectList = () => null;
export const ProjectAnalytics = () => null;
export const DashboardPage = () => null;
export const ProjectHubPage = () => null; // This will be replaced by the real page
export const useProjects = () => ({ projects: [] });

// Export a default object to satisfy any `import ... from` syntax
export default {
  VirtualProjectList,
  ProjectAnalytics,
  DashboardPage,
  ProjectHubPage,
  useProjects,
};
