'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sanitizeRedirect } from '@/lib/validation'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export type LoginState = {
  error?: string | null
  success?: boolean
}

export async function loginWithEmail(
  previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const rawRedirect = formData.get('redirectTo') as string

  // Sanitize redirect to prevent open redirect attacks
  const redirectTo = sanitizeRedirect(rawRedirect)

  if (!email || !password) {
    return {
      error: 'Email and password are required.',
    }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
      success: false,
    }
  }

  // Check if user has completed onboarding (has a profile in users table)
  if (data.user) {
    const profile = await db.query.users.findFirst({
      where: eq(users.id, data.user.id),
    })

    if (!profile) {
      redirect(`/onboarding?next=${encodeURIComponent(redirectTo)}`)
    }
  }

  redirect(redirectTo)
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
