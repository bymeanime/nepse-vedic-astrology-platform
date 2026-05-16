// ============================================
// NEPSE Vedic Astrology Trading Platform
// Activity Log API - List recent activity (admin only)
// GET /api/activity-log  - List recent activity logs
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'
import { requireRole } from '@/lib/auth-guard'

export async function GET(request: Request) {
  try {
    const { response } = await requireRole('ADMIN')
    if (response) return response

    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 500) : 50

    const logs = await db.activityLog.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return success(logs)
  } catch (err) {
    console.error('GET /api/activity-log error:', err)
    return error('Failed to fetch activity logs', 500)
  }
}
