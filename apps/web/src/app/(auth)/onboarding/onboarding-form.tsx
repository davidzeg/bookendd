'use client'

import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { completeOnboarding } from './actions'

type OnboardingState = {
  error: string | null
  success: boolean
}

export function OnboardingForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('next') || '/library'

  const [state, formAction] = useActionState<OnboardingState, FormData>(
    async (previousState, formData) => {
      formData.append('redirectTo', redirectTo)
      return completeOnboarding(previousState, formData)
    },
    { error: null, success: false },
  )

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="your_username"
          required
          autoComplete="username"
          pattern="[a-z0-9_]+"
          minLength={3}
          maxLength={50}
        />
        <p className="text-xs text-muted-foreground">
          Lowercase letters, numbers, and underscores only
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name (optional)</Label>
        <Input
          id="displayName"
          name="displayName"
          type="text"
          placeholder="Your Name"
          maxLength={100}
        />
      </div>

      {state.error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">
          {state.error}
        </div>
      )}

      <SubmitButton className="w-full">Complete Setup</SubmitButton>
    </form>
  )
}
