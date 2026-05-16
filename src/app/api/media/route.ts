import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'

// GET /api/media - List all media files
export async function GET() {
  try {
    const media = await db.media.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return success(media)
  } catch (err) {
    console.error('Media GET error:', err)
    return error('Failed to fetch media', 500)
  }
}

// POST /api/media - Upload a file
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const alt = formData.get('alt') as string | null

    if (!file) {
      return error('No file provided', 400)
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return error('File size must be less than 10MB', 400)
    }

    // Read file as base64 for storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    const media = await db.media.create({
      data: {
        filename: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: dataUrl,
        alt: alt || file.name,
        uploadedBy: '1',
      },
    })

    return success(media, 201)
  } catch (err) {
    console.error('Media POST error:', err)
    return error('Failed to upload file', 500)
  }
}
