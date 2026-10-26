import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/index';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root JSON API info
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'Product CRUD REST API',
    version: '1.0.0',
    status: 'Running',
    documentation: {
      health: '/api/v1/health',
      products: '/api/v1/products',
      stats: '/api/v1/products/analytics/stats'
    }
  });
});

// Mount API routes
app.use('/api/v1', apiRouter);

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
