import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Sanitize string input
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove potential XSS patterns
  let sanitized = input
    .trim()
    .substring(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
  
  return sanitized;
}

// Sanitize phone number
export function sanitizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '').substring(0, 20);
}

// Sanitize email
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  return email.toLowerCase().trim().substring(0, 100);
}

// Order validation schema
export const orderValidationSchema = Joi.object({
  customerName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^(\+?88)?01[0-9]{9}$/).required(),
  altPhone: Joi.string().pattern(/^(\+?88)?01[0-9]{9}$/).optional().allow(''),
  email: Joi.string().email().max(100).optional().allow(''),
  deliveryZone: Joi.string().valid('inside-dhaka', 'sub-dhaka', 'outside-dhaka').required(),
  address: Joi.string().min(10).max(500).required(),
  city: Joi.string().min(2).max(100).required(),
  postalCode: Joi.string().max(20).optional().allow(''),
  orderNotes: Joi.string().max(500).optional().allow(''),
  paymentMethod: Joi.string().valid('cod', 'bkash', 'nagad', 'rocket', 'card').required(),
  transactionId: Joi.string().max(50).optional().allow(''),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).max(100).required()
    })
  ).min(1).required()
});

// Product validation schema
export const productValidationSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  banglaName: Joi.string().min(1).max(200).required(),
  category: Joi.string().required(),
  tagline: Joi.string().max(500).required(),
  banglaTagline: Joi.string().max(500).required(),
  description: Joi.string().max(2000).required(),
  banglaDescription: Joi.string().max(2000).required(),
  imageUrl: Joi.string().uri().max(500).required(),
  price: Joi.number().min(0).max(100000).required(),
  stock: Joi.number().integer().min(0).max(100000).required(),
  variants: Joi.array().items(
    Joi.object({
      size: Joi.string().required(),
      price: Joi.number().min(0).required(),
      stock: Joi.number().integer().min(0).required()
    })
  ).min(1).required()
});

// Coupon validation schema
export const couponValidationSchema = Joi.object({
  code: Joi.string().min(3).max(50).pattern(/^[A-Z0-9]+$/).required(),
  discountType: Joi.string().valid('percentage', 'fixed').required(),
  discountValue: Joi.number().min(0).max(100000).required(),
  minOrderAmount: Joi.number().min(0).max(1000000).required(),
  description: Joi.string().max(500).required(),
  expiryDate: Joi.string().isoDate().optional().allow(''),
});

// Review validation schema
export const reviewValidationSchema = Joi.object({
  userName: Joi.string().min(2).max(100).required(),
  userCity: Joi.string().min(2).max(100).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().min(5).max(1000).required(),
  productName: Joi.string().max(200).optional().allow('')
});

// Validation middleware factory
export function validateRequest(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
}

// Search query sanitization
export function sanitizeSearchQuery(req: Request, res: Response, next: NextFunction) {
  if (req.query.search && typeof req.query.search === 'string') {
    req.query.search = sanitizeString(req.query.search, 100);
  }
  next();
}
