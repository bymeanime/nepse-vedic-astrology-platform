// ============================================
// NEPSE Vedic Astrology Trading Platform
// Stocks API - List & Add
// GET  /api/stocks  - List all stocks with latest prices
// POST /api/stocks  - Add new stock (admin only)
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'
import { requireRole } from '@/lib/auth-guard'
import { z } from 'zod'

const createStockSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').max(20, 'Symbol must be 20 characters or less'),
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  sector: z.string().max(100).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  isActive: z.boolean().default(true),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sectorFilter = searchParams.get('sector')

    const where = sectorFilter ? { sector: sectorFilter } : {}

    const stocks = await db.stock.findMany({
      where,
      include: {
        prices: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
      orderBy: { symbol: 'asc' },
    })

    return success(stocks)
  } catch (err) {
    console.error('GET /api/stocks error:', err)
    return error('Failed to fetch stocks', 500)
  }
}

export async function POST(request: Request) {
  try {
    const { response } = await requireRole('ADMIN')
    if (response) return response

    const body = await request.json()
    const parsed = createStockSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const data = parsed.data

    // Check for duplicate symbol
    const existing = await db.stock.findUnique({ where: { symbol: data.symbol } })
    if (existing) {
      return error('A stock with this symbol already exists', 409)
    }

    const stock = await db.stock.create({
      data: {
        symbol: data.symbol,
        name: data.name,
        sector: data.sector,
        description: data.description,
        isActive: data.isActive,
      },
    })

    return success(stock, 201)
  } catch (err) {
    console.error('POST /api/stocks error:', err)
    return error('Failed to create stock', 500)
  }
}
