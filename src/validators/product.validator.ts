import Joi from 'joi';
import { PRODUCT_CATEGORIES } from '../constants/categories';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const productIdSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required().messages({
    'string.pattern.base': 'Invalid Product ID format. Must be a valid 24-character hexadecimal ObjectId.'
  })
});

export const createProductSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required().messages({
    'string.empty': 'Product title is required',
    'string.min': 'Title must be at least 2 characters',
    'string.max': 'Title cannot exceed 120 characters'
  }),
  description: Joi.string().trim().min(5).max(2000).required().messages({
    'string.empty': 'Product description is required',
    'string.min': 'Description must be at least 5 characters',
    'string.max': 'Description cannot exceed 2000 characters'
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Price must be a valid number',
    'number.positive': 'Price must be greater than zero'
  }),
  category: Joi.string().valid(...PRODUCT_CATEGORIES).required().messages({
    'any.only': `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`
  }),
  stock: Joi.number().integer().min(0).default(0),
  sku: Joi.string().trim().uppercase().min(3).max(30).required().messages({
    'string.empty': 'SKU is required'
  }),
  rating: Joi.number().min(0).max(5).default(0),
  tags: Joi.array().items(Joi.string().trim().lowercase()).default([]),
  isFeatured: Joi.boolean().default(false)
});

export const updateProductSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120),
  description: Joi.string().trim().min(5).max(2000),
  price: Joi.number().positive().precision(2),
  category: Joi.string().valid(...PRODUCT_CATEGORIES),
  stock: Joi.number().integer().min(0),
  sku: Joi.string().trim().uppercase().min(3).max(30),
  rating: Joi.number().min(0).max(5),
  tags: Joi.array().items(Joi.string().trim().lowercase()),
  isFeatured: Joi.boolean()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const queryProductSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(''),
  category: Joi.string().valid(...PRODUCT_CATEGORIES, '').allow(''),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  inStock: Joi.boolean(),
  sortBy: Joi.string().valid('createdAt', 'price', 'title', 'stock', 'rating').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});
