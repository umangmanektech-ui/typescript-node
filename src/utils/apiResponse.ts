import { Response } from 'express';

interface SuccessOptions<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

interface ErrorOptions {
  statusCode?: number;
  message?: string;
  errors?: unknown;
}

export const successResponse = <T>(
  res: Response,
  { statusCode = 200, message = 'Success', data, meta }: SuccessOptions<T>
): Response => {
  const payload: Record<string, unknown> = {
    success: true,
    message,
    data
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const errorResponse = (
  res: Response,
  { statusCode = 500, message = 'Internal Server Error', errors }: ErrorOptions
): Response => {
  const payload: Record<string, unknown> = {
    success: false,
    message
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};
