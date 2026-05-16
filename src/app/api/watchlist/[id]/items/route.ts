import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'

// GET /api/watchlist/[id]/items - List stocks in a watchlist
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const items = await db.watchlistItem.findMany({
      where: { watchlistId: id },
      include: {
        stock: {
          include: {
            prices: {
              orderBy: { date: 'desc' },
              take: 2,
            },
          },
        },
      },
      orderBy: { id: 'asc' },
    })

    return success(items)
  } catch (err) {
    console.error('Watchlist items GET error:', err)
    return error('Failed to fetch watchlist items', 500)
  }
}

// POST /api/watchlist/[id]/items - Add a stock to watchlist
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { stockId } = body

    if (!stockId) {
      return error('Stock ID is required', 400)
    }

    const stock = await db.stock.findUnique({ where: { id: stockId } })
    if (!stock) {
      return error('Stock not found', 404)
    }

    const existing = await db.watchlistItem.findUnique({
      where: {
        watchlistId_stockId: {
          watchlistId: id,
          stockId,
        },
      },
    })

    if (existing) {
      return error('Stock is already in this watchlist', 409)
    }

    const item = await db.watchlistItem.create({
      data: {
        watchlistId: id,
        stockId,
      },
      include: {
        stock: {
          include: {
            prices: {
              orderBy: { date: 'desc' },
              take: 2,
            },
          },
        },
      },
    })

    return success(item, 201)
  } catch (err) {
    console.error('Watchlist item POST error:', err)
    return error('Failed to add stock to watchlist', 500)
  }
}
