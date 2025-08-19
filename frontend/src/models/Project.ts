import mongoose, { Schema, Document, Model } from 'mongoose';

// Team member interface
export interface ITeamMember {
  userId: mongoose.Types.ObjectId;
  role: 'project_manager' | 'architect' | 'engineer' | 'designer' | 'contractor' | 'consultant';
  permissions: ('read' | 'write' | 'admin')[];
  joinedAt: Date;
  isActive: boolean;
}

// Location interface
export interface ILocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Client interface
export interface IClient {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  contactPerson?: string;
  billingAddress?: string;
}

// Timeline interface
export interface ITimeline {
  startDate?: Date;
  endDate?: Date;
  estimatedDuration?: number; // in days
  milestones?: Array<{
    name: string;
    date: Date;
    description?: string;
    completed: boolean;
  }>;
}

// Budget interface
export interface IBudget {
  estimated?: number;
  actual?: number;
  currency: string;
  breakdown?: {
    materials: number;
    labor: number;
    equipment: number;
    permits: number;
    contingency: number;
  };
  invoices?: Array<{
    number: string;
    amount: number;
    date: Date;
    status: 'pending' | 'paid' | 'overdue';
  }>;
}

// Project document interface
export interface IProject extends Document {
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'renovation' | 'other';
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  location: ILocation;
  client: IClient;
  timeline: ITimeline;
  budget: IBudget;
  team: ITeamMember[];
  tags: string[];
  metadata: Record<string, any>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual fields
  progress: number;
  daysRemaining: number;
  budgetUtilization: number;
  teamSize: number;
  
  // Methods
  addTeamMember(userId: mongoose.Types.ObjectId, role: ITeamMember['role'], permissions?: ITeamMember['permissions']): Promise<void>;
  removeTeamMember(userId: mongoose.Types.ObjectId): Promise<void>;
  updateTeamMemberPermissions(userId: mongoose.Types.ObjectId, permissions: ITeamMember['permissions']): Promise<void>;
  calculateProgress(): number;
  calculateBudgetUtilization(): number;
  addMilestone(name: string, date: Date, description?: string): Promise<void>;
  completeMilestone(milestoneName: string): Promise<void>;
}

// Project schema
const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters'],
    unique: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [500, 'Project description cannot exceed 500 characters'],
  },
  type: {
    type: String,
    required: [true, 'Project type is required'],
    enum: {
      values: ['residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other'],
      message: 'Invalid project type',
    },
    index: true,
  },
  status: {
    type: String,
    required: [true, 'Project status is required'],
    enum: {
      values: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
      message: 'Invalid project status',
    },
    default: 'planning',
    index: true,
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'USA',
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
      },
      lng: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
      },
    },
  },
  client: {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    billingAddress: {
      type: String,
      trim: true,
    },
  },
  timeline: {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    estimatedDuration: {
      type: Number,
      min: [1, 'Estimated duration must be at least 1 day'],
    },
    milestones: [{
      name: {
        type: String,
        required: true,
        trim: true,
      },
      date: {
        type: Date,
        required: true,
      },
      description: {
        type: String,
        trim: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    }],
  },
  budget: {
    estimated: {
      type: Number,
      min: [0, 'Estimated budget cannot be negative'],
    },
    actual: {
      type: Number,
      min: [0, 'Actual budget cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    breakdown: {
      materials: {
        type: Number,
        min: [0, 'Materials cost cannot be negative'],
      },
      labor: {
        type: Number,
        min: [0, 'Labor cost cannot be negative'],
      },
      equipment: {
        type: Number,
        min: [0, 'Equipment cost cannot be negative'],
      },
      permits: {
        type: Number,
        min: [0, 'Permits cost cannot be negative'],
      },
      contingency: {
        type: Number,
        min: [0, 'Contingency cost cannot be negative'],
      },
    },
    invoices: [{
      number: {
        type: String,
        required: true,
        trim: true,
      },
      amount: {
        type: Number,
        required: true,
        min: [0, 'Invoice amount cannot be negative'],
      },
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending',
      },
    }],
  },
  team: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Team member user ID is required'],
    },
    role: {
      type: String,
      required: [true, 'Team member role is required'],
      enum: {
        values: ['project_manager', 'architect', 'engineer', 'designer', 'contractor', 'consultant'],
        message: 'Invalid team member role',
      },
    },
    permissions: [{
      type: String,
      enum: {
        values: ['read', 'write', 'admin'],
        message: 'Invalid permission level',
      },
      default: ['read'],
    }],
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters'],
    validate: {
      validator: function(tags: string[]) {
        return tags.length <= 20;
      },
      message: 'Maximum 20 tags allowed',
    },
  }],
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project creator is required'],
    index: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual fields
projectSchema.virtual('progress').get(function(this: IProject): number {
  return this.calculateProgress();
});

projectSchema.virtual('daysRemaining').get(function(this: IProject): number {
  if (!this.timeline.endDate) return 0;
  const now = new Date();
  const endDate = new Date(this.timeline.endDate);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

projectSchema.virtual('budgetUtilization').get(function(this: IProject): number {
  return this.calculateBudgetUtilization();
});

projectSchema.virtual('teamSize').get(function(this: IProject): number {
  return this.team.filter(member => member.isActive).length;
});

// Indexes for better query performance
projectSchema.index({ name: 'text', description: 'text' }); // Text search
projectSchema.index({ 'client.name': 1 }); // Client name search
projectSchema.index({ 'team.userId': 1 }); // Team member lookup
projectSchema.index({ status: 1, type: 1 }); // Status and type filtering
projectSchema.index({ createdAt: -1 }); // Recent projects
projectSchema.index({ 'timeline.startDate': 1, 'timeline.endDate': 1 }); // Timeline queries
projectSchema.index({ tags: 1 }); // Tag filtering

// Instance methods
projectSchema.methods.addTeamMember = async function(
  userId: mongoose.Types.ObjectId,
  role: ITeamMember['role'],
  permissions: ITeamMember['permissions'] = ['read']
): Promise<void> {
  // Check if user is already a team member
  const existingMember = this.team.find(member => member.userId.equals(userId));
  if (existingMember) {
    throw new Error('User is already a team member');
  }

  this.team.push({
    userId,
    role,
    permissions,
    joinedAt: new Date(),
    isActive: true,
  });

  await this.save();
};

projectSchema.methods.removeTeamMember = async function(
  userId: mongoose.Types.ObjectId
): Promise<void> {
  const memberIndex = this.team.findIndex(member => member.userId.equals(userId));
  if (memberIndex === -1) {
    throw new Error('User is not a team member');
  }

  // Soft delete - mark as inactive instead of removing
  this.team[memberIndex].isActive = false;
  await this.save();
};

projectSchema.methods.updateTeamMemberPermissions = async function(
  userId: mongoose.Types.ObjectId,
  permissions: ITeamMember['permissions']
): Promise<void> {
  const member = this.team.find(member => member.userId.equals(userId));
  if (!member) {
    throw new Error('User is not a team member');
  }

  member.permissions = permissions;
  await this.save();
};

projectSchema.methods.calculateProgress = function(): number {
  if (this.status === 'completed') return 100;
  if (this.status === 'cancelled') return 0;
  if (this.status === 'planning') return 0;

  // Calculate progress based on completed milestones
  if (this.timeline.milestones && this.timeline.milestones.length > 0) {
    const completedMilestones = this.timeline.milestones.filter(m => m.completed).length;
    return Math.round((completedMilestones / this.timeline.milestones.length) * 100);
  }

  // Fallback: estimate progress based on status
  const statusProgress = {
    'planning': 0,
    'active': 50,
    'on-hold': 50,
    'completed': 100,
    'cancelled': 0,
  };

  return statusProgress[this.status] || 0;
};

projectSchema.methods.calculateBudgetUtilization = function(): number {
  if (!this.budget.estimated || !this.budget.actual) return 0;
  return Math.round((this.budget.actual / this.budget.estimated) * 100);
};

projectSchema.methods.addMilestone = async function(
  name: string,
  date: Date,
  description?: string
): Promise<void> {
  if (!this.timeline.milestones) {
    this.timeline.milestones = [];
  }

  this.timeline.milestones.push({
    name,
    date,
    description,
    completed: false,
  });

  await this.save();
};

projectSchema.methods.completeMilestone = async function(milestoneName: string): Promise<void> {
  if (!this.timeline.milestones) {
    throw new Error('No milestones found');
  }

  const milestone = this.timeline.milestones.find(m => m.name === milestoneName);
  if (!milestone) {
    throw new Error('Milestone not found');
  }

  milestone.completed = true;
  await this.save();
};

// Static methods
projectSchema.statics.findByStatus = function(status: string) {
  return this.find({ status });
};

projectSchema.statics.findByType = function(type: string) {
  return this.find({ type });
};

projectSchema.statics.findByClient = function(clientName: string) {
  return this.find({ 'client.name': { $regex: clientName, $options: 'i' } });
};

projectSchema.statics.findByTeamMember = function(userId: mongoose.Types.ObjectId) {
  return this.find({ 'team.userId': userId, 'team.isActive': true });
};

// Pre-save middleware
projectSchema.pre('save', function(next) {
  // Ensure at least one team member (the creator)
  if (this.team.length === 0) {
    this.team.push({
      userId: this.createdBy,
      role: 'project_manager',
      permissions: ['read', 'write', 'admin'],
      joinedAt: new Date(),
      isActive: true,
    });
  }

  // Validate timeline dates
  if (this.timeline.startDate && this.timeline.endDate) {
    if (this.timeline.startDate >= this.timeline.endDate) {
      next(new Error('Start date must be before end date'));
      return;
    }
  }

  // Validate budget
  if (this.budget.actual && this.budget.estimated) {
    if (this.budget.actual < 0 || this.budget.estimated < 0) {
      next(new Error('Budget values cannot be negative'));
      return;
    }
  }

  next();
});

// Pre-remove middleware
projectSchema.pre('remove', function(next) {
  // Add any cleanup logic here
  // For example, remove related documents, files, etc.
  next();
});

// Create and export the model
const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

export default Project;
