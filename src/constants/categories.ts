import { ProductCategory, ProductStatus } from '../types/product';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Computers',
  'Accessories',
  'Audio',
  'Gaming',
  'Wearables',
  'Home & Kitchen',
  'Other'
];

export const PRODUCT_STATUS: Record<string, ProductStatus> = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock'
};
