import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidRedirect } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle auth redirect errors (e.g., invalid/expired link)
  if (errorParam) {
    console.error("[Auth Callback] Error:", errorParam, errorDescription);
    const errorUrl = new URL("/login", origin);
    errorUrl.searchParams.set(
      "error",
      errorDescription || "Authentication failed"
    );
    return NextResponse.redirect(errorUrl.toString());
  }

  // Validate and sanitize the redirect URL to prevent open redirect attacks
  const next = rawNext && isValidRedirect(rawNext) ? rawNext : "/library";

  if (!code) {
    console.error("[Auth Callback] No authorization code provided");
    return NextResponse.redirect(
      `${origin}/login?error=No authorization code provided`
    );
  }

  const supabase = await createClient();
  const { data: sessionData, error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[Auth Callback] Session exchange error:", error.message);
    const errorUrl = new URL("/login", origin);
    errorUrl.searchParams.set("error", "Failed to complete authentication");
    return NextResponse.redirect(errorUrl.toString());
  }

  // Check if user has a profile in the users table
  const userId = sessionData.user?.id;
  if (userId) {
    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    // If no profile exists, redirect to onboarding to create one
    if (!profile) {
      const onboardingUrl = `/onboarding?next=${encodeURIComponent(next)}`;

      return NextResponse.redirect(`${origin}${onboardingUrl}`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
