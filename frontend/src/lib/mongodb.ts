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

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // If already connected, return existing connection
  if (connectionState.isConnected) {
    return mongoose;
  }

  // If already connecting, wait for connection
  if (connectionState.isConnecting) {
    while (connectionState.isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return mongoose;
  }

  try {
    connectionState.isConnecting = true;

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    connectionState.isConnected = true;
    connectionState.isConnecting = false;

    console.log('✅ Connected to MongoDB');
    return mongoose;

  } catch (error) {
    connectionState.isConnecting = false;
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    if (connectionState.isConnected) {
      await mongoose.disconnect();
      connectionState.isConnected = false;
      console.log('✅ Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('❌ Failed to disconnect from MongoDB:', error);
    throw error;
  }
}

/**
 * Get connection status
 */
export function getConnectionStatus(): ConnectionState {
  return { ...connectionState };
}

/**
 * Check if connected to MongoDB
 */
export function isConnected(): boolean {
  return connectionState.isConnected;
}

// Handle connection events
mongoose.connection.on('connected', () => {
  connectionState.isConnected = true;
  connectionState.isConnecting = false;
  console.log('✅ MongoDB connection established');
});

mongoose.connection.on('error', (error) => {
  connectionState.isConnected = false;
  connectionState.isConnecting = false;
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  connectionState.isConnected = false;
  connectionState.isConnecting = false;
  console.log('⚠️ MongoDB connection disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await disconnectFromDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    await disconnectFromDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});
