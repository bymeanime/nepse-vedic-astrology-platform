// ============================================
// NEPSE Vedic Astrology Trading Platform
// Zod Validation Schemas
// ============================================

import { z } from 'zod'

// --- Reusable field schemas ---

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(255, 'Email must be 255 characters or less')
  .email('Invalid email address')

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be 128 characters or less')

const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or less')

const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(200, 'Slug must be 200 characters or less')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')

const titleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(255, 'Title must be 255 characters or less')

// --- User Schemas ---

export const createUserSchema = z.object({
  email: emailSchema,
  name: nameSchema.optional(),
  password: passwordSchema,
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).default('VIEWER'),
  phone: z.string().max(20, 'Phone must be 20 characters or less').optional(),
  birthDate: z.string().datetime().optional().nullable(),
  birthTime: z.string().max(10).optional().nullable(),
  birthPlace: z.string().max(200).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
})

export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  name: nameSchema.optional(),
  password: passwordSchema.optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
  phone: z.string().max(20, 'Phone must be 20 characters or less').optional().nullable(),
  birthDate: z.string().datetime().optional().nullable(),
  birthTime: z.string().max(10).optional().nullable(),
  birthPlace: z.string().max(200).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// --- Page Schemas ---

export const createPageSchema = z.object({
  slug: slugSchema,
  title: titleSchema,
  content: z.string().default(''),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(500, 'Meta description must be 500 characters or less').optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  authorId: z.string().min(1, 'Author ID is required'),
  featuredImage: z.string().url().optional().nullable(),
})

export const updatePageSchema = z.object({
  slug: slugSchema.optional(),
  title: titleSchema.optional(),
  content: z.string().optional(),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(500, 'Meta description must be 500 characters or less').optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  featuredImage: z.string().url().optional().nullable(),
})

// --- Blog Post Schemas ---

export const createBlogPostSchema = z.object({
  slug: slugSchema,
  title: titleSchema,
  excerpt: z.string().max(500, 'Excerpt must be 500 characters or less').default(''),
  content: z.string().default(''),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  categoryId: z.string().optional().nullable(),
  authorId: z.string().min(1, 'Author ID is required'),
  featuredImage: z.string().url().optional().nullable(),
})

export const updateBlogPostSchema = z.object({
  slug: slugSchema.optional(),
  title: titleSchema.optional(),
  excerpt: z.string().max(500, 'Excerpt must be 500 characters or less').optional(),
  content: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  categoryId: z.string().optional().nullable(),
  featuredImage: z.string().url().optional().nullable(),
})

// --- Blog Category Schema ---

export const createBlogCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be 100 characters or less'),
  slug: slugSchema,
  description: z.string().max(500).optional().nullable(),
})

// --- Vedic Event Schemas ---

export const createVedicEventSchema = z.object({
  name: titleSchema,
  eventType: z.enum(['ECLIPSE', 'RETROGRADE', 'TRANSIT', 'CONJUNCTION']),
  planet: z.string().max(50).optional().nullable(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  marketImpact: z.enum(['BULLISH', 'BEARISH', 'NEUTRAL']).default('NEUTRAL'),
  impactStrength: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
})

export const updateVedicEventSchema = z.object({
  name: titleSchema.optional(),
  eventType: z.enum(['ECLIPSE', 'RETROGRADE', 'TRANSIT', 'CONJUNCTION']).optional(),
  planet: z.string().max(50).optional().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  marketImpact: z.enum(['BULLISH', 'BEARISH', 'NEUTRAL']).optional(),
  impactStrength: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
})

// --- Market Prediction Schema ---

export const createMarketPredictionSchema = z.object({
  vedicEventId: z.string().min(1, 'Vedic event ID is required'),
  stockId: z.string().optional().nullable(),
  predictionType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  prediction: z.enum(['BULLISH', 'BEARISH', 'NEUTRAL']),
  confidence: z
    .number()
    .int('Confidence must be a whole number')
    .min(0, 'Confidence must be at least 0')
    .max(100, 'Confidence must be at most 100')
    .default(50),
  reasoning: z.string().max(2000, 'Reasoning must be 2000 characters or less').optional().nullable(),
  targetDate: z.string().min(1, 'Target date is required'),
})

// --- Site Settings Schemas ---

export const createSiteSettingSchema = z.object({
  key: z
    .string()
    .min(1, 'Key is required')
    .max(200, 'Key must be 200 characters or less')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Key must be alphanumeric with dots, hyphens, or underscores'),
  value: z.string().min(1, 'Value is required'),
  type: z.enum(['STRING', 'NUMBER', 'JSON', 'BOOLEAN']).default('STRING'),
  group: z.string().max(100).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
})

export const updateSiteSettingSchema = z.object({
  value: z.string().min(1, 'Value is required').optional(),
  type: z.enum(['STRING', 'NUMBER', 'JSON', 'BOOLEAN']).optional(),
  group: z.string().max(100).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
})

// --- Type Inference Helpers ---

export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
export type LoginData = z.infer<typeof loginSchema>
export type CreatePageData = z.infer<typeof createPageSchema>
export type UpdatePageData = z.infer<typeof updatePageSchema>
export type CreateBlogPostData = z.infer<typeof createBlogPostSchema>
export type UpdateBlogPostData = z.infer<typeof updateBlogPostSchema>
export type CreateBlogCategoryData = z.infer<typeof createBlogCategorySchema>
export type CreateVedicEventData = z.infer<typeof createVedicEventSchema>
export type UpdateVedicEventData = z.infer<typeof updateVedicEventSchema>
export type CreateMarketPredictionData = z.infer<typeof createMarketPredictionSchema>
export type CreateSiteSettingData = z.infer<typeof createSiteSettingSchema>
export type UpdateSiteSettingData = z.infer<typeof updateSiteSettingSchema>
