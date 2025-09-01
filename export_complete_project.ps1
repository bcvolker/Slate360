# SLATE360 Complete Project Export Script
# Run as Administrator to ensure full access to all files
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
        
        foreach ($ext in $extensions) {
            $files += Get-ChildItem -Path $Path -Filter $ext -Recurse -File | Where-Object { 
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
**Script Version:** 2.0
**Project:** SLATE360
**Total Files Exported:** $($sourceFiles.Count)

---

## Table of Contents

1. [Complete Project Overview](#complete-project-overview)
2. [All Configuration Files](#all-configuration-files)
3. [Core Components](#core-components)
4. [Key Models & Database](#key-models--database)
5. [Complete Error Analysis](#complete-error-analysis)
6. [Remaining Files Summary](#remaining-files-summary)
7. [Frontend Source Code](#frontend-source-code)
8. [Backend Source Code](#backend-source-code)
9. [API Routes](#api-routes)
10. [Security Implementation](#security-implementation)
11. [Project Structure](#project-structure)
12. [Complete Source Code Export](#complete-source-code-export)

---

## Complete Project Overview

### Tech Stack
- **Frontend:** Next.js 14.2.5, React 18.3.1, TypeScript 5.4.5
- **Styling:** Tailwind CSS 3.4.3
- **Database:** MongoDB with Mongoose, IndexedDB for offline storage
- **Authentication:** Supabase Auth
- **3D/VR:** Three.js, React Three Fiber, Cesium
- **Real-time:** WebSockets, Y.js for collaborative editing
- **Maps:** Leaflet
- **File Handling:** AWS S3 integration
- **Payment:** Stripe integration
- **State Management:** React Query, Context API

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

## All Configuration Files

### package.json
\`\`\`json
$(Read-FileContent "frontend/package.json")
\`\`\`

### next.config.mjs
\`\`\`javascript
$(Read-FileContent "frontend/next.config.mjs")
\`\`\`

### tailwind.config.js
\`\`\`javascript
$(Read-FileContent "frontend/tailwind.config.js")
\`\`\`

### tsconfig.json
\`\`\`json
$(Read-FileContent "frontend/tsconfig.json")
\`\`\`

### .eslintrc.json
\`\`\`json
$(Read-FileContent "frontend/.eslintrc.json")
\`\`\`

### postcss.config.js
\`\`\`javascript
$(Read-FileContent "frontend/postcss.config.js")
\`\`\`

### env.example
\`\`\`bash
$(Read-FileContent "frontend/env.example")
\`\`\`

---

## Core Components

### layout.tsx
\`\`\`typescript
$(Read-FileContent "frontend/src/app/layout.tsx")
\`\`\`

### page.tsx
\`\`\`typescript
$(Read-FileContent "frontend/src/app/page.tsx")
\`\`\`

### globals.css
\`\`\`css
$(Read-FileContent "frontend/src/app/globals.css")
\`\`\`

### ToastProvider.tsx
\`\`\`typescript
$(Read-FileContent "frontend/src/components/ToastProvider.tsx")
\`\`\`

---

## Key Models & Database

### Project.ts
\`\`\`typescript
$(Read-FileContent "frontend/src/models/Project.ts")
\`\`\`

### User.ts
\`\`\`typescript
$(Read-FileContent "frontend/src/models/User.ts")
\`\`\`

### AuditLog.ts
\`\`\`typescript
$(Read-FileContent "frontend/src/models/AuditLog.ts")
\`\`\`

### db.ts
\`\`\`typescript
$(Read-FileContent "frontend/src/lib/db.ts")
\`\`\`

### mongodb.ts
\`\`\`typescript
$(Read-FileContent "frontend/src/lib/mongodb.ts")
\`\`\`

### useIndexedDB.ts
\`\`\`typescript
$(Read-FileContent "frontend/src/hooks/useIndexedDB.ts")
\`\`\`

### demoData.ts
\`\`\`typescript
$(Read-FileContent "frontend/src/lib/demo/demoData.ts")
\`\`\`

---

## Complete Error Analysis

### TypeScript Build Errors
The project currently has TypeScript errors that are bypassed in the build configuration:

\`\`\`typescript
// From next.config.mjs
typescript: {
  ignoreBuildErrors: true
}
\`\`\`

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
\`\`\`typescript
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
\`\`\`

### Component Architecture
\`\`\`typescript
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
\`\`\`

---

## Backend Source Code

### API Route Structure
\`\`\`typescript
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
\`\`\`

### Database Models
\`\`\`typescript
// Data models
frontend/src/models/
├── Project.ts          # Project schema and methods
├── User.ts             # User schema and methods
└── AuditLog.ts         # Audit logging schema
\`\`\`

### Database Utilities
\`\`\`typescript
// Database connections
frontend/src/lib/
├── db.ts               # MongoDB connection
├── mongodb.ts          # MongoDB utilities
└── db/
    └── indexedDB.ts    # IndexedDB setup
\`\`\`

---

## Security Implementation

### Core Security Modules
\`\`\`typescript
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
\`\`\`

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
\`\`\`
Slate360/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                # App router pages
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility libraries
│   │   ├── models/             # Database models
│   │   ├── types/              # TypeScript types
│   │   ├── contexts/           # React contexts
│   │   ├── middleware/         # Custom middleware
│   │   └── styles/             # CSS and styling
│   ├── public/                 # Static assets
│   ├── package.json            # Dependencies
│   ├── next.config.mjs         # Next.js configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── SECURITY_IMPLEMENTATION.md # Security documentation
├── backend/                     # Backend services (if any)
├── shared/                      # Shared utilities
└── exported_code/               # Export outputs
\`\`\`

### Key Dependencies
\`\`\`json
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
\`\`\`

---

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB instance
- Supabase account
- AWS S3 bucket (for file storage)

### Environment Variables
\`\`\`bash
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
\`\`\`

### Installation Steps
\`\`\`bash
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
\`\`\`

---

## Deployment

### Production Build
\`\`\`bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start npm --name "slate360" -- start
\`\`\`

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

\`\`\`$($file.Extension.TrimStart('.'))
$(Read-FileContent $file.FullName)
\`\`\`

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
✅ **Core Components** - layout.tsx, page.tsx, globals.css, ToastProvider.tsx  
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

*This document was automatically generated by the SLATE360 Complete Project Export Script v2.0*
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

## Quick Fix Commands

### 1. Install Dependencies
\`\`\`bash
cd frontend
npm install
# or if using yarn
yarn install
\`\`\`

### 2. Fix TypeScript Errors
\`\`\`bash
# Check TypeScript errors
npx tsc --noEmit

# Fix common TypeScript issues
npm run lint -- --fix
\`\`\`

### 3. Clear Build Cache
\`\`\`bash
# Remove build artifacts
rm -rf .next
rm -rf node_modules/.cache
rm -rf .tsbuildinfo

# Reinstall dependencies
npm install
\`\`\`

### 4. Environment Setup
\`\`\`bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your values:
# MONGODB_URI=mongodb://localhost:27017/slate360
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 5. Start Development Server
\`\`\`bash
npm run dev
# Website will be available at http://localhost:3000
\`\`\`

## Common Issues and Fixes

### Issue 1: TypeScript Build Errors
**Problem:** \`typescript: { ignoreBuildErrors: true }\` in next.config.mjs
**Solution:** Fix TypeScript errors systematically:

1. **Fix import paths:**
\`\`\`typescript
// Change from
import { Component } from '@/components/Component'
// To
import { Component } from '../components/Component'
// Or ensure tsconfig.json paths are correct
\`\`\`

2. **Fix type mismatches:**
\`\`\`typescript
// Add proper type definitions
interface Project {
  id: string;
  name: string;
  description: string;
  // ... other properties
}
\`\`\`

3. **Fix React hooks dependencies:**
\`\`\`typescript
// Add missing dependencies to useEffect
useEffect(() => {
  // effect code
}, [dependency1, dependency2]); // Add all dependencies
\`\`\`

### Issue 2: Missing Dependencies
**Problem:** Import errors for missing packages
**Solution:** Install missing dependencies:

\`\`\`bash
# Install common missing packages
npm install @types/node @types/react @types/react-dom
npm install @types/leaflet @types/three
npm install lucide-react framer-motion
\`\`\`

### Issue 3: Path Resolution Issues
**Problem:** Module not found errors
**Solution:** Check tsconfig.json paths:

\`\`\`json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/models/*": ["./src/models/*"]
    }
  }
}
\`\`\`

### Issue 4: Build Configuration Issues
**Problem:** Build fails due to configuration
**Solution:** Update next.config.mjs:

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove this line once TypeScript errors are fixed
  // typescript: {
  //   ignoreBuildErrors: true
  // },
  
  experimental: {
    // Enable features as needed
    appDir: true,
  },
  
  // Ensure proper image domains
  images: {
    domains: ['localhost', 'your-domain.com'],
  },
};

export default nextConfig;
\`\`\`

## Step-by-Step Fix Process

### Phase 1: Dependencies
1. Delete \`node_modules\` and \`package-lock.json\`
2. Run \`npm install\`
3. Check for any missing peer dependencies

### Phase 2: TypeScript
1. Run \`npx tsc --noEmit\` to see all errors
2. Fix import/export issues first
3. Fix type definition issues
4. Fix React hooks issues
5. Run \`npm run lint\` to check for more issues

### Phase 3: Configuration
1. Ensure \`.env.local\` is properly configured
2. Check \`tsconfig.json\` paths are correct
3. Verify \`next.config.mjs\` settings
4. Remove \`ignoreBuildErrors: true\` once errors are fixed

### Phase 4: Testing
1. Run \`npm run build\` to ensure build succeeds
2. Run \`npm run dev\` to start development server
3. Open \`http://localhost:3000\` in browser
4. Check browser console for any runtime errors

## AI Assistant Task List

1. **Analyze TypeScript errors** from \`npx tsc --noEmit\`
2. **Fix import/export issues** systematically
3. **Add missing type definitions** where needed
4. **Resolve dependency conflicts** if any
5. **Update configuration files** as needed
6. **Test the build process** step by step
7. **Verify localhost accessibility** at http://localhost:3000

## Success Criteria

✅ **npm install** completes without errors  
✅ **npx tsc --noEmit** shows no TypeScript errors  
✅ **npm run build** completes successfully  
✅ **npm run dev** starts without errors  
✅ **Website is accessible** at http://localhost:3000  
✅ **No console errors** in browser developer tools  

## Emergency Fallback

If all else fails, temporarily enable:
\`\`\`javascript
// In next.config.mjs
typescript: {
  ignoreBuildErrors: true
}
\`\`\`

This will allow the site to run while you fix errors incrementally.
"@

# Write the fix script to a separate file
$fixScriptPath = "SLATE360_AI_Assistant_Fix_Guide.md"
try {
    $fixScriptContent | Out-File -FilePath $fixScriptPath -Encoding UTF8
    Write-Host "✅ AI Assistant Fix Guide created: $fixScriptPath" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error creating fix guide: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Two files created:" -ForegroundColor Cyan
Write-Host "   1. $OutputPath - Complete project export" -ForegroundColor Yellow
Write-Host "   2. $fixScriptPath - AI Assistant fix guide" -ForegroundColor Yellow
Write-Host ""
Write-Host "Other AI assistants can use the fix guide to resolve all issues!" -ForegroundColor Magenta
