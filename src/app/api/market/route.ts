// ============================================
// NEPSE Vedic Astrology Trading Platform
// Market Data API - List & Create/Update indices
// GET  /api/market  - Get latest market indices (NEPSE, Sensitive, Float)
// POST /api/market  - Create/update market index data (admin only)
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'
import { requireRole } from '@/lib/auth-guard'
import { z } from 'zod'

const createMarketIndexSchema = z.object({
  name: z.string().min(1, 'Index name is required'),
  value: z.number(),
  change: z.number().default(0),
  changePercent: z.number().default(0),
  volume: z.number().default(0),
})

export async function GET() {
  try {
    // Get the latest entry for each index name
    const indices = await db.marketIndex.findMany({
      orderBy: { date: 'desc' },
      distinct: ['name'],
    })

    return success(indices)
  } catch (err) {
    console.error('GET /api/market error:', err)
    return error('Failed to fetch market data', 500)
  }
}

export async function POST(request: Request) {
  try {
    const { response } = await requireRole('ADMIN')
    if (response) return response

    const body = await request.json()
    const parsed = createMarketIndexSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const data = parsed.data

    const index = await db.marketIndex.create({
      data: {
        name: data.name,
        value: data.value,
        change: data.change,
        changePercent: data.changePercent,
        volume: data.volume,
      },
    })

    return success(index, 201)
  } catch (err) {
    console.error('POST /api/market error:', err)
    return error('Failed to create market index', 500)
  }
}
