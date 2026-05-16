// ============================================
// NEPSE Vedic Astrology Trading Platform
// Blog Post by Slug API - Get, Update, Delete
// GET    /api/blog/[slug] - Get single post (public, published only, increments viewCount)
// PUT    /api/blog/[slug] - Update post (editor+ only)
// DELETE /api/blog/[slug] - Delete post (admin only)
// ============================================

import { db } from '@/lib/db'
import { success, error, notFound } from '@/lib/api-response'
import { requireRole } from '@/lib/auth-guard'
import { updateBlogPostSchema } from '@/lib/validations'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const post = await db.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    if (!post || post.status !== 'PUBLISHED') {
      return notFound('Blog post not found')
    }

    // Increment view count
    await db.blogPost.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    })

    return success({ ...post, viewCount: post.viewCount + 1 })
  } catch (err) {
    console.error('GET /api/blog/[slug] error:', err)
    return error('Failed to fetch blog post', 500)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { response } = await requireRole('EDITOR', 'ADMIN')
    if (response) return response

    const { slug } = await params
    const body = await request.json()
    const parsed = updateBlogPostSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const existing = await db.blogPost.findUnique({ where: { slug } })
    if (!existing) {
      return notFound('Blog post not found')
    }

    const data = parsed.data

    // Check slug uniqueness if changing slug
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.blogPost.findUnique({ where: { slug: data.slug } })
      if (slugExists) {
        return error('A blog post with this slug already exists', 409)
      }
    }

    // Validate category if provided
    if (data.categoryId) {
      const category = await db.blogCategory.findUnique({ where: { id: data.categoryId } })
      if (!category) {
        return error('Category not found', 400)
      }
    }

    const post = await db.blogPost.update({
      where: { slug },
      data: {
        ...(data.slug && { slug: data.slug }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.status && { status: data.status }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.featuredImage !== undefined && { featuredImage: data.featuredImage }),
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

    return success(post)
  } catch (err) {
    console.error('PUT /api/blog/[slug] error:', err)
    return error('Failed to update blog post', 500)
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { response } = await requireRole('ADMIN')
    if (response) return response

    const { slug } = await params

    const existing = await db.blogPost.findUnique({ where: { slug } })
    if (!existing) {
      return notFound('Blog post not found')
    }

    await db.blogPost.delete({ where: { slug } })

    return success({ message: 'Blog post deleted successfully' })
  } catch (err) {
    console.error('DELETE /api/blog/[slug] error:', err)
    return error('Failed to delete blog post', 500)
  }
}
