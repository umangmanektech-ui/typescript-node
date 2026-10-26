import { Document } from 'mongoose';

export type ProductCategory =
  | 'Electronics'
  | 'Computers'
  | 'Accessories'
  | 'Audio'
  | 'Gaming'
  | 'Wearables'
  | 'Home & Kitchen'
  | 'Other';

export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface IProduct {
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  sku: string;
  status: ProductStatus;
  rating: number;
  tags: string[];
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductDocument extends IProduct, Document {
  id: string;
}
