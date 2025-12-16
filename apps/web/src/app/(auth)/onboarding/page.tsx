import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { db } from '@/db'
import { createClient } from '@/lib/supabase/server'
import { OnboardingForm } from './onboarding-form'

export const metadata: Metadata = {
  title: 'Complete Your Profile | Bookendd',
  description: 'Set up your Bookendd profile',
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Complete your profile</h1>
        <p className="text-muted-foreground mt-2">
          Pick a username so people can find your shelves.
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <OnboardingForm />
      </Suspense>
    </>
  )
}
