// ============================================
// NEPSE Vedic Astrology Trading Platform
// Pages CMS API - List & Create
// GET  /api/pages         - List all pages
// POST /api/pages         - Create a new page
// ============================================

import { db } from '@/lib/db'
import { success, error, unauthorized } from '@/lib/api-response'
import { requireAuth } from '@/lib/auth-guard'
import { createPageSchema } from '@/lib/validations'
import type { ContentStatus } from '@/lib/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status') as ContentStatus | null

    const where = statusFilter ? { status: statusFilter } : {}

    const pages = await db.page.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return success(pages)
  } catch (err) {
    console.error('GET /api/pages error:', err)
    return error('Failed to fetch pages', 500)
  }
}

export async function POST(request: Request) {
  try {
    const { response, session } = await requireAuth()
    if (response) return response

    const body = await request.json()
    const parsed = createPageSchema.safeParse({
      ...body,
      authorId: session!.user.id,
    })

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const data = parsed.data

    // Check for duplicate slug
    const existing = await db.page.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return error('A page with this slug already exists', 409)
    }

    const page = await db.page.create({
      data: {
        slug: data.slug,
        title: data.title,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        status: data.status,
        authorId: data.authorId,
        featuredImage: data.featuredImage,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return success(page, 201)
  } catch (err) {
    console.error('POST /api/pages error:', err)
    return error('Failed to create page', 500)
  }
}
