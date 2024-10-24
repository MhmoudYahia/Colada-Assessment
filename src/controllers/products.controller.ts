import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../common';
import { productsService } from '../services/products.service';

export const demandAnalysis = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate, lat, lng, radius, daysRecency } = req.query;

    const products = await productsService.demandAnalysis({
      startDate: startDate ? (startDate as string) : undefined,
      endDate: endDate ? (endDate as string) : undefined,
      lat: lat ? parseFloat(lat as string) : undefined,
      lng: lng ? parseFloat(lng as string) : undefined,
      radius: radius ? parseFloat(radius as string) : undefined,
      daysRecency: daysRecency
        ? parseInt(daysRecency as string, 10)
        : undefined,
    });

    if (products.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No products found',
      });
    }
    // Respond with users data
    res.status(201).json({
      status: 'success',
      data: {
        products,
      },
    });
  }
);
