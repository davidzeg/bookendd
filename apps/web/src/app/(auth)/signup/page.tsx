import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { SignupForm } from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Up | Bookendd',
  description: 'Create your Bookendd account',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bookendd</h1>
          <p className="text-muted-foreground mt-2">
            Create an account to start tracking your reads.
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <SignupForm />
        </Suspense>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
