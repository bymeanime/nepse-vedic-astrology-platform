// ============================================
// NEPSE Vedic Astrology Trading Platform
// Users API - List & Create
// GET  /api/users         - List all users (admin only)
// POST /api/users         - Create a new user
// ============================================

import { db } from '@/lib/db'
import { success, error, unauthorized, forbidden } from '@/lib/api-response'
import { requireAuth, requireRole } from '@/lib/auth-guard'
import { createUserSchema } from '@/lib/validations'
import type { UserRole } from '@/lib/types'

export async function GET(request: Request) {
  try {
    const { response, session } = await requireRole('ADMIN')
    if (response) return response

    const { searchParams } = new URL(request.url)
    const roleFilter = searchParams.get('role') as UserRole | null

    const where = roleFilter ? { role: roleFilter } : {}

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        birthDate: true,
        birthTime: true,
        birthPlace: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return success(users)
  } catch (err) {
    console.error('GET /api/users error:', err)
    return error('Failed to fetch users', 500)
  }
}

export async function POST(request: Request) {
  try {
    const { response } = await requireAuth()
    if (response) return response

    const body = await request.json()
    const parsed = createUserSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    const data = parsed.data

    // Check if user with this email already exists
    const existing = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      return error('A user with this email already exists', 409)
    }

    // TODO: Hash password with bcrypt in production
    const user = await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role ?? 'VIEWER',
        phone: data.phone,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        birthTime: data.birthTime,
        birthPlace: data.birthPlace,
        avatar: data.avatar,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        birthDate: true,
        birthTime: true,
        birthPlace: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return success(user, 201)
  } catch (err) {
    console.error('POST /api/users error:', err)
    return error('Failed to create user', 500)
  }
}
