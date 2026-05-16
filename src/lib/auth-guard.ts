// ============================================
// NEPSE Vedic Astrology Trading Platform
// Authentication Guard Helpers
// ============================================

import { getAuthSession } from '@/lib/auth'
import type { UserRole } from '@/lib/types'
import { unauthorized, forbidden } from '@/lib/api-response'

/**
 * Requires the user to be authenticated.
 * Returns the session if valid, or a 401 response if not.
 */
export async function requireAuth() {
  const session = await getAuthSession()
  if (!session?.user) {
    return { response: unauthorized(), session: null }
  }
  return { response: null, session }
}

/**
 * Requires the authenticated user to have one of the specified roles.
 * Returns the session if valid, or a 401/403 response if not.
 */
export async function requireRole(...roles: UserRole[]) {
  const { response, session } = await requireAuth()
  if (response) {
    return { response, session: null }
  }

  if (!session?.user?.role) {
    return { response: forbidden(), session: null }
  }

  if (!roles.includes(session.user.role as UserRole)) {
    return { response: forbidden(), session: null }
  }

  return { response: null, session }
}
