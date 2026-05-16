// ============================================
// NEPSE Vedic Astrology Trading Platform
// User by ID API - Get, Update, Delete
// GET    /api/users/[id] - Get single user
// PUT    /api/users/[id] - Update user
// DELETE /api/users/[id] - Delete user (admin only)
// ============================================

import { db } from '@/lib/db'
import { success, error, notFound, forbidden } from '@/lib/api-response'
import { requireAuth, requireRole } from '@/lib/auth-guard'
import { updateUserSchema } from '@/lib/validations'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { response } = await requireAuth()
    if (response) return response

    const { id } = await params

    const user = await db.user.findUnique({
      where: { id },
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

    if (!user) {
      return notFound('User not found')
    }

    return success(user)
  } catch (err) {
    console.error('GET /api/users/[id] error:', err)
    return error('Failed to fetch user', 500)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { response, session } = await requireAuth()
    if (response) return response

    const { id } = await params
    const body = await request.json()
    const parsed = updateUserSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues.map((e) => e.message).join(', '))
    }

    // Only allow users to update their own profile, unless admin
    if (session!.user.id !== id) {
      const adminCheck = await requireRole('ADMIN')
      if (adminCheck.response) return adminCheck.response
    }

    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) {
      return notFound('User not found')
    }

    const data = parsed.data

    // Check email uniqueness if changing email
    if (data.email && data.email !== existing.email) {
      const emailExists = await db.user.findUnique({ where: { email: data.email } })
      if (emailExists) {
        return error('A user with this email already exists', 409)
      }
    }

    const user = await db.user.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.password && { password: data.password }),
        ...(data.role && { role: data.role }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.birthDate !== undefined && { birthDate: data.birthDate ? new Date(data.birthDate) : null }),
        ...(data.birthTime !== undefined && { birthTime: data.birthTime }),
        ...(data.birthPlace !== undefined && { birthPlace: data.birthPlace }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
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

    return success(user)
  } catch (err) {
    console.error('PUT /api/users/[id] error:', err)
    return error('Failed to update user', 500)
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { response } = await requireRole('ADMIN')
    if (response) return response

    const { id } = await params

    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) {
      return notFound('User not found')
    }

    await db.user.delete({ where: { id } })

    return success({ message: 'User deleted successfully' })
  } catch (err) {
    console.error('DELETE /api/users/[id] error:', err)
    return error('Failed to delete user', 500)
  }
}
