import mongoose from 'mongoose';

export const connectDB = async (uri?: string): Promise<typeof mongoose> => {
  try {
    const mongoUri = uri || process.env.MONGO_URI!

    mongoose.connection.on('connected', () => {
      console.log(`[MongoDB] Connected to database: ${mongoose.connection.name}`);
    });

    mongoose.connection.on('error', (err: Error) => {
      console.error(`[MongoDB] Connection error:`, err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`[MongoDB] Disconnected from database`);
    });

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    return conn;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`[MongoDB] Initial connection error: ${errMsg}`);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed through app termination');
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[MongoDB] Error during disconnection:', errMsg);
  }
};
