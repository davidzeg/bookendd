import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { OnboardingForm } from './onboarding-form'

export const metadata: Metadata = {
  title: 'Complete Your Profile | Bookendd',
  description: 'Set up your Bookendd profile',
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/login')
  }

  // If already has a profile, redirect to library
  const profile = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  })

  if (profile) {
    redirect('/library')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Bookendd</h1>
          <p className="text-muted-foreground mt-2">
            Let&apos;s set up your profile to get started.
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <OnboardingForm />
        </Suspense>
      </div>
    </div>
  )
}
