import express, { Router } from 'express';
import * as usersController from '../controllers/users.controller';

import { validateRequest, QueryValidationRules } from '../common';

const router: Router = express.Router();
/**
 * @swagger
 * /users/top-spenders:
 *   get:
 *     summary: Get top spenders
 *     description: Retrieve the top spenders based on various criteria.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category of the products.
 *       - in: query
 *         name: minOrders
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum number of orders.
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         description: Latitude for geographical filtering.
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         description: Longitude for geographical filtering.
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Radius for geographical filtering.
 *       - in: query
 *         name: daysRecency
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of days for recency filtering.
 *     responses:
 *       200:
 *         description: A list of top spenders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60c72b2f9b1d8b3a4c8e4d3b
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       totalSpent:
 *                         type: number
 *                         example: 1500
 */

router
  .route('/top-spenders')
  .get(QueryValidationRules, validateRequest, usersController.topSpenders);

export { router as usersRouter };
