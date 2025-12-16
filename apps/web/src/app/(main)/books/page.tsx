import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BooksPage() {
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
        <h1 className="text-2xl font-semibold md:text-3xl">Books</h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          This page will become a browsable catalog. For now it&apos;s a placeholder so the landing
          navigation has somewhere to go.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholder content
              key={index}
              className="flex min-h-[10rem] flex-col rounded-lg border bg-card p-4"
            >
              <div className="h-3 w-3/4 rounded bg-foreground/10" />
              <div className="mt-2 h-2 w-2/3 rounded bg-foreground/10" />
              <div className="mt-auto pt-6 text-xs text-muted-foreground">Placeholder book</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
