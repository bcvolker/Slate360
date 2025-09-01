/**
 * Database connection utilities
 */

import mongoose from 'mongoose';

declare global {
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const MONGODB_URI = process.env.MONGODB_URI;
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    if (!MONGODB_URI) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('⚠️ MONGODB_URI is not set. DB features will be unavailable in dev.');
        return null;
      }
      throw new Error('MONGODB_URI is missing in production environment.');
    }
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then(m => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default connectToDatabase;
