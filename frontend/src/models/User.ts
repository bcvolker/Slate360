/**
 * User model - disabled for mock mode
 * This file is kept for future use when real MongoDB integration is needed
 */

/*
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
*/

// Mock interface for development
export interface IUser {
  _id?: string;
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

// Mock implementations
export const User = {
  create: async (data: Partial<IUser>) => {
    console.log('🔧 User.create - using mock implementation');
    return { ...data, _id: Date.now().toString() };
  },
  find: async (query: any) => {
    console.log('🔧 User.find - using mock implementation');
    return [];
  },
  findOne: async (query: any) => {
    console.log('🔧 User.findOne - using mock implementation');
    return null;
  },
  findById: async (id: string) => {
    console.log('🔧 User.findById - using mock implementation');
    return null;
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    console.log('🔧 User.findByIdAndUpdate - using mock implementation');
    return null;
  },
  findByIdAndDelete: async (id: string) => {
    console.log('🔧 User.findByIdAndDelete - using mock implementation');
    return null;
  },
  deleteMany: async (query: any) => {
    console.log('🔧 User.deleteMany - using mock implementation');
    return { deletedCount: 0 };
  },
  aggregate: async (pipeline: any[]) => {
    console.log('🔧 User.aggregate - using mock implementation');
    return [];
  }
};

export default User;
