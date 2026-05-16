// ============================================
// NEPSE Vedic Astrology Trading Platform
// Blog Categories API - List & Create
// GET  /api/categories  - List all categories with post count
// POST /api/categories  - Create category (editor+ only)
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'
import { requireRole } from '@/lib/auth-guard'
import { createBlogCategorySchema } from '@/lib/validations'

export async function GET() {
  try {
    const categories = await db.blogCategory.findMany({
      include: {
        _count: {
          select: { blogPosts: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      postCount: cat._count.blogPosts,
      _count: undefined,
    }))

    return success(categoriesWithCount)
  } catch (err) {
    console.error('GET /api/categories error:', err)
    return error('Failed to fetch categories', 500)
  }
}

export async function POST(request: Request) {
  try {
    const { response } = await requireRole('EDITOR', 'ADMIN')
    if (response) return response

    const body = await request.json()
    const parsed = createBlogCategorySchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const data = parsed.data

    // Check for duplicate slug
    const existing = await db.blogCategory.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return error('A category with this slug already exists', 409)
    }

    const category = await db.blogCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      },
    })

    return success(category, 201)
  } catch (err) {
    console.error('POST /api/categories error:', err)
    return error('Failed to create category', 500)
  }
}
