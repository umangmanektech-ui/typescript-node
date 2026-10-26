import mongoose, { Schema } from 'mongoose';
import { PRODUCT_CATEGORIES, PRODUCT_STATUS } from '../constants/categories';
import { IProductDocument } from '../types/product';

const productSchema = new Schema<IProductDocument>(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: PRODUCT_CATEGORIES,
        message: '{VALUE} is not a supported category'
      }
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    sku: {
      type: String,
      required: [true, 'SKU (Stock Keeping Unit) is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.IN_STOCK
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0
    },
    tags: {
      type: [String],
      default: []
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Search and compound indexes
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });

// Automatically compute product stock status before saving
productSchema.pre('save', function () {
  if (this.stock === 0) {
    this.status = PRODUCT_STATUS.OUT_OF_STOCK!;
  } else if (this.stock <= 5) {
    this.status = PRODUCT_STATUS.LOW_STOCK!;
  } else {
    this.status = PRODUCT_STATUS.IN_STOCK!;
  }
});

export const Product = mongoose.model<IProductDocument>('Product', productSchema);
