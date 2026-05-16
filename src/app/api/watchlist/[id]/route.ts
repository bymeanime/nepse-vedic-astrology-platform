import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'

// DELETE /api/watchlist/[id] - Delete a watchlist
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const watchlist = await db.watchlist.findUnique({ where: { id } })
    if (!watchlist) {
      return error('Watchlist not found', 404)
    }

    await db.watchlistItem.deleteMany({ where: { watchlistId: id } })
    await db.watchlist.delete({ where: { id } })

    return success({ message: 'Watchlist deleted' })
  } catch (err) {
    console.error('Watchlist DELETE error:', err)
    return error('Failed to delete watchlist', 500)
  }
}
