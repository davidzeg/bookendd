import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Login | Bookendd',
  description: 'Sign in to your Bookendd account',
}

export default function LoginPage() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Pick up where you left off.</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary hover:underline">
          Create one
        </Link>
      </p>
    </>
  )
}
