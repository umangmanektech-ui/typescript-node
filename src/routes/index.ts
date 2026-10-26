import { Router, Request, Response } from 'express';
import productRoutes from './product.routes';

const apiRouter = Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

apiRouter.use('/products', productRoutes);

export default apiRouter;
