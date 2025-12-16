import { BookOpenText, Search } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background bookendd-desk">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="bookendd-spread min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-7rem)] flex flex-col">
          <div aria-hidden className="bookendd-bookmark" />

          <header className="bookendd-header">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-semibold tracking-tight"
              >
                <BookOpenText className="h-5 w-5 text-primary" />
                <span className="text-lg">Bookendd</span>
              </Link>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                Turn the page, keep the notes.
              </span>
            </div>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <Link
                href="/books"
                className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Books
              </Link>
              <Link
                href="/lists"
                className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Lists
              </Link>
              <Link
                href="/members"
                className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Members
              </Link>
            </nav>

            <form action="/search" method="get" className="relative w-full sm:w-[18rem]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                type="search"
                placeholder="Search books"
                className="pl-9 bg-background/50"
              />
            </form>
          </header>

          <main className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm space-y-6 py-10 md:py-14">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
