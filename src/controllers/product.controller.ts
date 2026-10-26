import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/product.model';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { PRODUCT_STATUS } from '../constants/categories';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const existingSku = await Product.findOne({ sku: req.body.sku.toUpperCase() });
    if (existingSku) {
      return errorResponse(res, {
        statusCode: 409,
        message: `Product with SKU "${req.body.sku}" already exists.`,
        errors: [{ field: 'sku', message: 'SKU must be unique' }]
      });
    }

    const product = new Product(req.body);
    await product.save();

    return successResponse(res, {
      statusCode: 201,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    if (search && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { sku: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && category.trim() !== '') {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) priceFilter.$gte = Number(minPrice);
      if (maxPrice !== undefined) priceFilter.$lte = Number(maxPrice);
      filter.price = priceFilter;
    }

    if (inStock !== undefined) {
      if (inStock === 'true') {
        filter.stock = { $gt: 0 };
      } else {
        filter.stock = 0;
      }
    }

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const sort: Record<string, 1 | -1> = {
      [String(sortBy)]: sortOrder === 'asc' ? 1 : -1
    };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return successResponse(res, {
      message: 'Products retrieved successfully',
      data: products,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, {
        statusCode: 404,
        message: `Product not found with ID "${id}"`
      });
    }

    return successResponse(res, {
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, {
        statusCode: 404,
        message: `Product not found with ID "${id}"`
      });
    }

    if (req.body.sku && req.body.sku.toUpperCase() !== product.sku) {
      const existingSku = await Product.findOne({ sku: req.body.sku.toUpperCase() });
      if (existingSku) {
        return errorResponse(res, {
          statusCode: 409,
          message: `Product with SKU "${req.body.sku}" already exists.`,
          errors: [{ field: 'sku', message: 'SKU must be unique' }]
        });
      }
    }

    Object.assign(product, req.body);

    if (req.body.stock !== undefined) {
      if (product.stock === 0) {
        product.status = PRODUCT_STATUS.OUT_OF_STOCK!;
      } else if (product.stock <= 5) {
        product.status = PRODUCT_STATUS.LOW_STOCK!;
      } else {
        product.status = PRODUCT_STATUS.IN_STOCK!;
      }
    }

    await product.save();

    return successResponse(res, {
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return errorResponse(res, {
        statusCode: 404,
        message: `Product not found with ID "${id}"`
      });
    }

    return successResponse(res, {
      message: `Product "${deletedProduct.title}" deleted successfully`,
      data: { id: deletedProduct.id, title: deletedProduct.title }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const [summaryStats, categoryBreakdown] = await Promise.all([
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            totalStock: { $sum: '$stock' }
          }
        }
      ]),
      Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            totalStock: { $sum: '$stock' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    const stats = summaryStats[0] || {
      totalProducts: 0,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      totalStock: 0
    };

    return successResponse(res, {
      message: 'Product statistics generated successfully',
      data: {
        summary: {
          totalProducts: stats.totalProducts,
          averagePrice: Number((stats.avgPrice || 0).toFixed(2)),
          minPrice: stats.minPrice || 0,
          maxPrice: stats.maxPrice || 0,
          totalInventoryStock: stats.totalStock || 0
        },
        byCategory: categoryBreakdown.map((item: { _id: string; count: number; avgPrice: number; totalStock: number }) => ({
          category: item._id,
          count: item.count,
          avgPrice: Number((item.avgPrice || 0).toFixed(2)),
          totalStock: item.totalStock
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
