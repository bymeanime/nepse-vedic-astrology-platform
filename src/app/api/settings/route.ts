// ============================================
// NEPSE Vedic Astrology Trading Platform
// Site Settings API - Get & Update
// GET /api/settings  - Get all settings (supports ?group=xxx filter)
// PUT /api/settings  - Update settings (admin only)
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'
import { requireRole } from '@/lib/auth-guard'
import { z } from 'zod'

const updateSettingsSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string().min(1),
      value: z.string().min(1),
    })
  ).min(1, 'At least one setting is required'),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const groupFilter = searchParams.get('group')

    const where = groupFilter ? { group: groupFilter } : {}

    const settings = await db.siteSettings.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    })

    // Group settings by group
    const grouped: Record<string, typeof settings> = {}
    for (const setting of settings) {
      const group = setting.group || 'general'
      if (!grouped[group]) grouped[group] = []
      grouped[group].push(setting)
    }

    return success(grouped)
  } catch (err) {
    console.error('GET /api/settings error:', err)
    return error('Failed to fetch settings', 500)
  }
}

export async function PUT(request: Request) {
  try {
    const { response } = await requireRole('ADMIN')
    if (response) return response

    const body = await request.json()
    const parsed = updateSettingsSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const { settings: settingsData } = parsed.data

    // Update each setting using upsert
    const results = await Promise.all(
      settingsData.map((setting) =>
        db.siteSettings.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: { key: setting.key, value: setting.value },
        })
      )
    )

    return success(results)
  } catch (err) {
    console.error('PUT /api/settings error:', err)
    return error('Failed to update settings', 500)
  }
}
