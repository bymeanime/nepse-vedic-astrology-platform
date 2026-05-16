// ============================================
// NEPSE Vedic Astrology Trading Platform
// Page by Slug API - Get, Update, Delete
// GET    /api/pages/[slug] - Get single page (public, published only)
// PUT    /api/pages/[slug] - Update page (editor+ only)
// DELETE /api/pages/[slug] - Delete page (admin only)
// ============================================

import { db } from '@/lib/db'
import { success, error, notFound, forbidden } from '@/lib/api-response'
import { requireRole } from '@/lib/auth-guard'
import { updatePageSchema } from '@/lib/validations'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const page = await db.page.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!page || page.status !== 'PUBLISHED') {
      return notFound('Page not found')
    }

    return success(page)
  } catch (err) {
    console.error('GET /api/pages/[slug] error:', err)
    return error('Failed to fetch page', 500)
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
    const parsed = updatePageSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const existing = await db.page.findUnique({ where: { slug } })
    if (!existing) {
      return notFound('Page not found')
    }

    const data = parsed.data

    // Check slug uniqueness if changing slug
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.page.findUnique({ where: { slug: data.slug } })
      if (slugExists) {
        return error('A page with this slug already exists', 409)
      }
    }

    const page = await db.page.update({
      where: { slug },
      data: {
        ...(data.slug && { slug: data.slug }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
        ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        ...(data.status && { status: data.status }),
        ...(data.featuredImage !== undefined && { featuredImage: data.featuredImage }),
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return success(page)
  } catch (err) {
    console.error('PUT /api/pages/[slug] error:', err)
    return error('Failed to update page', 500)
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

    const existing = await db.page.findUnique({ where: { slug } })
    if (!existing) {
      return notFound('Page not found')
    }

    await db.page.delete({ where: { slug } })

    return success({ message: 'Page deleted successfully' })
  } catch (err) {
    console.error('DELETE /api/pages/[slug] error:', err)
    return error('Failed to delete page', 500)
  }
}
