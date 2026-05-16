// ============================================
// NEPSE Vedic Astrology Trading Platform
// Blog Posts API - List & Create
// GET  /api/blog         - List all blog posts
// POST /api/blog         - Create a new blog post
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'
import { requireAuth } from '@/lib/auth-guard'
import { createBlogPostSchema } from '@/lib/validations'
import type { ContentStatus } from '@/lib/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status') as ContentStatus | null
    const categoryIdFilter = searchParams.get('categoryId')

    const where: Record<string, unknown> = {}
    if (statusFilter) where.status = statusFilter
    if (categoryIdFilter) where.categoryId = categoryIdFilter

    const posts = await db.blogPost.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return success(posts)
  } catch (err) {
    console.error('GET /api/blog error:', err)
    return error('Failed to fetch blog posts', 500)
  }
}

export async function POST(request: Request) {
  try {
    const { response, session } = await requireAuth()
    if (response) return response

    const body = await request.json()
    const parsed = createBlogPostSchema.safeParse({
      ...body,
      authorId: session!.user.id,
    })

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const data = parsed.data

    // Check for duplicate slug
    const existing = await db.blogPost.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return error('A blog post with this slug already exists', 409)
    }

    // Validate category if provided
    if (data.categoryId) {
      const category = await db.blogCategory.findUnique({ where: { id: data.categoryId } })
      if (!category) {
        return error('Category not found', 400)
      }
    }

    const post = await db.blogPost.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        categoryId: data.categoryId,
        authorId: data.authorId,
        featuredImage: data.featuredImage,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    return success(post, 201)
  } catch (err) {
    console.error('POST /api/blog error:', err)
    return error('Failed to create blog post', 500)
  }
}
