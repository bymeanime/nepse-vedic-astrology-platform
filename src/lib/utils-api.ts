// ============================================
// NEPSE Vedic Astrology Trading Platform
// API Utility Functions
// ============================================

import { type UserRole, ROLE_PERMISSIONS } from './types'

/**
 * Converts text to a URL-safe slug.
 * Strips special characters, lowercases, and joins words with hyphens.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars except hyphens
    .replace(/--+/g, '-')           // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')             // Trim hyphens from start
    .replace(/-+$/, '')             // Trim hyphens from end
}

/**
 * Formats a number as Nepalese Rupee (NPR) currency.
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return formatted
}

/**
 * Formats a number with comma separators.
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Returns the list of permission strings for a given role.
 */
export function getRolePermissions(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] ?? []
}

/**
 * Checks if any of the user's roles grant access to the required roles.
 * Returns true if at least one user role has all permissions that any required role has.
 */
export function canAccess(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
  if (userRoles.length === 0 || requiredRoles.length === 0) {
    return false
  }

  // Collect all permissions from all user roles
  const userPermissions = new Set<string>()
  for (const role of userRoles) {
    const perms = ROLE_PERMISSIONS[role]
    if (perms) {
      for (const p of perms) {
        userPermissions.add(p)
      }
    }
  }

  // Collect all permissions from required roles
  const requiredPermissions = new Set<string>()
  for (const role of requiredRoles) {
    const perms = ROLE_PERMISSIONS[role]
    if (perms) {
      for (const p of perms) {
        requiredPermissions.add(p)
      }
    }
  }

  // Check if user has all required permissions
  for (const perm of requiredPermissions) {
    if (!userPermissions.has(perm)) {
      return false
    }
  }

  return true
}

/**
 * Checks if a specific user role grants a specific permission.
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/**
 * Formats a percentage change with sign (+/-) and 2 decimal places.
 */
export function formatPercentChange(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Truncates a string to a given length and appends ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Formats a date as a human-readable relative time string (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)

  if (diffSeconds < 60) return 'just now'

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays}d ago`

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths}mo ago`

  const diffYears = Math.floor(diffMonths / 12)
  return `${diffYears}y ago`
}
