# Dashboard Feature

This feature contains all dashboard-related functionality including project management, analytics, and project hub.

## Structure

```
src/features/dashboard/
├── components/           # Dashboard-specific components
│   ├── VirtualProjectList.tsx
│   └── ProjectAnalytics.tsx
├── hooks/               # Dashboard-specific hooks
│   └── useProjects.ts
├── pages/               # Dashboard pages
│   ├── DashboardPage.tsx
│   └── ProjectHubPage.tsx
├── index.ts             # Main exports
└── README.md            # This file
```

## Components

### VirtualProjectList
Displays a list of projects with selection functionality.
- **Props**: `projects`, `onSelectProject`, `selectedProjectId`
- **Features**: Project selection, visual feedback, task count display

### ProjectAnalytics
Shows detailed analytics for a selected project.
- **Props**: `project`
- **Features**: Project details, task progress, client info, location, team members

## Hooks

### useProjects
Manages project data and operations using the unified Project type.
- **State**: `projects`, `isLoading`, `error`
- **Actions**: `refreshProjects`, `createProject`, `updateProject`, `deleteProject`, `searchProjects`, `filterProjects`, `syncWithOnline`

## Pages

### DashboardPage
Main dashboard view with project list and analytics.
- Uses `useProjects` hook for data management
- Displays `VirtualProjectList` and `ProjectAnalytics` components

### ProjectHubPage
Project hub overview page.
- Shows project management overview cards

## Usage

```typescript
// Import components
import { VirtualProjectList, ProjectAnalytics } from '@/features/dashboard';

// Import hooks
import { useProjects } from '@/features/dashboard';

// Use in component
function MyComponent() {
  const { projects, isLoading, createProject } = useProjects();
  
  return (
    <VirtualProjectList 
      projects={projects} 
      onSelectProject={handleSelect}
    />
  );
}
```

## Data Flow

1. **Service Layer**: `projectService` handles all database operations
2. **Hook Layer**: `useProjects` manages UI state and calls service methods
3. **Component Layer**: Components receive data via props and call hook methods
4. **Type Safety**: All components use the unified `Project` type from `@/types/project.schema`

## Integration

The dashboard feature integrates with:
- **AppShell**: Uses the main application layout
- **Project Service**: Handles data persistence and sync
- **Type System**: Uses unified Project schema for type safety
- **Sync System**: Integrates with online/offline sync capabilities
