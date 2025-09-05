// frontend/src/lib/adapters/globalTypeAdapter.ts
// Global type adapter for unified type system
// This handles all conversions between MongoDB, IndexedDB, API, and UI layers

import { Project } from '@/types/types';
import { OfflineProject } from '../db/indexedDB';

/**
 * Global Type Adapter - Single source of truth for all type conversions
 * 
 * This adapter ensures that:
 * 1. All systems use the same Project type structure
 * 2. Type conversions are handled consistently
 * 3. No more conflicting type definitions
 * 4. Easy to maintain and extend
 */

export class GlobalTypeAdapter {
  /**
   * Convert any project-like object to unified Project type
   * Handles MongoDB documents, API responses, IndexedDB objects, etc.
   */
  static toUnifiedProject(input: any): Project {
    if (!input) {
      throw new Error('Input cannot be null or undefined');
    }

    // If it's already a Project type, return as-is
    if (this.isProjectType(input)) {
      return input;
    }

    // Handle MongoDB documents
    if (input._id && input.toObject) {
      return this.fromMongoDocument(input);
    }

    // Handle API responses
    if (input.project) {
      return this.fromApiResponse(input);
    }

    // Handle IndexedDB objects
    if (input._syncStatus !== undefined) {
      return this.fromIndexedDB(input);
    }

    // Handle raw objects (fallback)
    return this.fromRawObject(input);
  }

  /**
   * Convert unified Project to MongoDB document format
   */
  static toMongoDocument(project: Project): any {
    return {
      _id: project.id, // Use the same ID
      ...project,
      // Ensure required MongoDB fields
      createdAt: project.createdAt || new Date(),
      updatedAt: project.updatedAt || new Date(),
    };
  }

  /**
   * Convert unified Project to IndexedDB format
   */
  static toIndexedDB(project: Project): OfflineProject {
    return {
      ...project,
      _syncStatus: project.syncStatus || 'synced',
      _lastSync: project.lastSynced,
      _id: project.id, // Use the same ID for both local and server
    };
  }

  /**
   * Convert unified Project to API response format
   */
  static toApiResponse(project: Project): any {
    return {
      success: true,
      project: {
        ...project,
        // Ensure API-specific formatting
        createdAt: project.createdAt?.toISOString(),
        updatedAt: project.updatedAt?.toISOString(),
        lastSynced: project.lastSynced?.toISOString(),
      },
      message: 'Project retrieved successfully',
    };
  }

  /**
   * Convert unified Project to UI display format
   */
  static toUIDisplay(project: Project): any {
    return {
      ...project,
      // Add UI-specific computed fields
      displayName: project.name,
      displayStatus: this.formatStatus(project.status),
      displayType: this.formatType(project.type),
      displayProgress: this.calculateProgress(project),
      displayBudget: this.formatBudget(project.budget),
      displayTimeline: this.formatTimeline(project.timeline),
      displayTeam: this.formatTeam(project.team),
    };
  }

  /**
   * Validate and sanitize project data
   */
  static validateAndSanitize(input: any): Project {
    // Basic validation
    if (!input.name || typeof input.name !== 'string') {
      throw new Error('Project name is required and must be a string');
    }

    if (!input.description || typeof input.description !== 'string') {
      throw new Error('Project description is required and must be a string');
    }

    // Sanitize and provide defaults
    return {
      id: input.id || this.generateId(),
      name: input.name.trim(),
      description: input.description.trim(),
      type: input.type || 'other',
      status: input.status || 'draft',
      location: this.sanitizeLocation(input.location),
      client: this.sanitizeClient(input.client),
      timeline: this.sanitizeTimeline(input.timeline),
      budget: this.sanitizeBudget(input.budget),
      team: this.sanitizeTeam(input.team || []),
      tags: this.sanitizeTags(input.tags || []),
      tasks: this.sanitizeTasks(input.tasks || []),
      metadata: input.metadata || {},
      createdBy: input.createdBy || 'unknown',
      createdAt: input.createdAt || new Date(),
      updatedAt: input.updatedAt || new Date(),
      isOffline: input.isOffline || false,
      syncStatus: input.syncStatus || 'synced',
      version: input.version || 1,
      lastSynced: input.lastSynced,
    };
  }

  // Private helper methods

  private static isProjectType(obj: any): obj is Project {
    return (
      obj &&
      typeof obj.id === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.description === 'string' &&
      typeof obj.type === 'string' &&
      typeof obj.status === 'string'
    );
  }

  private static fromMongoDocument(doc: any): Project {
    const data = doc.toObject ? doc.toObject() : doc;
    return {
      id: data._id?.toString() || data.id,
      name: data.name,
      description: data.description,
      type: data.type,
      status: data.status,
      location: data.location,
      client: data.client,
      timeline: data.timeline,
      budget: data.budget,
      team: data.team,
      tags: data.tags,
      tasks: data.tasks,
      metadata: data.metadata,
      createdBy: data.createdBy,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      isOffline: false,
      syncStatus: 'synced',
      version: data.version || 1,
      lastSynced: data.lastSynced ? new Date(data.lastSynced) : undefined,
    };
  }

  private static fromApiResponse(response: any): Project {
    return this.toUnifiedProject(response.project);
  }

  private static fromIndexedDB(obj: OfflineProject): Project {
    return {
      ...obj,
      syncStatus: obj._syncStatus || 'synced',
      lastSynced: obj._lastSync,
    };
  }

  private static fromRawObject(obj: any): Project {
    return this.validateAndSanitize(obj);
  }

  private static generateId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static sanitizeLocation(location: any): any {
    if (!location) {
      return {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      };
    }

    return {
      address: location.address || '',
      city: location.city || '',
      state: location.state || '',
      zipCode: location.zipCode || '',
      country: location.country || 'USA',
      coordinates: location.coordinates || undefined,
    };
  }

  private static sanitizeClient(client: any): any {
    if (!client) {
      return {
        name: '',
        email: '',
      };
    }

    return {
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      contactPerson: client.contactPerson || '',
      billingAddress: client.billingAddress || '',
    };
  }

  private static sanitizeTimeline(timeline: any): any {
    if (!timeline) {
      return {
        milestones: [],
      };
    }

    return {
      startDate: timeline.startDate ? new Date(timeline.startDate) : undefined,
      endDate: timeline.endDate ? new Date(timeline.endDate) : undefined,
      estimatedDuration: timeline.estimatedDuration || undefined,
      milestones: timeline.milestones || [],
    };
  }

  private static sanitizeBudget(budget: any): any {
    if (!budget) {
      return {
        currency: 'USD',
        invoices: [],
      };
    }

    return {
      estimated: budget.estimated || undefined,
      actual: budget.actual || undefined,
      currency: budget.currency || 'USD',
      breakdown: budget.breakdown || undefined,
      invoices: budget.invoices || [],
    };
  }

  private static sanitizeTeam(team: any[]): any[] {
    if (!Array.isArray(team)) return [];
    
    return team.map(member => ({
      userId: member.userId || '',
      role: member.role || 'consultant',
      permissions: member.permissions || ['read'],
      joinedAt: member.joinedAt ? new Date(member.joinedAt) : new Date(),
      isActive: member.isActive !== false,
    }));
  }

  private static sanitizeTags(tags: any[]): string[] {
    if (!Array.isArray(tags)) return [];
    return tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0);
  }

  private static sanitizeTasks(tasks: any[]): any[] {
    if (!Array.isArray(tasks)) return [];
    
    return tasks.map(task => ({
      id: task.id || this.generateId(),
      title: task.title || '',
      done: task.done || false,
      description: task.description || '',
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      priority: task.priority || 'medium',
    }));
  }

  private static formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  private static formatType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  private static calculateProgress(project: Project): number {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.done).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  }

  private static formatBudget(budget: any): any {
    if (!budget) return { display: 'No budget set' };
    
    return {
      estimated: budget.estimated ? `$${budget.estimated.toLocaleString()}` : 'Not set',
      actual: budget.actual ? `$${budget.actual.toLocaleString()}` : 'Not set',
      currency: budget.currency || 'USD',
      utilization: budget.estimated && budget.actual 
        ? Math.round((budget.actual / budget.estimated) * 100) 
        : 0,
    };
  }

  private static formatTimeline(timeline: any): any {
    if (!timeline) return { display: 'No timeline set' };
    
    return {
      startDate: timeline.startDate ? new Date(timeline.startDate).toLocaleDateString() : 'Not set',
      endDate: timeline.endDate ? new Date(timeline.endDate).toLocaleDateString() : 'Not set',
      duration: timeline.estimatedDuration ? `${timeline.estimatedDuration} days` : 'Not set',
      milestones: timeline.milestones || [],
    };
  }

  private static formatTeam(team: any[]): any {
    if (!team || team.length === 0) return { display: 'No team members' };
    
    return {
      count: team.filter(member => member.isActive).length,
      roles: [...new Set(team.map(member => member.role))],
      members: team.map(member => ({
        userId: member.userId,
        role: member.role,
        permissions: member.permissions,
        isActive: member.isActive,
      })),
    };
  }
}

// Export convenience functions
export const toUnifiedProject = GlobalTypeAdapter.toUnifiedProject;
export const toMongoDocument = GlobalTypeAdapter.toMongoDocument;
export const toIndexedDB = GlobalTypeAdapter.toIndexedDB;
export const toApiResponse = GlobalTypeAdapter.toApiResponse;
export const toUIDisplay = GlobalTypeAdapter.toUIDisplay;
export const validateAndSanitize = GlobalTypeAdapter.validateAndSanitize;
