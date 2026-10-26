import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import { connectDB, disconnectDB } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

let server: http.Server | undefined;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(`📍 API Base URL:  http://localhost:${PORT}/api/v1/products`);
      console.log(`📍 Health Check: http://localhost:${PORT}/api/v1/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Fatal error starting server:', errMsg);
    process.exit(1);
  }
};

const handleExit = async (signal: string): Promise<void> => {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => handleExit('SIGINT'));
process.on('SIGTERM', () => handleExit('SIGTERM'));

startServer();
