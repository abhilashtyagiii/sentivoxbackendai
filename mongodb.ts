import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/sentivox';

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

export async function connectToMongoDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  // Check if MONGODB_URI is set
  if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/sentivox') {
    const hasEnvVar = !!(process.env.MONGODB_URI || process.env.DATABASE_URL);
    if (!hasEnvVar) {
      console.warn('⚠️ MONGODB_URI or DATABASE_URL environment variable is not set');
      console.warn('⚠️ Using default localhost connection (may fail if MongoDB is not running locally)');
    }
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    console.log(`Attempting to connect to MongoDB...`);
    // Mask password in connection string for logging
    const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':***@');
    console.log(`Connection string: ${maskedUri}`);

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB successfully');
      return mongooseInstance;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed');
      console.error('Error details:', error.message);
      if (error.message.includes('authentication failed')) {
        console.error('💡 Check your MongoDB username and password');
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('💡 Check your MongoDB host/URL - cannot resolve hostname');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.error('💡 MongoDB server is not reachable - check if server is running');
      } else if (error.message.includes('timeout')) {
        console.error('💡 Connection timeout - check network/firewall settings');
      }
      throw error;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw error;
  }

  return cached!.conn;
}

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});

mongoose.connection.on('disconnected', () => {
  if (cached) {
    cached.conn = null;
    cached.promise = null;
  }
  console.log('MongoDB disconnected');
});

export default mongoose;
