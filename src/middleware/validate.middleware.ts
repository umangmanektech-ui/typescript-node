import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { errorResponse } from '../utils/apiResponse';

export const validate = (schema: Schema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, '')
      }));

      errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed',
        errors: formattedErrors
      });
      return;
    }

    req[source] = value;
    next();
  };
};
