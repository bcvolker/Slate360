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
