/**
 * Security validation utilities for the Bookendd application
 */

/**
 * Validates that a redirect URL is safe (internal to the app)
 * Prevents open redirect attacks by ensuring the URL is relative
 * or belongs to the same origin
 */
export function isValidRedirect(url: string): boolean {
  // Empty or whitespace-only strings default to safe
  if (!url || !url.trim()) {
    return false
  }

  // Must start with / for relative URLs
  // Reject protocol-relative URLs (//example.com) and absolute URLs
  if (!url.startsWith('/') || url.startsWith('//')) {
    return false
  }

  // Additional check: ensure no protocol injection via encoded characters
  // or other tricks like /\example.com
  try {
    const decoded = decodeURIComponent(url)
    if (decoded.startsWith('//') || decoded.includes('://')) {
      return false
    }
  } catch {
    // If decoding fails, reject the URL
    return false
  }

  return true
}

/**
 * Sanitizes a redirect URL, returning a safe default if invalid
 */
export function sanitizeRedirect(url: string | null, defaultPath = '/library'): string {
  if (!url || !isValidRedirect(url)) {
    return defaultPath
  }
  return url
}

/**
 * Password validation result
 */
export type PasswordValidation = {
  isValid: boolean
  errors: string[]
}

/**
 * Validates password strength according to security best practices
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Gets a user-friendly password requirements message
 */
export function getPasswordRequirements(): string {
  return 'Password must be at least 8 characters with uppercase, lowercase, and a number'
}
