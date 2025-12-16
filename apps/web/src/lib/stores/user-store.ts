'use client'

import { create } from 'zustand'
import type { UserProfile } from '@/lib/models/user'

type UserStore = {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  updateUser: (patch: Partial<UserProfile>) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (patch) =>
    set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),
}))
