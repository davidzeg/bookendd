import { BookOpenText, Quote, Search, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Home() {
  return (
    <div className="min-h-screen bg-background bookendd-desk">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="bookendd-spread">
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
                A reading ledger that feels like paper.
              </span>
            </div>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <NavLink href="/books">Books</NavLink>
              <NavLink href="/lists">Lists</NavLink>
              <NavLink href="/members">Members</NavLink>
            </nav>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <form action="/search" method="get" className="relative w-full sm:w-[18rem]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  type="search"
                  placeholder="Search books (title, author, ISBN)"
                  className="pl-9 bg-background/50"
                />
              </form>
              <div className="flex items-center gap-2 justify-end">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Create account</Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="mt-10 md:mt-14">
            <section className="text-center">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Built for readers
              </p>
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-balance">
                Keep your reading life
                <span className="bookendd-ink-fade"> beautifully organized</span>.
              </h1>
              <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Track books, build lists, and share what you&apos;re into—without the noise.
                Bookendd is a quiet place that reads like a page in a book.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Search and browse without an account. Create one when you want to save your shelves.
              </p>
            </section>

            <section className="mt-12 md:mt-16">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h2 className="text-lg font-semibold">Most popular this week</h2>
                  <p className="text-sm text-muted-foreground">
                    Placeholder carousel (wired up later).
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Drag</span>
                  <span aria-hidden className="bookendd-dots" />
                  <span>Scroll</span>
                </div>
              </div>

              <div className="mt-6 bookendd-carousel">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: purely visual placeholder cards
                    key={index}
                    className="bookendd-book-card"
                  >
                    <div className="bookendd-book-spine" aria-hidden />
                    <div className="mt-auto pt-8">
                      <div className="h-3 w-3/4 rounded bg-foreground/10" />
                      <div className="mt-2 h-2 w-2/3 rounded bg-foreground/10" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 md:mt-16 grid gap-10 md:grid-cols-2">
              <div className="bookendd-toc">
                <h2 className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Table of contents
                </h2>
                <ol className="mt-4 space-y-3 text-sm">
                  <TocItem title="Your library (read / reading / want)" page="12" />
                  <TocItem title="Lists that feel like bookmarks" page="24" />
                  <TocItem title="Members & clubs (coming soon)" page="37" />
                  <TocItem title="Notes, quotes, highlights" page="51" />
                  <TocItem title="Tasteful stats (no obsession)" page="68" />
                </ol>
                <p className="mt-6 text-xs text-muted-foreground">
                  Everything here is designed to feel calm, readable, and intentional.
                </p>
              </div>

              <div className="bookendd-library-card">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Library card
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">Your shelves, your rules</h3>
                  </div>
                  <span className="bookendd-stamp" aria-hidden>
                    EX&nbsp;LIBRIS
                  </span>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Member</dt>
                    <dd className="mt-1 font-medium">You</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Status</dt>
                    <dd className="mt-1 font-medium">Ready to read</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Shelf</dt>
                    <dd className="mt-1 font-medium">Want to read</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Next</dt>
                    <dd className="mt-1 font-medium">Pick a first book</dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="bookendd-chip">Email-only auth</span>
                  <span className="bookendd-chip">No ads</span>
                  <span className="bookendd-chip">Paper-like theme</span>
                </div>
              </div>
            </section>

            <section className="mt-12 md:mt-16 bookendd-quote">
              <Quote className="h-5 w-5 text-primary" />
              <blockquote className="text-sm md:text-base text-pretty">
                “A book is a place you can live for a while.”
              </blockquote>
              <p className="text-xs text-muted-foreground">
                Keep the parts worth remembering—ratings, notes, lists, and the little moments in
                the margins.
              </p>
            </section>
          </main>

          <footer className="mt-14 md:mt-16 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">Bookendd is your quiet corner of the internet.</p>
            <p className="text-xs text-muted-foreground">
              Page <span className="tabular-nums">1</span> of{' '}
              <span className="tabular-nums">∞</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  )
}

function TocItem({ title, page }: { title: string; page: string }) {
  return (
    <li className="flex items-baseline gap-3">
      <span className="min-w-0 flex-1">
        <span className="bookendd-leader">{title}</span>
      </span>
      <span className="tabular-nums text-muted-foreground">{page}</span>
    </li>
  )
}
