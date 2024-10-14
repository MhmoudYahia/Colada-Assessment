import { AppError } from '../common';
import { Order } from '../models/Order';
import { IUser, User } from '../models/User';

/**
 * @class UsersService
 * @description Provides Users-related functionalities for user actions.
 */

interface ITopSpendersQuery {
  category?: string;
  minOrders?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  daysRecency?: number;
}

class UsersService {
  constructor() {}

  topSpenders = async (query: ITopSpendersQuery) => {
    const { category, minOrders, lat, lng, radius, daysRecency } = query;

    const matchStage: any = {};

    if (category) {
      matchStage['orders.products.category'] = category;
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
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders',
        },
      },
      {
        $unwind: '$orders',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orders.products',
          foreignField: '_id',
          as: 'orders.products',
        },
      },
      {
        $unwind: '$orders.products',
      },
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          totalSpent: { $sum: '$orders.totalPrice' },
          ordersCount: { $sum: 1 },
        },
      },
      {
        $match: minOrders ? { ordersCount: { $gte: minOrders } } : {},
      },
      {
        $sort: {
          totalSpent: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalSpent: 1,
          ordersCount: 1,
        },
      },
      {
        $addFields: {
          averageSpentPerOrder: { $divide: ['$totalSpent', '$ordersCount'] },
        },
      },
    ]);

    const endTime = new Date();
    console.log(
      `Query executed in ${endTime.getTime() - startTime.getTime()}ms`
    );
    return users;
  };
}

export const usersService = new UsersService();
