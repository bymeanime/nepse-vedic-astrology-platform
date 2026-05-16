// ============================================
// NEPSE Vedic Astrology Trading Platform
// Vedic Events API - List & Create
// GET  /api/vedic-events  - List all vedic events
// POST /api/vedic-events  - Create vedic event (editor+ only)
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'
import { requireRole } from '@/lib/auth-guard'
import { createVedicEventSchema } from '@/lib/validations'
import type { VedicEventType, MarketImpact } from '@/lib/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const typeFilter = searchParams.get('type') as VedicEventType | null
    const impactFilter = searchParams.get('impact') as MarketImpact | null

    const where: Record<string, unknown> = {}
    if (typeFilter) where.eventType = typeFilter
    if (impactFilter) where.marketImpact = impactFilter

    const events = await db.vedicEvent.findMany({
      where,
      orderBy: { startDate: 'desc' },
    })

    return success(events)
  } catch (err) {
    console.error('GET /api/vedic-events error:', err)
    return error('Failed to fetch vedic events', 500)
  }
}

export async function POST(request: Request) {
  try {
    const { response } = await requireRole('EDITOR', 'ADMIN')
    if (response) return response

    const body = await request.json()
    const parsed = createVedicEventSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const data = parsed.data

    const event = await db.vedicEvent.create({
      data: {
        name: data.name,
        eventType: data.eventType,
        planet: data.planet,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
        marketImpact: data.marketImpact,
        impactStrength: data.impactStrength,
      },
    })

    return success(event, 201)
  } catch (err) {
    console.error('POST /api/vedic-events error:', err)
    return error('Failed to create vedic event', 500)
  }
}
