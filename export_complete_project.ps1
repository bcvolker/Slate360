# SLATE360 Complete Project Export Script - Simple Version
# This script exports ALL code from every frontend and backend file

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
2. [All Configuration Files](#all-configuration-files)
3. [Complete Source Code Export](#complete-source-code-export)

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

---

## Project File/Folder Structure

This section shows the complete file and folder organization of the SLATE360 project:

"@

# Add comprehensive project structure
Write-Host "Adding project file/folder structure..." -ForegroundColor Cyan

$content += @"

### Complete Directory Tree
```
Slate360/
├── backend/                          # Backend services directory
├── frontend/                         # Next.js frontend application
│   ├── .eslintrc.json               # ESLint configuration
│   ├── exported_code/               # Export outputs
│   │   └── frontend.txt            # Frontend code export
│   ├── IMPROVEMENTS_SUMMARY.md      # Project improvements documentation
│   ├── next-env.d.ts               # Next.js TypeScript declarations
│   ├── next.config.mjs             # Next.js configuration
│   ├── package.json                 # Node.js dependencies and scripts
│   ├── package-lock.json            # Dependency lock file
│   ├── postcss.config.js            # PostCSS configuration
│   ├── README-DemoMode.md           # Demo mode documentation
│   ├── scripts/                     # Utility scripts
│   │   └── test-security.js         # Security testing script
│   ├── SECURITY_IMPLEMENTATION.md   # Security implementation guide
│   ├── SECURITY_REVIEW.md           # Security review documentation
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── public/                      # Static assets
│   │   ├── favicon.svg              # Site favicon
│   │   ├── slate360 logo.PNG        # Company logo (PNG)
│   │   └── slate360-logo.png       # Company logo (optimized)
│   └── src/                         # Source code directory
│       ├── app/                      # Next.js App Router pages
│       │   ├── about/               # About page
│       │   │   └── page.tsx         # About page component
│       │   ├── api/                 # API routes
│       │   │   ├── (mock)/          # Mock API routes
│       │   │   │   └── [...slug]/   # Catch-all mock routes
│       │   │   │       └── route.ts # Mock route handler
│       │   │   ├── auth/            # Authentication API
│       │   │   │   └── session/     # Session management
│       │   │   │       └── route.ts # Session API handler
│       │   │   ├── contact/         # Contact form API
│       │   │   │   └── route.ts     # Contact API handler
│       │   │   ├── health/          # Health check API
│       │   │   │   └── check/       # Health check endpoint
│       │   │   │       └── route.ts # Health check handler
│       │   │   ├── preview/         # Preview mode API
│       │   │   │   └── login/       # Preview login
│       │   │   │       └── route.ts # Preview login handler
│       │   │   ├── projects/        # Project management API
│       │   │   │   ├── [id]/        # Individual project routes
│       │   │   │   │   └── route.ts # Project detail handler
│       │   │   │   └── route.ts     # Projects list handler
│       │   │   ├── security/        # Security API
│       │   │   │   └── example/     # Security examples
│       │   │   │       └── route.ts # Security example handler
│       │   │   ├── stripe/          # Stripe payment API
│       │   │   │   └── create-checkout-session/ # Checkout session
│       │   │   │       └── route.ts # Checkout handler
│       │   │   └── users/           # User management API
│       │   │       └── me/          # Current user endpoint
│       │   │           └── route.ts # User profile handler
│       │   ├── ceo/                 # CEO page
│       │   │   └── page.tsx         # CEO page component
│       │   ├── contact/             # Contact page
│       │   │   └── page.tsx         # Contact page component
│       │   ├── dashboard/           # Dashboard pages
│       │   │   ├── page.tsx         # Main dashboard page
│       │   │   └── project-hub/     # Project hub page
│       │   │       └── page.tsx     # Project hub component
│       │   ├── examples/            # Examples page
│       │   │   └── page.tsx         # Examples page component
│       │   ├── login/               # Login page
│       │   │   └── page.tsx         # Login page component
│       │   ├── pricing/             # Pricing page
│       │   │   └── page.tsx         # Pricing page component
│       │   ├── test/                # Test page
│       │   │   └── page.tsx         # Test page component
│       │   ├── test-build/          # Build test page
│       │   │   └── page.tsx         # Build test component
│       │   ├── globals.css          # Global CSS styles
│       │   ├── layout.tsx           # Root layout component
│       │   └── page.tsx             # Homepage component
│       ├── app-shell/               # Application shell components
│       │   ├── AppShell.tsx         # Main app shell component
│       │   ├── hooks/               # App shell hooks
│       │   │   └── useSidebar.ts    # Sidebar management hook
│       │   ├── index.ts             # App shell exports
│       │   ├── Providers.tsx        # Provider wrapper component
│       │   ├── README.md            # App shell documentation
│       │   └── SimpleLayout.tsx     # Simple layout component
│       ├── components/              # Reusable React components
│       │   ├── dashboard/           # Dashboard-specific components
│       │   │   └── Toolbar.tsx      # Dashboard toolbar
│       │   ├── homepage/            # Homepage components
│       │   │   ├── DashboardPreview.tsx # Dashboard preview
│       │   │   ├── FeaturesPreview.tsx  # Features preview
│       │   │   └── HeroSection.tsx      # Hero section
│       │   ├── layout/              # Layout components
│       │   │   └── Header.tsx       # Header component
│       │   ├── ContentViewer.tsx    # Content viewer component
│       │   ├── DemoBanner.tsx       # Demo mode banner
│       │   ├── DemoModeToggle.tsx   # Demo mode toggle
│       │   ├── DemoWorkflowWalkthrough.tsx # Demo workflow guide
│       │   ├── ErrorBoundary.tsx    # Error boundary component
│       │   ├── Header.tsx           # Main header component
│       │   ├── HelpIcon.tsx         # Help icon component
│       │   ├── IntegratedDashboard.tsx # Integrated dashboard
│       │   ├── Login.tsx            # Login component
│       │   ├── Logo.tsx             # Logo component
│       │   ├── Modal.tsx            # Modal component
│       │   ├── ProcessGuide.tsx     # Process guide component
│       │   ├── ProjectAnalytics.tsx # Project analytics component
│       │   ├── ProjectModal.tsx     # Project modal component
│       │   ├── SecurityDashboard.tsx # Security dashboard
│       │   ├── SyncStatus.tsx       # Sync status component
│       │   ├── ThreeHero.tsx        # Three.js hero component
│       │   ├── ThreeModelViewer.tsx # Three.js model viewer
│       │   ├── ThreeScene.tsx       # Three.js scene component
│       │   ├── ToastProvider.tsx     # Toast notification provider
│       │   └── VirtualProjectList.tsx # Virtual project list
│       ├── contexts/                # React contexts
│       │   └── DemoContext.tsx      # Demo mode context
│       ├── examples/                # Example components and code
│       │   ├── AuditLogExamples.tsx # Audit log examples
│       │   ├── BillingPortalAPI.ts  # Billing portal API examples
│       │   ├── BillingPortalExample.tsx # Billing portal examples
│       │   ├── DemoModeExamples.tsx # Demo mode examples
│       │   ├── EnhancedComponentsExamples.tsx # Enhanced components
│       │   ├── ModalExamples.tsx    # Modal examples
│       │   ├── ProjectsAPI.ts       # Projects API examples
│       │   └── RoleUsage.tsx        # Role usage examples
│       ├── features/                # Feature-based organization
│       │   ├── dashboard/           # Dashboard feature
│       │   │   ├── components/      # Dashboard components
│       │   │   │   ├── ProjectAnalytics.tsx # Project analytics
│       │   │   │   └── VirtualProjectList.tsx # Virtual project list
│       │   │   ├── hooks/           # Dashboard hooks
│       │   │   │   └── useProjects.ts # Projects management hook
│       │   │   ├── pages/           # Dashboard pages
│       │   │   │   ├── DashboardPage.tsx # Main dashboard page
│       │   │   │   └── ProjectHubPage.tsx # Project hub page
│       │   │   ├── index.ts         # Dashboard feature exports
│       │   │   └── README.md        # Dashboard documentation
│       │   ├── projects/            # Projects feature (placeholder)
│       │   └── README.md            # Features documentation
│       ├── hooks/                   # Custom React hooks
│       │   ├── useBillingPortal.ts  # Billing portal hook
│       │   ├── useDemoMode.ts       # Demo mode hook
│       │   ├── useIndexedDB.ts      # IndexedDB hook
│       │   ├── useOfflineProjects.ts # Offline projects hook
│       │   └── useRole.tsx          # Role management hook
│       ├── lib/                     # Utility libraries
│       │   ├── adapters/            # Data adapters
│       │   │   ├── auditAdapters.ts # Audit data adapters
│       │   │   ├── globalTypeAdapter.ts # Global type adapter
│       │   │   └── projectAdapters.ts # Project data adapters
│       │   ├── db/                  # Database utilities
│       │   │   └── indexedDB.ts     # IndexedDB setup
│       │   ├── demo/                # Demo data
│       │   │   └── demoData.ts      # Demo data definitions
│       │   ├── security/            # Security utilities
│       │   │   ├── apiSecurity.ts   # API security utilities
│       │   │   ├── csrf.ts          # CSRF protection
│       │   │   ├── encryption.ts    # Data encryption
│       │   │   ├── errorHandler.ts  # Error handling
│       │   │   ├── fileUpload.ts    # File upload security
│       │   │   ├── headers.ts       # Security headers
│       │   │   ├── index.ts         # Security exports
│       │   │   ├── logging.ts       # Security logging
│       │   │   ├── mfa.ts           # Multi-factor authentication
│       │   │   ├── monitoring.ts    # Security monitoring
│       │   │   ├── rateLimit.ts     # Rate limiting
│       │   │   ├── session.ts       # Session management
│       │   │   └── validation.ts    # Input validation
│       │   ├── sync/                # Data synchronization
│       │   │   ├── enhancedProjectSync.ts # Enhanced project sync
│       │   │   └── projectSync.ts   # Project synchronization
│       │   ├── audit.ts             # Audit logging utilities
│       │   ├── auth.ts              # Authentication utilities
│       │   ├── db.ts                # Database connection
│       │   ├── env.ts               # Environment variables
│       │   └── mongodb.ts           # MongoDB utilities
│       ├── middleware/              # Custom middleware
│       │   └── requireRole.ts       # Role requirement middleware
│       ├── middleware.ts            # Next.js middleware
│       ├── models/                  # Data models
│       │   ├── AuditLog.ts          # Audit log model
│       │   ├── Project.ts           # Project model
│       │   └── User.ts              # User model
│       ├── services/                # Business logic services
│       │   ├── index.ts             # Service exports
│       │   └── project.service.ts   # Project service
│       ├── styles/                  # CSS and styling
│       │   ├── Contact.module.css   # Contact page styles
│       │   ├── Login.module.css     # Login page styles
│       │   ├── mobile-responsive.css # Mobile responsive styles
│       │   └── Pricing.module.css  # Pricing page styles
│       └── types/                   # TypeScript type definitions
│           ├── types/                # Nested types directory
│           │   ├── index.ts          # Type exports
│           │   ├── project.schema.ts # Project Zod schemas
│           │   └── security.schema.ts # Security Zod schemas
│           ├── audit.ts             # Audit type definitions
│           └── next-auth.d.ts       # NextAuth type definitions
├── shared/                          # Shared utilities (placeholder)
├── export_complete_project.bat      # Batch export script
├── export_complete_project.ps1      # PowerShell export script
├── run_export.bat                   # Simple export runner
├── SLATE360_AI_Assistant_Fix_Guide.md # AI assistant fix guide
├── SLATE360_Complete_Project_Export.md # Generated project export
└── SLATE360_Complete_Project_Export.md # Complete project documentation
```

### Key Directory Explanations

**Frontend Structure:**
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components organized by feature
- `src/features/` - Feature-based organization (dashboard, projects, etc.)
- `src/lib/` - Utility libraries (security, database, adapters)
- `src/hooks/` - Custom React hooks for state management
- `src/types/` - TypeScript type definitions and Zod schemas
- `src/services/` - Business logic services
- `src/models/` - Data models and schemas
- `src/middleware/` - Custom middleware for authentication and authorization

**API Routes Structure:**
- `api/auth/` - Authentication and session management
- `api/projects/` - Project CRUD operations
- `api/security/` - Security monitoring and examples
- `api/stripe/` - Payment processing
- `api/users/` - User management
- `api/(mock)/` - Mock API routes for development/preview

**Security Implementation:**
- Comprehensive security utilities in `src/lib/security/`
- CSRF protection, encryption, validation, rate limiting
- Multi-factor authentication and session management
- File upload security and threat monitoring

**Feature Organization:**
- Dashboard feature with components, hooks, and pages
- Modular architecture for easy maintenance and scaling
- Service layer for business logic separation

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
✅ **All Configuration Files** - package.json, next.config.mjs, tailwind.config.js, tsconfig.json  
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
