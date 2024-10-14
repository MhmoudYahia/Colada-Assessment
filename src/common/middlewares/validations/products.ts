import { query } from 'express-validator';

export const ProductsQueryValidationRules = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date'),
  query('lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  query('radius')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Radius must be a non-negative number'),
  query('daysRecency')
    .optional()
    .isInt({ min: 0 })
    .withMessage('daysRecency must be a non-negative integer'),
];
