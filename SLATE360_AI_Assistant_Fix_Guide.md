# SLATE360 AI Assistant Fix Script
# This script helps AI assistants fix dependency and TypeScript errors
# to make the website visible on localhost

## Quick Fix Commands

### 1. Install Dependencies
\\\ash
cd frontend
npm install
# or if using yarn
yarn install
\\\

### 2. Fix TypeScript Errors
\\\ash
# Check TypeScript errors
npx tsc --noEmit

# Fix common TypeScript issues
npm run lint -- --fix
\\\

### 3. Clear Build Cache
\\\ash
# Remove build artifacts
rm -rf .next
rm -rf node_modules/.cache
rm -rf .tsbuildinfo

# Reinstall dependencies
npm install
\\\

### 4. Environment Setup
\\\ash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your values:
# MONGODB_URI=mongodb://localhost:27017/slate360
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\\\

### 5. Start Development Server
\\\ash
npm run dev
# Website will be available at http://localhost:3000
\\\

## Common Issues and Fixes

### Issue 1: TypeScript Build Errors
**Problem:** \	ypescript: { ignoreBuildErrors: true }\ in next.config.mjs
**Solution:** Fix TypeScript errors systematically:

1. **Fix import paths:**
\\\	ypescript
// Change from
import { Component } from '@/components/Component'
// To
import { Component } from '../components/Component'
// Or ensure tsconfig.json paths are correct
\\\

2. **Fix type mismatches:**
\\\	ypescript
// Add proper type definitions
interface Project {
  id: string;
  name: string;
  description: string;
  // ... other properties
}
\\\

3. **Fix React hooks dependencies:**
\\\	ypescript
// Add missing dependencies to useEffect
useEffect(() => {
  // effect code
}, [dependency1, dependency2]); // Add all dependencies
\\\

### Issue 2: Missing Dependencies
**Problem:** Import errors for missing packages
**Solution:** Install missing dependencies:

\\\ash
# Install common missing packages
npm install @types/node @types/react @types/react-dom
npm install @types/leaflet @types/three
npm install lucide-react framer-motion
\\\

### Issue 3: Path Resolution Issues
**Problem:** Module not found errors
**Solution:** Check tsconfig.json paths:

\\\json
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
\\\

### Issue 4: Build Configuration Issues
**Problem:** Build fails due to configuration
**Solution:** Update next.config.mjs:

\\\javascript
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
\\\

## Step-by-Step Fix Process

### Phase 1: Dependencies
1. Delete \
ode_modules\ and \package-lock.json\
2. Run \
pm install\
3. Check for any missing peer dependencies

### Phase 2: TypeScript
1. Run \
px tsc --noEmit\ to see all errors
2. Fix import/export issues first
3. Fix type definition issues
4. Fix React hooks issues
5. Run \
pm run lint\ to check for more issues

### Phase 3: Configuration
1. Ensure \.env.local\ is properly configured
2. Check \	sconfig.json\ paths are correct
3. Verify \
ext.config.mjs\ settings
4. Remove \ignoreBuildErrors: true\ once errors are fixed

### Phase 4: Testing
1. Run \
pm run build\ to ensure build succeeds
2. Run \
pm run dev\ to start development server
3. Open \http://localhost:3000\ in browser
4. Check browser console for any runtime errors

## AI Assistant Task List

1. **Analyze TypeScript errors** from \
px tsc --noEmit\
2. **Fix import/export issues** systematically
3. **Add missing type definitions** where needed
4. **Resolve dependency conflicts** if any
5. **Update configuration files** as needed
6. **Test the build process** step by step
7. **Verify localhost accessibility** at http://localhost:3000

## Success Criteria

âœ… **npm install** completes without errors  
âœ… **npx tsc --noEmit** shows no TypeScript errors  
âœ… **npm run build** completes successfully  
âœ… **npm run dev** starts without errors  
âœ… **Website is accessible** at http://localhost:3000  
âœ… **No console errors** in browser developer tools  

## Emergency Fallback

If all else fails, temporarily enable:
\\\javascript
// In next.config.mjs
typescript: {
  ignoreBuildErrors: true
}
\\\

This will allow the site to run while you fix errors incrementally.
