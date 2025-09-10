# App Shell Directory

This directory contains the core application shell components and layout structure. The app shell provides the foundational UI framework that wraps around feature-specific content.

## Purpose

The app shell is responsible for:
- Main application layout
- Navigation structure
- Header and footer components
- Sidebar/navigation menu
- Global UI state management
- Authentication wrapper
- Error boundaries

## Structure

```
src/app-shell/
├── components/         # Shell-specific components (Header, Sidebar, etc.)
├── layout/            # Layout components and templates
├── providers/         # Context providers for global state
├── hooks/             # Shell-specific hooks
└── README.md          # This file
```

## Components

### Core Shell Components
- **AppShell**: Main shell wrapper component
- **Header**: Application header with navigation
- **Sidebar**: Main navigation sidebar
- **Footer**: Application footer
- **Navigation**: Navigation menu components
- **Breadcrumbs**: Breadcrumb navigation

### Layout Components
- **MainLayout**: Primary layout template
- **DashboardLayout**: Dashboard-specific layout
- **AuthLayout**: Authentication pages layout

### Providers
- **AppProvider**: Main application context
- **ThemeProvider**: Theme management
- **NavigationProvider**: Navigation state management

## Usage

The app shell should be used as the top-level wrapper in your application:

```typescript
// In your main App component
import { AppShell } from '@/app-shell/components/AppShell';

function App() {
  return (
    <AppShell>
      {/* Your feature components go here */}
    </AppShell>
  );
}
```

## Best Practices

1. **Consistent Layout**: Maintain consistent layout across all pages
2. **Responsive Design**: Ensure shell components work on all screen sizes
3. **Performance**: Optimize shell components for fast rendering
4. **Accessibility**: Follow accessibility best practices
5. **Theme Support**: Support light/dark theme switching
