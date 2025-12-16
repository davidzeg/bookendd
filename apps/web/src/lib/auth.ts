import { type UserProfile, userProfileFromSupabase } from "./models/user";
import { createClient } from "./supabase/server";

export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return null;

  return userProfileFromSupabase(profile);
}
