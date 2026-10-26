import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductStats
} from '../controllers/product.controller';
import { validate } from '../middleware/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
  queryProductSchema,
  productIdSchema
} from '../validators/product.validator';

const router = Router();

// Analytics & Stats route
router.get('/analytics/stats', getProductStats);

// List & Create routes
router
  .route('/')
  .get(validate(queryProductSchema, 'query'), getAllProducts)
  .post(validate(createProductSchema, 'body'), createProduct);

// ID-specific routes
router
  .route('/:id')
  .get(validate(productIdSchema, 'params'), getProductById)
  .put(
    validate(productIdSchema, 'params'),
    validate(updateProductSchema, 'body'),
    updateProduct
  )
  .delete(validate(productIdSchema, 'params'), deleteProduct);

export default router;
