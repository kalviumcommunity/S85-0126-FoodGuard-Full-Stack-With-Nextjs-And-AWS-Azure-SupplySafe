import { createClient } from '@supabase/supabase-js'

// Use environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mdrqntpedztxxfcxsbxk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFudHBlZHp0eHhmY3hzYnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjYxMDIsImV4cCI6MjA4NjIwMjEwMn0.N9MxcjKxuYho3dGOlMcd0fF3vtjjq-UTYCPwQLJ5hG0'

// Create singleton instance for client-side usage
let _supabaseClient: ReturnType<typeof createClient> | null = null

const getSupabaseClient = () => {
  if (!_supabaseClient) {
    _supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabaseClient
}

// Export the client instance for client-side usage
export const supabase = getSupabaseClient()

// Create admin client function for server-side usage only
export const createSupabaseAdmin = () => {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in server environment')
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

// For backward compatibility, but this should only be used on server
export const supabaseAdmin = typeof window === 'undefined' ? createSupabaseAdmin() : null
