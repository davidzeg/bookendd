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
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground mt-2">Save your shelves, lists, notes, and quotes.</p>
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
    </>
  )
}
