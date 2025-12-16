"use client";

import { useLayoutEffect } from "react";
import type { UserProfile } from "@/lib/models/user";
import { useUserStore } from "@/lib/stores/user-store";

type UserProviderProps = {
  user: UserProfile | null;
};

/**
 * Hydrates the client-side user store with server-fetched user data.
 * Render inside server components wherever you already have a user object
 * to avoid refetching that data on the client.
 */
export function UserHydrator({ user }: UserProviderProps) {
  const setUser = useUserStore((state) => state.setUser);

  useLayoutEffect(() => {
    const current = useUserStore.getState().user;
    if (!current && !user) return;
    if (
      current &&
      user &&
      current.id === user.id &&
      current.updatedAt === user.updatedAt
    )
      return;

    setUser(user);
  }, [user, setUser]);

  return null;
}
