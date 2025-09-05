# Features Directory

This directory organizes components and functionality by feature/domain. Each feature should be self-contained with its own components, hooks, utilities, and types.

## Structure

```
src/features/
├── dashboard/          # Dashboard-related components and logic
├── security/           # Security-related components and logic
├── projects/           # Project management components and logic
└── README.md           # This file
```

## Feature Organization Guidelines

Each feature directory should follow this structure:

```
feature-name/
├── components/         # Feature-specific components
├── hooks/             # Feature-specific hooks
├── services/          # Feature-specific services
├── types/             # Feature-specific types
├── utils/             # Feature-specific utilities
└── index.ts           # Main export file for the feature
```

## Best Practices

1. **Self-contained**: Each feature should be as self-contained as possible
2. **Clear boundaries**: Features should have clear, well-defined boundaries
3. **Shared code**: Common utilities should be moved to `src/services` or `src/types`
4. **Consistent naming**: Use consistent naming conventions across features
5. **Documentation**: Each feature should have its own README if complex

## Example Feature Structure

```typescript
// src/features/dashboard/index.ts
export { Dashboard } from './components/Dashboard';
export { useDashboardData } from './hooks/useDashboardData';
export { DashboardService } from './services/DashboardService';
export type { DashboardConfig } from './types/DashboardConfig';
```
