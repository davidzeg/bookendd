import { cache } from 'react'
import { createClient } from './supabase/server'

export const getCurrentUser = cache(async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  return profile
})
