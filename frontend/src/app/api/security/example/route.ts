import { NextRequest, NextResponse } from 'next/server';
import { 
  secureAPI, 
  authRequired, 
  adminOnly, 
  premiumOnly,
  createSecureResponse,
  validateFileUpload
} from '../../../../lib/security/apiSecurity';
import { 
  securityLogger, 
  logSecurityEvent 
} from '../../../../lib/security/logging';
import { 
  securityErrorHandler 
} from '../../../../lib/security/errorHandler';
import { 
  validateProject, 
  safeValidateProject 
} from '../../../../lib/security/validation';
import { 
  validateFile 
} from '../../../../lib/security/fileUpload';

// Example 1: Basic secured API route
export const GET = secureAPI(
  authRequired(),
  async (request: NextRequest) => {
    try {
      // Log the request
      await securityLogger.info('Security example API accessed', {
        method: 'GET',
        path: '/api/security/example',
        userId: 'example-user',
        timestamp: new Date().toISOString()
      });

      // Return secure response
      return createSecureResponse({
        message: 'Security example API working',
        features: [
          'Authentication required',
          'CSRF protection',
          'Rate limiting',
          'Input validation',
          'Request logging'
        ],
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      // Use enhanced error handling
      return securityErrorHandler.handleSystemError(
        error instanceof Error ? error.message : 'Unknown error',
        request
      );
    }
  }
);

// Example 2: Admin-only route with role-based access
export const POST = secureAPI(
  adminOnly(),
  async (request: NextRequest) => {
    try {
      // Log admin action
      await logSecurityEvent(
        'authorization',
        'medium',
        'admin_action',
        'Admin accessed security example API',
        { action: 'POST', resource: '/api/security/example' },
        { userId: 'admin-user', role: 'admin' }
      );

      // Parse and validate request body
      const body = await request.json();
      const validatedData = safeValidateProject(body);

      if (!validatedData) {
        return securityErrorHandler.handleValidationError(
          'Invalid project data',
          request,
          'admin-user',
          'project'
        );
      }

      return createSecureResponse({
        message: 'Admin action completed',
        validatedData,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return securityErrorHandler.handleSystemError(
        error instanceof Error ? error.message : 'Unknown error',
        request
      );
    }
  }
);

// Example 3: Premium-only route with tier-based access
export const PUT = secureAPI(
  premiumOnly(),
  async (request: NextRequest) => {
    try {
      // Log premium user action
      await logSecurityEvent(
        'data_access',
        'low',
        'premium_feature_access',
        'Premium user accessed security example API',
        { action: 'PUT', resource: '/api/security/example' },
        { userId: 'premium-user', tier: 'premium' }
      );

      return createSecureResponse({
        message: 'Premium feature accessed',
        feature: 'Advanced security example',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return securityErrorHandler.handleSystemError(
        error instanceof Error ? error.message : 'Unknown error',
        request
      );
    }
  }
);

// Example 4: File upload validation
export const PATCH = secureAPI(
  authRequired(),
  async (request: NextRequest) => {
    try {
      // This would typically handle multipart form data
      // For this example, we'll simulate file validation
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (file) {
        // Validate file upload
        const validationResult = await validateFile(file, file.name);
        
        if (!validationResult.isValid) {
          await securityLogger.warn('File upload validation failed', {
            filename: file.name,
            errors: validationResult.errors,
            warnings: validationResult.warnings,
            userId: 'example-user'
          });

          return securityErrorHandler.handleValidationError(
            'File validation failed',
            request,
            'example-user',
            'file'
          );
        }

        // Log successful file validation
        await logSecurityEvent(
          'data_access',
          'low',
          'file_upload_validated',
          'File upload validation successful',
          { 
            filename: file.name, 
            fileSize: file.size,
            fileType: file.type 
          },
          { userId: 'example-user' }
        );
      }

      return createSecureResponse({
        message: 'File validation completed',
        fileInfo: file ? {
          name: file.name,
          size: file.size,
          type: file.type
        } : null,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return securityErrorHandler.handleSystemError(
        error instanceof Error ? error.message : 'Unknown error',
        request
      );
    }
  }
);

// Example 5: Custom validation route
export const DELETE = secureAPI(
  {
    path: '/api/security/example',
    method: 'DELETE',
    requireAuth: true,
    requireCSRF: true,
    rateLimit: true,
    customValidation: async (req: NextRequest, session: any) => {
      // Custom validation logic
      const userRole = session?.user?.role;
      const userTier = session?.user?.tier;
      
      // Only allow deletion for admin users or enterprise tier users
      return userRole === 'admin' || userTier === 'enterprise';
    }
  },
  async (request: NextRequest) => {
    try {
      // Log deletion action
      await logSecurityEvent(
        'data_access',
        'high',
        'resource_deletion',
        'Resource deletion attempted',
        { 
          action: 'DELETE', 
          resource: '/api/security/example',
          method: 'custom_validation'
        },
        { userId: 'validated-user' }
      );

      return createSecureResponse({
        message: 'Resource deletion completed',
        validation: 'Custom validation passed',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return securityErrorHandler.handleSystemError(
        error instanceof Error ? error.message : 'Unknown error',
        request
      );
    }
  }
);
