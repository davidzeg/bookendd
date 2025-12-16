import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Bookendd
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Create account</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold md:text-3xl">Members</h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Community features will live here: profiles, follows, clubs, and shared shelves.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Coming soon</p>
            <p className="mt-2 text-sm font-medium">Book clubs</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Vote on reads, discuss chapters, keep notes together.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Coming soon</p>
            <p className="mt-2 text-sm font-medium">Public shelves</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Share a list link that feels like lending a book.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
