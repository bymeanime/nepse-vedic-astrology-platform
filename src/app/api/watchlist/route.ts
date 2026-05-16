import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'

// GET /api/watchlist - List all watchlists for current user
export async function GET() {
  try {
    const watchlists = await db.watchlist.findMany({
      where: { userId: '1' },
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return success(watchlists)
  } catch (err) {
    console.error('Watchlist GET error:', err)
    return error('Failed to fetch watchlists', 500)
  }
}

// POST /api/watchlist - Create a new watchlist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return error('Watchlist name is required', 400)
    }

    const watchlist = await db.watchlist.create({
      data: {
        name: name.trim(),
        userId: '1',
      },
      include: {
        _count: {
          select: { items: true },
        },
      },
    })

    return success(watchlist, 201)
  } catch (err) {
    console.error('Watchlist POST error:', err)
    return error('Failed to create watchlist', 500)
  }
}
