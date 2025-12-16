"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRedirect } from "@/lib/validation";

type OnboardingState = {
  error: string | null;
  success: boolean;
};

export async function completeOnboarding(
  _previousState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to complete onboarding",
      success: false,
    };
  }

  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const displayName = (formData.get("displayName") as string)?.trim() || null;
  const rawRedirect = formData.get("redirectTo") as string;
  const redirectTo = sanitizeRedirect(rawRedirect);

  // Validate username
  if (!username) {
    return {
      error: "Username is required",
      success: false,
    };
  }

  if (username.length < 3) {
    return {
      error: "Username must be at least 3 characters",
      success: false,
    };
  }

  if (username.length > 50) {
    return {
      error: "Username must be 50 characters or less",
      success: false,
    };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      error:
        "Username can only contain lowercase letters, numbers, and underscores",
      success: false,
    };
  }

  // Check if username is already taken
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  if (existingUser) {
    return {
      error: "This username is already taken",
      success: false,
    };
  }

  try {
    // Create the user profile
    await db.insert(users).values({
      id: user.id,
      username,
      displayName,
    });
  } catch (error) {
    console.error("[Onboarding] Error creating user profile:", error);
    return {
      error: "Failed to create profile. Please try again.",
      success: false,
    };
  }

  // redirect() throws internally, so it must be outside try-catch
  redirect(redirectTo);
}
