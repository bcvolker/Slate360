// frontend/src/models/Project.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import type { Project } from '@/types/types';

// Use the unified Project type as the base interface
export interface IProject extends Omit<Project, 'id'>, Document {
  // Mongoose-specific fields are inherited from Document
  // All Project fields are inherited from the unified Project type
  // We omit 'id' from Project since Document already has '_id'
}

// Create a Mongoose schema that matches the Zod schema structure
const projectSchema = new Schema<IProject>({
  // Primary identifier
  id: { type: String, required: true, unique: true },
  
  // Basic project information
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  type: { 
    type: String, 
    required: true, 
    enum: ['residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other'] 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled', 'draft', 'archived'],
    default: 'draft'
  },
  
  // Location and client information
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'USA' },
    coordinates: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 }
    }
  },
  client: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    contactPerson: String,
    billingAddress: String
  },
  
  // Timeline and budget
  timeline: {
    startDate: Date,
    endDate: Date,
    estimatedDuration: { type: Number, min: 1 },
    milestones: [{
      name: { type: String, required: true },
      date: { type: Date, required: true },
      description: String,
      completed: { type: Boolean, default: false }
    }]
  },
  budget: {
    estimated: { type: Number, min: 0 },
    actual: { type: Number, min: 0 },
    currency: { type: String, default: 'USD', uppercase: true },
    breakdown: {
      materials: { type: Number, min: 0 },
      labor: { type: Number, min: 0 },
      equipment: { type: Number, min: 0 },
      permits: { type: Number, min: 0 },
      contingency: { type: Number, min: 0 }
    },
    invoices: [{
      number: { type: String, required: true },
      amount: { type: Number, min: 0, required: true },
      date: { type: Date, required: true },
      status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' }
    }]
  },
  
  // Team and collaboration
  team: [{
    userId: { type: String, required: true },
    role: { 
      type: String, 
      required: true,
      enum: ['project_manager', 'architect', 'engineer', 'designer', 'contractor', 'consultant']
    },
    permissions: [{ 
      type: String, 
      enum: ['read', 'write', 'admin'],
      default: ['read']
    }],
    joinedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],
  
  // Metadata and organization
  tags: [{ type: String, maxlength: 50 }],
  metadata: { type: Schema.Types.Mixed, default: {} },
  
  // Ownership and timestamps
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Simple task management
  tasks: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
    description: String,
    assignedTo: String,
    dueDate: Date,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  }],
  
  // Sync and offline status
  isOffline: { type: Boolean, default: false },
  lastSynced: Date,
  syncStatus: { 
    type: String, 
    enum: ['synced', 'pending', 'conflict', 'error'],
    default: 'synced'
  },
  version: { type: Number, default: 1 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields for computed properties
projectSchema.virtual('progress').get(function(this: IProject): number {
  if (!this.tasks || this.tasks.length === 0) return 0;
  const completedTasks = this.tasks.filter(task => task.done).length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

projectSchema.virtual('daysRemaining').get(function(this: IProject): number {
  if (!this.timeline?.endDate) return 0;
  const endDate = new Date(this.timeline.endDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

projectSchema.virtual('budgetUtilization').get(function(this: IProject): number {
  if (!this.budget?.estimated || !this.budget?.actual) return 0;
  return Math.round((this.budget.actual / this.budget.estimated) * 100);
});

projectSchema.virtual('teamSize').get(function(this: IProject): number {
  return this.team?.filter(member => member.isActive).length || 0;
});

// Indexes for better query performance
projectSchema.index({ name: 'text', description: 'text' });
projectSchema.index({ status: 1 });
projectSchema.index({ type: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ 'client.name': 1 });
projectSchema.index({ 'location.city': 1, 'location.state': 1 });

// Pre-save middleware to update timestamps
projectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static methods for common queries
projectSchema.statics.findByStatus = function(status: string) {
  return this.find({ status });
};

projectSchema.statics.findByType = function(type: string) {
  return this.find({ type });
};

projectSchema.statics.findByClient = function(clientName: string) {
  return this.find({ 'client.name': new RegExp(clientName, 'i') });
};

// Instance methods
projectSchema.methods.updateStatus = function(newStatus: string) {
  this.status = newStatus;
  this.updatedAt = new Date();
  return this.save();
};

projectSchema.methods.addTeamMember = function(member: any) {
  this.team.push(member);
  this.updatedAt = new Date();
  return this.save();
};

// Export the model
const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

export default Project;
