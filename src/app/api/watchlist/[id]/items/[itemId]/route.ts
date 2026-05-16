import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'

// DELETE /api/watchlist/[id]/items/[itemId] - Remove stock from watchlist
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { itemId } = await params

    const item = await db.watchlistItem.findUnique({ where: { id: itemId } })
    if (!item) {
      return error('Item not found', 404)
    }

    await db.watchlistItem.delete({ where: { id: itemId } })

    return success({ message: 'Stock removed from watchlist' })
  } catch (err) {
    console.error('Watchlist item DELETE error:', err)
    return error('Failed to remove stock', 500)
  }
}
