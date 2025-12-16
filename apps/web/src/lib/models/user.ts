import type { Database } from '@/lib/supabase/database'

export type UserProfile = {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  isPrivate: boolean
  booksReadCount: number
  toReadCount: number
  currentlyReadingCount: number
  dnfCount: number
  followersCount: number
  followingCount: number
  averageRating: string | null
  ratingDistribution: string | null
  createdAt: string
  updatedAt: string
}

export type SupabaseUserRow = Database['public']['Tables']['users']['Row']
export type DrizzleUserRow = typeof import('@/db/schema').users.$inferSelect

function toIsoString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value
}

export function userProfileFromSupabase(row: SupabaseUserRow): UserProfile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    isPrivate: row.is_private,
    booksReadCount: row.books_read_count,
    toReadCount: row.to_read_count,
    currentlyReadingCount: row.currently_reading_count,
    dnfCount: row.dnf_count,
    followersCount: row.followers_count,
    followingCount: row.following_count,
    averageRating: row.average_rating,
    ratingDistribution: row.rating_distribution,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function userProfileFromDrizzle(row: DrizzleUserRow): UserProfile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.displayName ?? null,
    avatarUrl: row.avatarUrl ?? null,
    bio: row.bio ?? null,
    isPrivate: row.isPrivate,
    booksReadCount: row.booksReadCount,
    toReadCount: row.toReadCount,
    currentlyReadingCount: row.currentlyReadingCount,
    dnfCount: row.dnfCount,
    followersCount: row.followersCount,
    followingCount: row.followingCount,
    averageRating: row.averageRating ?? null,
    ratingDistribution: row.ratingDistribution ?? null,
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  }
}
