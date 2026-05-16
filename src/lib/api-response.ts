// ============================================
// NEPSE Vedic Astrology Trading Platform
// Standardized API Response Helpers
// ============================================

/**
 * Returns a successful JSON response with standardized format.
 */
export function success<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status })
}

/**
 * Returns an error JSON response with standardized format.
 */
export function error(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}

/**
 * Returns a 404 Not Found error response.
 */
export function notFound(message = 'Resource not found') {
  return error(message, 404)
}

/**
 * Returns a 401 Unauthorized error response.
 */
export function unauthorized() {
  return error('Unauthorized', 401)
}

/**
 * Returns a 403 Forbidden error response.
 */
export function forbidden() {
  return error('Forbidden', 403)
}
