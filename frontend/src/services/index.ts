// Core services for the application
// This file serves as the main export point for all service functions

// Re-export existing services from the current lib directory
export * from '../lib/auth';
export * from '../lib/audit';
export * from '../lib/db';
export * from '../lib/mongodb';
export * from '../lib/env';

// Export security services
export * from '../lib/security';

// Export sync services
export * from '../lib/sync/projectSync';
export * from '../lib/sync/enhancedProjectSync';

// Export database adapters
export * from '../lib/adapters/auditAdapters';
export * from '../lib/adapters/projectAdapters';

// Export new service files
export { projectService } from './project.service';

// Add any additional core services here
export interface ServiceConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: any;
}

// Base service class for common functionality
export abstract class BaseService {
  protected config: ServiceConfig;

  constructor(config: ServiceConfig) {
    this.config = config;
  }

  protected async handleRequest<T>(
    requestFn: () => Promise<T>
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  private normalizeError(error: any): ServiceError {
    if (error instanceof Error) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        details: error
      };
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error
    };
  }
}
