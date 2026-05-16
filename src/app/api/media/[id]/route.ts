import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { success, error, notFound } from '@/lib/api-response'

// DELETE /api/media/[id] - Delete a media file
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const media = await db.media.findUnique({ where: { id } })
    if (!media) {
      return notFound('Media not found')
    }

    await db.media.delete({ where: { id } })

    return success({ message: 'Media deleted' })
  } catch (err) {
    console.error('Media DELETE error:', err)
    return error('Failed to delete media', 500)
  }
}
