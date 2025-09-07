# SLATE360 Project: Critical Architectural Issues Requiring Systematic Resolution

## Project Context
I have a Next.js 14 TypeScript project called SLATE360 that has been through multiple refactoring attempts but continues to fail builds due to cascading TypeScript errors. The project is a construction management platform with complex data models, multiple data sources (MongoDB, IndexedDB), and various UI components.

## Core Problem Statement
The project suffers from **type fragmentation** and **architectural inconsistency** that creates a cascade of TypeScript errors. Each individual fix reveals new errors, creating an endless cycle of reactive debugging rather than proactive architectural solutions.

## Specific Structural Issues Identified

### 1. Type System Fragmentation
- **Multiple conflicting Project type definitions** across different files:
  - `frontend/src/types/types/index.ts` (legacy complex type)
  - `frontend/src/types/project.ts` (new simplified Zod-based type)
  - `frontend/src/models/Project.ts` (Mongoose model)
  - Various component-specific interfaces
- **Inconsistent data models** between MongoDB documents, IndexedDB records, API responses, and UI components
- **Missing type adapters** to convert between different data formats

### 2. Data Layer Architecture Problems
- **No clear data flow** between MongoDB, IndexedDB, and API layers
- **Inconsistent ID handling** (`_id` vs `id` across different systems)
- **Missing data validation** at boundaries between layers
- **Circular dependencies** between data models and components

### 3. Component Architecture Issues
- **Tight coupling** between components and specific data formats
- **Missing abstraction layers** for data operations
- **Inconsistent error handling** across the application
- **No clear separation** between business logic and presentation

### 4. Build System Problems
- **TypeScript configuration conflicts** between different parts of the project
- **Next.js build process** including files that should be excluded
- **Missing dependency management** for type definitions
- **Inconsistent import/export patterns**

## Current Error Patterns Observed

### Type Mismatch Errors
```
Type '{ id: string; name: string; status: "active" | "draft" | "archived"; ... }' 
is not assignable to type '{ id: string; name: string; description: string; type: "residential" | "commercial" | ... }'
```

### Missing Export Errors
```
Module '"../db/indexedDB"' has no exported member 'OfflineProject'
```

### Import Resolution Errors
```
Attempted import error: 'Providers' is not exported from '@/app-shell/Providers'
```

### Build Configuration Errors
```
Property 'header' does not exist on type 'IntrinsicAttributes & SimpleAppShellProps'
```

## What I Need: A Systematic Architectural Solution

### Required Approach
I need a **top-down architectural refactor** that addresses the root causes, not individual symptoms. The solution should:

1. **Establish a single source of truth** for all data types
2. **Create clear data flow patterns** with proper abstraction layers
3. **Implement consistent error handling** across all layers
4. **Provide a migration strategy** from the current fragmented state
5. **Ensure build stability** with proper TypeScript configuration

### Specific Deliverables Needed

#### 1. Unified Type System Design
- Single, canonical Project type definition using Zod for runtime validation
- Clear interfaces for all data transformations
- Proper type guards and validation functions
- Migration utilities to convert existing data

#### 2. Data Layer Architecture
- Clear separation between data sources (MongoDB, IndexedDB, API)
- Consistent data adapters for all transformations
- Proper error handling and fallback mechanisms
- Clear data flow documentation

#### 3. Component Architecture
- Proper abstraction layers between data and UI
- Consistent prop interfaces across components
- Proper error boundaries and loading states
- Clear separation of concerns

#### 4. Build Configuration
- Proper TypeScript configuration that excludes problematic files
- Consistent import/export patterns
- Proper Next.js configuration for the project structure
- Clear build process documentation

### Success Criteria
The solution should result in:
- **Zero TypeScript errors** in production build
- **Consistent data handling** across all components
- **Maintainable codebase** with clear patterns
- **Successful Vercel deployment** without build failures
- **Documentation** explaining the new architecture

### Current Project Structure
```
frontend/src/
├── app/                    # Next.js app router
├── components/            # React components
├── lib/                   # Utilities and services
│   ├── adapters/         # Data transformation layer
│   ├── db/               # Database connections
│   └── sync/              # Data synchronization
├── types/                 # Type definitions
├── hooks/                 # React hooks
└── models/                # Data models
```

### Technology Stack
- Next.js 14 with App Router
- TypeScript 5.4
- MongoDB with Mongoose
- IndexedDB with Dexie
- Zod for validation
- Tailwind CSS for styling

## Request for Gemini
Please provide a **comprehensive architectural solution** that addresses these structural issues systematically. I need:

1. **A detailed refactoring plan** with specific steps
2. **Code examples** for the new architecture
3. **Migration strategy** from current state
4. **Configuration files** (tsconfig.json, next.config.mjs, etc.)
5. **Clear documentation** of the new patterns

The solution should be **executable as a single operation** that transforms the project from its current fragmented state to a clean, maintainable architecture that builds successfully.

Please focus on **architectural patterns** and **systematic solutions** rather than individual error fixes.
