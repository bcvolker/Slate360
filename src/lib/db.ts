// Database connection utilities - disabled for mock mode
// This file is kept for future use when real MongoDB integration is needed

/*
import mongoose from 'mongoose';

declare global {
  var __mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
let cached = global.__mongooseCache ?? { conn: null, promise: null };
global.__mongooseCache = cached;

export default async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('MONGODB_URI not set; skipping DB connection in development.');
      return null;
    }
    throw new Error('MONGODB_URI is required in production.');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then(m => m);
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}
*/

// Mock implementation for development
export default async function connectToDatabase() {
  console.log('🔧 connectToDatabase - using mock implementation');
  return null;
}
