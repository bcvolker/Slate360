/**
 * User model for MongoDB
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: 'user' | 'viewer' | 'member' | 'manager' | 'admin' | 'ceo';
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'viewer', 'member', 'manager', 'admin', 'ceo'],
    default: 'user',
  },
  tier: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free',
  },
  stripeCustomerId: {
    type: String,
    sparse: true,
  },
  stripeSubscriptionId: {
    type: String,
    sparse: true,
  },
  stripePriceId: {
    type: String,
    sparse: true,
  },
  stripeCurrentPeriodEnd: {
    type: Date,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Index for email lookups
UserSchema.index({ email: 1 });

// Index for Stripe customer lookups
UserSchema.index({ stripeCustomerId: 1 });

// Index for role-based queries
UserSchema.index({ role: 1 });

// Index for tier-based queries
UserSchema.index({ tier: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
