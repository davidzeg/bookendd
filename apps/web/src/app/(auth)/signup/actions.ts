'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sanitizeRedirect, validatePassword } from '@/lib/validation'

type SignupState = {
  error: string | null
  success: boolean
  message?: string
}

export async function signupWithEmail(
  previousState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const rawRedirect = formData.get('redirectTo') as string

  // Sanitize redirect to prevent open redirect attacks
  const redirectTo = sanitizeRedirect(rawRedirect)

  // Validation
  if (!email || !password || !confirmPassword) {
    return {
      error: 'All fields are required',
      success: false,
    }
  }

  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match',
      success: false,
    }
  }

  // Stronger password validation
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    return {
      error: passwordValidation.errors[0],
      success: false,
    }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  })

  if (error) {
    return {
      error: error.message,
      success: false,
    }
  }

  // Supabase sends a confirmation email by default
  // Return success message instead of redirecting
  return {
    error: null,
    success: true,
    message: 'Check your email for a confirmation link to complete your registration.',
  }
}

export async function loginWithOAuth(provider: 'google' | 'github', redirectTo: string) {
  const supabase = await createClient()

  // Sanitize redirect to prevent open redirect attacks
  const safeRedirect = sanitizeRedirect(redirectTo)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(safeRedirect)}`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data.url) {
    redirect(data.url)
  }
}
