import { query } from 'express-validator';

export const QueryValidationRules = [
  query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
  query('minOrders')
    .optional()
    .isInt({ min: 0 })
    .withMessage('minOrders must be a non-negative integer'),
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
