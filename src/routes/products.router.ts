import express, { Router } from 'express';
import * as productsController from '../controllers/products.controller';
import { validateRequest, ProductsQueryValidationRules } from '../common';

const router: Router = express.Router();

/**
 * @swagger
 * /demand-analysis:
 *   get:
 *     summary: Perform demand analysis on products
 *     description: Returns insights on product demand based on various criteria.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for the analysis (ISO 8601 format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for the analysis (ISO 8601 format)
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude for geographical analysis
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Longitude for geographical analysis
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: Radius for geographical analysis in kilometers
 *       - in: query
 *         name: daysRecency
 *         schema:
 *           type: integer
 *         description: Number of days to consider for recency analysis
 *     responses:
 *       200:
 *         description: A list of products with demand analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: The product ID
 *                   demandScore:
 *                     type: number
 *                     description: The demand score of the product
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */

router
  .route('/demand-analysis')
  .get(
    ProductsQueryValidationRules,
    validateRequest,
    productsController.demandAnalysis
  );

export { router as productsRouter };