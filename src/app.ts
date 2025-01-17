import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { AppError, swaggerSpec } from './common';
import { usersRouter } from './routes/users.router';
import { productsRouter } from './routes/products.router';

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Set security HTTP headers
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(compression());

// Limit the traffic => prevent DoS attacks
const limiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 60 minutes
  max: 10000, // Limit each IP to 300 requests per `window` (here, per 60 minutes)
  message: {
    message: 'Too many requests, try again in an hour',
    status: 'warning',
  },
});

// Apply the rate limiting middleware to API calls only
app.use('/api', limiter);

app.use(cors({ origin: true, credentials: true }));

// Just a testing middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  //   req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);

// Swagger
app.use('/api/v1/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Docs in JSON format
app.get('/docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
