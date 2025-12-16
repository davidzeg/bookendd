import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ListsPage() {
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
        <h1 className="text-2xl font-semibold md:text-3xl">Lists</h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Lists are coming soon&mdash;think bookmarks, shelves, and curated reading trails.
        </p>

        <div className="mt-8 max-w-xl space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium">Rainy day reads</p>
            <p className="mt-1 text-xs text-muted-foreground">Placeholder list &middot; 12 books</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium">Modern classics</p>
            <p className="mt-1 text-xs text-muted-foreground">Placeholder list &middot; 8 books</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium">Tiny books, big feelings</p>
            <p className="mt-1 text-xs text-muted-foreground">Placeholder list &middot; 5 books</p>
          </div>
        </div>
      </main>
    </div>
  )
}
