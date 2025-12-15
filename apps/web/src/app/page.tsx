import { ArrowRight, BarChart3, Book, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Bookendd
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <Button asChild>
                <Link href="/library">Go to Library</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
          Your Reading Journey,{" "}
          <span className="text-muted-foreground">Beautifully Tracked</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Track the books you read, discover new favorites, and connect with
          fellow readers. A modern alternative to Goodreads, built for the way
          you read.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">
              Start Tracking Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to track your reads
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Book className="h-8 w-8" />}
              title="Personal Library"
              description="Track what you're reading, want to read, and have finished. Rate and review your books with a beautiful interface."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Book Clubs"
              description="Create or join book clubs. Vote on next reads, discuss chapters, and share your thoughts with fellow readers."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="Reading Stats"
              description="Visualize your reading habits with detailed statistics. Set goals and track your progress throughout the year."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start reading?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of readers tracking their literary adventures.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Create Your Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Bookendd - A better way to track your reading.
            </p>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition">
                About
              </Link>
              <Link
                href="/privacy"
                className="hover:text-foreground transition"
              >
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition">
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
