// MongoDB connection utilities - disabled for mock mode
// This file is kept for future use when real MongoDB integration is needed

/*
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
}

let connectionState: ConnectionState = {
  isConnected: false,
  isConnecting: false
};

// Mock implementations for development
export async function connectToDatabase(): Promise<any> {
  console.log('🔧 MongoDB connection disabled - using mock data');
  return null;
}

export async function disconnectFromDatabase(): Promise<void> {
  console.log('🔧 MongoDB disconnection disabled - using mock data');
}

export function getConnectionStatus(): ConnectionState {
  return { isConnected: false, isConnecting: false };
}

export function isConnected(): boolean {
  return false;
}
*/

// Mock implementations for development
export async function connectToDatabase(): Promise<any> {
  console.log('🔧 MongoDB connection disabled - using mock data');
  return null;
}

export async function disconnectFromDatabase(): Promise<void> {
  console.log('🔧 MongoDB disconnection disabled - using mock data');
}

export function getConnectionStatus(): { isConnected: boolean; isConnecting: boolean } {
  return { isConnected: false, isConnecting: false };
}

export function isConnected(): boolean {
  return false;
}
