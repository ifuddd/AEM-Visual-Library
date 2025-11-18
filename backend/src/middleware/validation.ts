import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '@aem-portal/shared';

/**
 * Validation middleware factory
 */
export const validate = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: string[] = [];

    // Validate body
    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        validationErrors.push(
          ...error.details.map((detail) => detail.message)
        );
      }
    }

    // Validate query
    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        validationErrors.push(
          ...error.details.map((detail) => detail.message)
        );
      }
    }

    // Validate params
    if (schema.params) {
      const { error } = schema.params.validate(req.params, {
        abortEarly: false,
      });
      if (error) {
        validationErrors.push(
          ...error.details.map((detail) => detail.message)
        );
      }
    }

    if (validationErrors.length > 0) {
      return next(
        new ApiError(
          'Validation failed',
          400,
          'VALIDATION_ERROR',
          validationErrors
        )
      );
    }

    next();
  };
};
