import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/apiResponse';

export const notFoundHandler = (req: Request, res: Response): void => {
  errorResponse(res, {
    statusCode: 404,
    message: `Resource not found at ${req.method} ${req.originalUrl}`
  });
};

interface MongoCustomError extends Error {
  code?: number;
  statusCode?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
  value?: unknown;
  errors?: Record<string, { path: string; message: string }>;
}

export const errorHandler = (
  err: MongoCustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Error Caught]:', err);

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    errorResponse(res, {
      statusCode: 409,
      message: `Duplicate value entered for ${field}: "${String(value)}". Must be unique.`,
      errors: [{ field, message: `${field} must be unique` }]
    });
    return;
  }

  // Mongoose CastError (invalid ObjectId or type casting)
  if (err.name === 'CastError') {
    errorResponse(res, {
      statusCode: 400,
      message: `Invalid format for field ${err.path || 'unknown'}: "${String(err.value)}"`
    });
    return;
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError' && err.errors) {
    const formattedErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));

    errorResponse(res, {
      statusCode: 400,
      message: 'Database validation failed',
      errors: formattedErrors
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  errorResponse(res, {
    statusCode,
    message,
    errors: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
