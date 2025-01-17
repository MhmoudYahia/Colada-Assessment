import { AppError } from '../common';
import { Order } from '../models/Order';
import { IProduct, Product } from '../models/Product';

/**
 * @class ProductsService
 * @description Provides Products-related functionalities for Product actions.
 */

interface IDemandAnalysisQuery {
  startDate?: string;
  endDate?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  daysRecency?: number;
}

class ProductsService {
  constructor() {}

  demandAnalysis = async (query: IDemandAnalysisQuery) => {
    const { startDate, endDate, lat, lng, radius, daysRecency } = query;

    const matchStage: any = {};

    if (startDate && endDate) {
      matchStage['orders.date'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (lat && lng && radius) {
      matchStage['orders.location'] = {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius / 6378.1], // Radius in radians
        },
      };
    }

    if (daysRecency) {
      const date = new Date();
      date.setDate(date.getDate() - daysRecency);
      matchStage['orders.date'] = { $gte: date };
    }

    const startTime = new Date();
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'products',
          as: 'orders',
        },
      },
      {
        $unwind: '$orders',
      },
      {
        $unwind: '$orders.products',
      },
      {
        $match: { ...matchStage, category: { $ne: null } },
      },
      {
        $group: {
          _id: '$category',
          totalRevenue: { $sum: '$orders.totalPrice' },
          numberOfUsersOrderedTheCategoryProducts: { $sum: 1 },
          products: {
            $addToSet: {
              productId: '$_id',
              productName: '$name',
              price: '$price',
            },
          },
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
      {
        $addFields: {
          demandScore: {
            $divide: [
              '$numberOfUsersOrderedTheCategoryProducts',
              '$totalRevenue',
            ],
          },
          category: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
          category: 1,
          totalRevenue: 1,
          numberOfUsersOrderedTheCategoryProducts: 1,
          demandScore: 1,
          products: 1,
        },
      },
    ]);

    const endTime = new Date();
    console.log(
      `Query executed in ${endTime.getTime() - startTime.getTime()}ms`
    );
    return products;
  };
}

export const productsService = new ProductsService();
