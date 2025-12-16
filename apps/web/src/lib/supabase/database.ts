export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          is_private: boolean
          books_read_count: number
          to_read_count: number
          currently_reading_count: number
          dnf_count: number
          followers_count: number
          following_count: number
          average_rating: string | null
          rating_distribution: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_private?: boolean
          books_read_count?: number
          to_read_count?: number
          currently_reading_count?: number
          dnf_count?: number
          followers_count?: number
          following_count?: number
          average_rating?: string | null
          rating_distribution?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_private?: boolean
          books_read_count?: number
          to_read_count?: number
          currently_reading_count?: number
          dnf_count?: number
          followers_count?: number
          following_count?: number
          average_rating?: string | null
          rating_distribution?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
