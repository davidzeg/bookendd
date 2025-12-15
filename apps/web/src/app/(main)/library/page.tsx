import { Book, BookMarked, BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  // Middleware should handle this, but as a fallback
  if (!authUser) {
    redirect("/login");
  }

  // Check if user has completed onboarding (has a profile)
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, authUser.id),
  });

  if (!user) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Bookendd
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              @{user.username}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Library</h1>
            <p className="text-muted-foreground">
              Track and organize your reading journey
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Currently Reading"
            value={0}
          />
          <StatCard
            icon={<BookMarked className="h-5 w-5" />}
            label="Want to Read"
            value={0}
          />
          <StatCard
            icon={<Book className="h-5 w-5" />}
            label="Finished"
            value={0}
          />
        </div>

        {/* Empty State */}
        <div className="text-center py-16 border rounded-lg bg-muted/20">
          <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your library is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start building your library by adding your first book. Track what
            you&apos;re reading, rate books, and keep a record of your reading
            journey.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Book
          </Button>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
