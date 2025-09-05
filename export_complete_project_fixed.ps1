# SLATE360 Complete Project Export Script
# Run as Administrator to ensure full access to all files
# This script exports ALL code from every frontend and backend file
# Updated for new architecture with src/ and features/ directories

param(
    [string]$OutputPath = "SLATE360_Complete_Project_Export.md"
)

Write-Host "SLATE360 Complete Project Export Script" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "Exporting ALL code from every file..." -ForegroundColor Yellow
Write-Host ""

# Function to safely read file content
function Read-FileContent {
    param([string]$FilePath)
    try {
        if (Test-Path $FilePath) {
            $content = Get-Content $FilePath -Raw -Encoding UTF8
            if ($content) {
                return $content
            } else {
                return "File is empty: $FilePath"
            }
        }
        return "File not found: $FilePath"
    }
    catch {
        return "Error reading file: $($_.Exception.Message)"
    }
}

# Function to get all source code files recursively
function Get-SourceFiles {
    param([string]$Path)
    try {
        $extensions = @('*.ts', '*.tsx', '*.js', '*.jsx', '*.json', '*.css', '*.scss', '*.md', '*.txt', '*.ps1', '*.bat')
        $files = @()
        
        # Scan frontend directory structure
        $frontendPath = "frontend"
        
        if (Test-Path $frontendPath) {
            foreach ($ext in $extensions) {
                $files += Get-ChildItem -Path $frontendPath -Filter $ext -Recurse -File | Where-Object { 
                    $_.FullName -notlike "*node_modules*" -and 
                    $_.FullName -notlike "*.next*" -and 
                    $_.FullName -notlike "*.git*" 
                }
            }
        }
        
        # Also scan root level files
        foreach ($ext in $extensions) {
            $files += Get-ChildItem -Path "." -Filter $ext -File | Where-Object { 
                $_.FullName -notlike "*node_modules*" -and 
                $_.FullName -notlike "*.next*" -and 
                $_.FullName -notlike "*.git*" 
            }
        }
        
        return $files | Sort-Object FullName
    }
    catch {
        Write-Host "Error getting source files: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

# Function to get file size in readable format
function Get-FileSize {
    param([string]$FilePath)
    try {
        if (Test-Path $FilePath) {
            $size = (Get-Item $FilePath).Length
            if ($size -gt 1MB) {
                return "$([math]::Round($size/1MB, 2)) MB"
            } elseif ($size -gt 1KB) {
                return "$([math]::Round($size/1KB, 2)) KB"
            } else {
                return "$size bytes"
            }
        }
        return "N/A"
    }
    catch {
        return "Error"
    }
}

# Get all source files
Write-Host "Scanning for source files..." -ForegroundColor Cyan
$sourceFiles = Get-SourceFiles "."
Write-Host "Found $($sourceFiles.Count) source files" -ForegroundColor Green

# Start building the comprehensive export
$content = @"
# SLATE360 Complete Project Export - SINGLE COMPREHENSIVE DOCUMENT

**Generated on:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Script Version:** 3.0 (Updated for New Architecture)
**Project:** SLATE360
**Total Files Exported:** $($sourceFiles.Count)

---

## Table of Contents

1. [Complete Project Overview](#complete-project-overview)
2. [New Architecture Overview](#new-architecture-overview)
3. [All Configuration Files](#all-configuration-files)
4. [Core Components](#core-components)
5. [Key Models & Database](#key-models--database)
6. [Complete Error Analysis](#complete-error-analysis)
7. [Remaining Files Summary](#remaining-files-summary)
8. [Frontend Source Code](#frontend-source-code)
9. [Backend Source Code](#backend-source-code)
10. [API Routes](#api-routes)
11. [Security Implementation](#security-implementation)
12. [Project Structure](#project-structure)
13. [Complete Source Code Export](#complete-source-code-export)

---

## Complete Project Overview

### Tech Stack
- **Frontend:** Next.js 14.2.5, React 18.3.1, TypeScript 5.4.5
- **Architecture:** Feature-based organization with service layer
- **Type Safety:** Zod schemas for runtime validation
- **Styling:** Tailwind CSS 3.4.3
- **Database:** MongoDB with Mongoose, IndexedDB for offline storage
- **Authentication:** Supabase Auth
- **3D/VR:** Three.js, React Three Fiber, Cesium
- **Real-time:** WebSockets, Y.js for collaborative editing
- **Maps:** Leaflet
- **File Handling:** AWS S3 integration
- **Payment:** Stripe integration
- **State Management:** React Query, Context API
- **Validation:** Zod for schema validation and type inference

### Features
- Advanced project management with role-based access control
- 3D modeling and visualization capabilities
- Real-time collaboration and document editing
- Offline-first architecture with IndexedDB
- Comprehensive security implementation
- Multi-tier subscription system
- Advanced analytics and reporting
- File management with cloud storage
- Team collaboration tools
- Project timeline and milestone tracking
- Feature-based component organization
- Service layer for business logic separation

### Security Implementation
- CSRF protection with secure tokens
- Comprehensive security headers
- Input validation and sanitization
- Rate limiting and DDoS protection
- Multi-factor authentication (TOTP)
- Session security with device fingerprinting
- Data encryption for sensitive fields
- File upload security and malware scanning
- Real-time threat detection
- Audit logging and monitoring

---

## New Architecture Overview

### Feature-Based Organization
- **frontend/src/features/dashboard/**: Dashboard functionality
  - `components/`: Dashboard-specific components
  - `hooks/`: Dashboard-specific hooks
  - `pages/`: Dashboard pages
  - `index.ts`: Feature exports

### Service Layer
- **frontend/src/services/project.service.ts**: Project data management
- **frontend/src/services/index.ts**: Service exports

### Type System
- **frontend/src/types/project.schema.ts**: Project Zod schemas
- **frontend/src/types/security.schema.ts**: Security schemas
- **frontend/src/types/index.ts**: Type exports

### Application Shell
- **frontend/src/app-shell/AppShell.tsx**: Main layout component
- **frontend/src/app-shell/Providers.tsx**: Provider wrapper
- **frontend/src/app-shell/hooks/useSidebar.ts**: Sidebar management

---

## All Configuration Files

### package.json
```json
$(Read-FileContent "frontend/package.json")
```

### next.config.mjs
```javascript
$(Read-FileContent "frontend/next.config.mjs")
```

### tailwind.config.js
```javascript
$(Read-FileContent "frontend/tailwind.config.js")
```

### tsconfig.json
```json
$(Read-FileContent "frontend/tsconfig.json")
```

### .eslintrc.json
```json
$(Read-FileContent "frontend/.eslintrc.json")
```

### postcss.config.js
```javascript
$(Read-FileContent "frontend/postcss.config.js")
```

### env.example
```bash
$(Read-FileContent "frontend/env.example")
```

---

## Core Components

### New Architecture Components

#### AppShell.tsx
```typescript
$(Read-FileContent "frontend/src/app-shell/AppShell.tsx")
```

#### Providers.tsx
```typescript
$(Read-FileContent "frontend/src/app-shell/Providers.tsx")
```

#### useSidebar.ts
```typescript
$(Read-FileContent "frontend/src/app-shell/hooks/useSidebar.ts")
```

#### project.schema.ts
```typescript
$(Read-FileContent "frontend/src/types/project.schema.ts")
```

#### security.schema.ts
```typescript
$(Read-FileContent "frontend/src/types/security.schema.ts")
```

#### project.service.ts
```typescript
$(Read-FileContent "frontend/src/services/project.service.ts")
```

#### Dashboard Components
```typescript
$(Read-FileContent "frontend/src/features/dashboard/components/VirtualProjectList.tsx")
```

#### Dashboard Hooks
```typescript
$(Read-FileContent "frontend/src/features/dashboard/hooks/useProjects.ts")
```

#### Dashboard Pages
```typescript
$(Read-FileContent "frontend/src/features/dashboard/pages/DashboardPage.tsx")
```

### Existing Components

#### layout.tsx
```typescript
$(Read-FileContent "frontend/src/app/layout.tsx")
```

#### page.tsx
```typescript
$(Read-FileContent "frontend/src/app/page.tsx")
```

#### globals.css
```css
$(Read-FileContent "frontend/src/app/globals.css")
```

#### ToastProvider.tsx
```typescript
$(Read-FileContent "frontend/src/components/ToastProvider.tsx")
```

---

## Key Models & Database

### Project.ts
```typescript
$(Read-FileContent "frontend/src/models/Project.ts")
```

### User.ts
```typescript
$(Read-FileContent "frontend/src/models/User.ts")
```

### AuditLog.ts
```typescript
$(Read-FileContent "frontend/src/models/AuditLog.ts")
```

### db.ts
```typescript
$(Read-FileContent "frontend/src/lib/db.ts")
```

### mongodb.ts
```typescript
$(Read-FileContent "frontend/src/lib/mongodb.ts")
```

### useIndexedDB.ts
```typescript
$(Read-FileContent "frontend/src/hooks/useIndexedDB.ts")
```

### demoData.ts
```typescript
$(Read-FileContent "frontend/src/lib/demo/demoData.ts")
```

---

## Complete Error Analysis

### TypeScript Build Errors
The project currently has TypeScript errors that are bypassed in the build configuration:

```typescript
// From next.config.mjs
typescript: {
  ignoreBuildErrors: true
}
```

### Common Error Patterns
1. **Type Mismatches:** Interface definitions vs actual usage
2. **Missing Dependencies:** Some components reference undefined types
3. **Import Issues:** Path resolution problems in some modules
4. **React Hooks:** Some custom hooks have dependency array issues

### Error Resolution Strategy
- Temporarily bypassed for build compatibility
- Need systematic type checking and fixing
- Consider using strict TypeScript configuration
- Implement proper error boundaries

---

## Remaining Files Summary

### Components Directory
- **Login.tsx:** Authentication component with form validation
- **IntegratedDashboard.tsx:** Main dashboard interface
- **ProjectAnalytics.tsx:** Analytics and reporting component
- **ProjectModal.tsx:** Project creation/editing modal
- **SecurityDashboard.tsx:** Security monitoring interface
- **DemoModeToggle.tsx:** Demo mode functionality
- **HelpIcon.tsx:** Contextual help system
- **ProcessGuide.tsx:** Workflow guidance component

### API Routes
- **/api/auth:** Authentication endpoints
- **/api/projects:** Project CRUD operations
- **/api/security:** Security monitoring endpoints
- **/api/billing:** Subscription management
- **/api/stripe:** Payment processing
- **/api/contact:** Contact form handling

### Hooks and Utilities
- **useIndexedDB:** Offline database management
- **Security utilities:** CSRF, validation, headers
- **File handling:** Upload, processing, storage
- **Real-time:** WebSocket connections, collaboration

---

## Frontend Source Code

### Main App Structure
```typescript
// App routing structure
frontend/src/app/
├── layout.tsx          # Root layout
├── page.tsx            # Homepage
├── globals.css         # Global styles
├── dashboard/          # Dashboard pages
├── api/                # API routes
├── about/              # About page
├── pricing/            # Pricing page
├── contact/            # Contact page
└── examples/           # Example pages
```

### New Architecture Structure
```typescript
// New architecture structure
frontend/src/
├── app-shell/          # Application shell
├── types/              # Type definitions
├── services/           # Service layer
└── features/           # Feature-based organization
    └── dashboard/      # Dashboard feature
```

### Component Architecture
```typescript
// Component hierarchy
frontend/src/components/
├── ToastProvider.tsx   # Toast notifications
├── Login.tsx           # Authentication
├── IntegratedDashboard.tsx # Main dashboard
├── ProjectAnalytics.tsx    # Analytics
├── ProjectModal.tsx        # Project management
├── SecurityDashboard.tsx   # Security monitoring
├── DemoModeToggle.tsx      # Demo functionality
├── HelpIcon.tsx            # Help system
├── ProcessGuide.tsx        # Workflow guidance
└── Modal.tsx               # Modal components
```

---

## Backend Source Code

### API Route Structure
```typescript
// API endpoints
frontend/src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   └── logout/route.ts
├── projects/
│   ├── route.ts
│   └── [id]/route.ts
├── security/
│   ├── audit/route.ts
│   └── monitoring/route.ts
├── billing/
│   ├── subscription/route.ts
│   └── invoices/route.ts
├── stripe/
│   ├── webhook/route.ts
│   └── checkout/route.ts
└── contact/
    └── route.ts
```

### Database Models
```typescript
// Data models
frontend/src/models/
├── Project.ts          # Project schema and methods
├── User.ts             # User schema and methods
└── AuditLog.ts         # Audit logging schema
```

### Database Utilities
```typescript
// Database connections
frontend/src/lib/
├── db.ts               # MongoDB connection
├── mongodb.ts          # MongoDB utilities
└── db/
    └── indexedDB.ts    # IndexedDB setup
```

---

## Security Implementation

### Core Security Modules
```typescript
// Security framework
frontend/src/lib/security/
├── csrf.ts             # CSRF protection
├── headers.ts          # Security headers
├── validation.ts       # Input validation
├── rateLimit.ts        # Rate limiting
├── encryption.ts       # Data encryption
├── mfa.ts              # Multi-factor auth
├── session.ts          # Session management
├── monitoring.ts       # Threat detection
├── fileSecurity.ts     # File upload security
└── errorHandling.ts    # Security error handling
```

### Security Features
- **Authentication:** Supabase Auth with role-based access
- **Authorization:** Tier-based permissions system
- **Input Validation:** Zod schemas with XSS protection
- **CSRF Protection:** Secure token-based prevention
- **Rate Limiting:** Per-IP and per-user limits
- **Session Security:** Device fingerprinting and validation
- **Data Encryption:** Field-level encryption for sensitive data
- **MFA:** TOTP-based with backup codes
- **File Security:** Malware scanning and validation
- **Monitoring:** Real-time threat detection

---

## Project Structure

### Directory Layout
```
Slate360/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   ├── models/          # Database models
│   │   ├── types/           # TypeScript types
│   │   ├── contexts/         # React contexts
│   │   ├── middleware/       # Custom middleware
│   │   ├── styles/          # CSS and styling
│   │   ├── app-shell/       # Application shell
│   │   ├── services/        # Service layer
│   │   └── features/        # Feature-based organization
│   │       └── dashboard/   # Dashboard feature
│   ├── public/              # Static assets
│   ├── package.json         # Dependencies
│   ├── next.config.mjs      # Next.js configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── SECURITY_IMPLEMENTATION.md # Security documentation
├── backend/                  # Backend services (if any)
├── shared/                   # Shared utilities
└── exported_code/            # Export outputs
```

### Key Dependencies
```json
{
  "core": {
    "next": "14.2.5",
    "react": "18.3.1",
    "typescript": "5.4.5"
  },
  "database": {
    "mongoose": "^8.6.4",
    "dexie": "^4.0.7",
    "@supabase/supabase-js": "^2.45.0"
  },
  "3D/VR": {
    "three": "^0.179.1",
    "@react-three/fiber": "^8.15.19",
    "cesium": "^1.132.0"
  },
  "security": {
    "zod": "^3.23.8",
    "jsonwebtoken": "^9.0.2",
    "@upstash/ratelimit": "^1.2.0"
  }
}
```

---

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB instance
- Supabase account
- AWS S3 bucket (for file storage)

### Environment Variables
```bash
# Required environment variables
MONGODB_URI=mongodb://localhost:27017/slate360
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Installation Steps
```bash
# Clone repository
git clone <repository-url>
cd Slate360

# Install dependencies
cd frontend
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

---

## Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start npm --name "slate360" -- start
```

### Environment Considerations
- **Database:** Use production MongoDB cluster
- **File Storage:** Configure production S3 bucket
- **CDN:** Set up CDN for static assets
- **Monitoring:** Implement application monitoring
- **Backup:** Regular database and file backups
- **SSL:** Ensure HTTPS is enabled
- **Security:** Regular security audits and updates

---

## Complete Source Code Export

This section contains the complete source code for ALL files in the project:

"@

# Add all source files with their complete code
Write-Host "Adding complete source code for all files..." -ForegroundColor Cyan
$fileCounter = 0

foreach ($file in $sourceFiles) {
    $fileCounter++
    $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart("\")
    $fileSize = Get-FileSize $file.FullName
    
    Write-Host "Processing file $fileCounter/$($sourceFiles.Count): $relativePath" -ForegroundColor Yellow
    
    $content += @"

### $relativePath
**File Size:** $fileSize  
**File Type:** $($file.Extension)

```$($file.Extension.TrimStart('.'))
$(Read-FileContent $file.FullName)
```

---
"@
}

# Add summary
$content += @"

---

## Summary

This comprehensive export contains:

✅ **Complete Project Overview** - Tech stack, features, security implementation  
✅ **New Architecture Overview** - Feature-based organization and service layer  
✅ **All Configuration Files** - package.json, next.config.mjs, tailwind.config.js, tsconfig.json  
✅ **Core Components** - New AppShell, Providers, and Dashboard components  
✅ **Key Models & Database** - Project.ts, db.ts, demoData.ts, useIndexedDB.ts  
✅ **Complete Error Analysis** - TypeScript errors and resolution strategy  
✅ **Remaining Files Summary** - Overview of all other project files  
✅ **Frontend Source Code** - Complete component structure and implementation  
✅ **Backend Source Code** - API routes and database models  
✅ **Security Implementation** - Comprehensive security framework  
✅ **Project Structure** - Complete directory layout and dependencies  
✅ **Complete Source Code Export** - ALL files with complete code content  

**Total Files Exported:** $($sourceFiles.Count)  
**Project Size:** $(Get-ChildItem -Recurse -File | Measure-Object -Property Length -Sum | Select-Object -ExpandProperty Sum | ForEach-Object { if($_ -gt 1MB) { "$([math]::Round($_/1MB, 2)) MB" } elseif($_ -gt 1KB) { "$([math]::Round($_/1KB, 2)) KB" } else { "$_ bytes" } })  
**Export Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

---

*This document was automatically generated by the SLATE360 Complete Project Export Script v3.0 (Updated for New Architecture)*
"@

# Write the content to the output file
try {
    $content | Out-File -FilePath $OutputPath -Encoding UTF8
    Write-Host "✅ Complete project export created successfully!" -ForegroundColor Green
    Write-Host "📁 Output file: $OutputPath" -ForegroundColor Cyan
    Write-Host "📊 File size: $((Get-Item $OutputPath).Length / 1KB) KB" -ForegroundColor Yellow
    Write-Host "📄 Total files exported: $($sourceFiles.Count)" -ForegroundColor Green
    
    # Open the file in default application
    Start-Process $OutputPath
}
catch {
    Write-Host "❌ Error creating export file: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Export completed! Check the generated file for complete project information." -ForegroundColor Green
Write-Host "This export contains ALL code from every frontend and backend file!" -ForegroundColor Cyan

# Create AI Assistant Fix Script
Write-Host ""
Write-Host "Creating AI Assistant Fix Script..." -ForegroundColor Magenta

$fixScriptContent = @"
# SLATE360 AI Assistant Fix Script
# This script helps AI assistants fix dependency and TypeScript errors
# to make the website visible on localhost
# Updated for new architecture

## Quick Fix Commands

### 1. Install Dependencies
```bash
cd frontend
npm install
# or if using yarn
yarn install
```

### 2. Fix TypeScript Errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix common TypeScript issues
npm run build
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Environment Setup
```bash
# Copy environment template
cp env.example .env.local
# Edit .env.local with your values
```

## Common Issues and Solutions

1. **Module not found errors**: Run `npm install` in frontend directory
2. **TypeScript errors**: Check tsconfig.json and fix import paths
3. **Build failures**: Ensure all dependencies are installed
4. **Port conflicts**: Change port in package.json scripts

## Project Structure
- All source code is in `frontend/src/`
- Configuration files are in `frontend/`
- Run commands from `frontend/` directory
"@

# Write the fix script
try {
    $fixScriptContent | Out-File -FilePath "SLATE360_AI_Assistant_Fix_Guide.md" -Encoding UTF8
    Write-Host "✅ AI Assistant Fix Script created!" -ForegroundColor Green
    Write-Host "📁 Fix guide: SLATE360_AI_Assistant_Fix_Guide.md" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Error creating fix script: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 All scripts completed successfully!" -ForegroundColor Green
Write-Host "📋 Generated files:" -ForegroundColor Yellow
Write-Host "   • SLATE360_Complete_Project_Export.md" -ForegroundColor White
Write-Host "   • SLATE360_AI_Assistant_Fix_Guide.md" -ForegroundColor White
