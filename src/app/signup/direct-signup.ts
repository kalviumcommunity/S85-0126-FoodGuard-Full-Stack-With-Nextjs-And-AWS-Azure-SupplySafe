import { createClient } from '@supabase/supabase-js'

// Service role key for admin operations (only use on server)
const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here'

const adminSupabase = createClient(
  'https://mdrqntpedztxxfcxsbxk.supabase.co',
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function createUserDirectly(email: string, password: string, name: string, role: string) {
  try {
    // First, try to create user in auth.users directly
    const { data, error } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        name,
        role
      }
    })

    if (error) {
      console.error('Direct user creation error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function checkUserExists(email: string) {
  try {
    const { data, error } = await adminSupabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    return { exists: !error && !!data, data }
  } catch (error) {
    return { exists: false, error }
  }
}
