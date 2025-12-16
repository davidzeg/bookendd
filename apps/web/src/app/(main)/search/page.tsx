import { Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SearchPageProps = {
  searchParams?: Promise<{ q?: string | string[] }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = (await searchParams) ?? {}
  const query = Array.isArray(resolved.q) ? resolved.q[0] : (resolved.q ?? '')

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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">Search</h1>
            <p className="mt-2 max-w-prose text-muted-foreground">
              Placeholder search page (real book search wired up later).
            </p>
          </div>
          <Button variant="outline" asChild className="self-start sm:self-auto">
            <Link href="/books">Browse books</Link>
          </Button>
        </div>

        <form action="/search" method="get" className="mt-6 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search books (title, author, ISBN)"
              className="pl-9 bg-background/50"
            />
          </div>
        </form>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholder results
              key={index}
              className="flex min-h-[10rem] flex-col rounded-lg border bg-card p-4"
            >
              <div className="h-3 w-3/4 rounded bg-foreground/10" />
              <div className="mt-2 h-2 w-2/3 rounded bg-foreground/10" />
              <div className="mt-auto pt-6 text-xs text-muted-foreground">Placeholder result</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
