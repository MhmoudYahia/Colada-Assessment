import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../common';
import { usersService } from '../services/users.service';

export const topSpenders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category, minOrders, lat, lng, radius, daysRecency } = req.query;

    const users = await usersService.topSpenders({
        category: category? category as string : undefined,
        minOrders: minOrders ? parseInt(minOrders as string, 10) : undefined,
        lat: lat ? parseFloat(lat as string) : undefined,
        lng: lng ? parseFloat(lng as string) : undefined,
        radius: radius ? parseFloat(radius as string) : undefined,
        daysRecency: daysRecency ? parseInt(daysRecency as string, 10) : undefined,
      });

    // Respond with users data 
    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  }
);
