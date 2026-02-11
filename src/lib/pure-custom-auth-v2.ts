// PURE Custom Auth V2 - Completely rewritten to avoid cache issues
// Uses fetch API directly to database

export interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'SUPPLIER' | 'ADMIN'
  createdat: string
  updatedat: string
}

export interface AuthUser {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// Database configuration
const DB_URL = 'https://mdrqntpedztxxfcxsbxk.supabase.co/rest/v1'
const DB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFudHBlZHp0eHhmY3hzYnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjYxMDIsImV4cCI6MjA4NjIwMjEwMn0.N9MxcjKxuYho3dGOlMcd0fF3vtjjq-UTYCPwQLJ5hG0'

// Common headers for database requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'apikey': DB_KEY,
  'Authorization': `Bearer ${DB_KEY}`,
  'Prefer': 'return=representation'
})

// Simple JWT for testing
function generateJWT(payload: any): string {
  return btoa(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }))
}

function verifyJWT(token: string): any {
  try {
    const decoded = JSON.parse(atob(token))
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null
    }
    return decoded
  } catch {
    return null
  }
}

// Hash password - simple base64
async function hashPassword(password: string): Promise<string> {
  return btoa(password + 'supplysafe-salt')
}

// Verify password
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const inputHash = await hashPassword(password)
  console.log('🔍 Password verification:', {
    input: password,
    inputHash,
    storedHash: hashedPassword,
    match: inputHash === hashedPassword
  })
  return inputHash === hashedPassword
}

// Create user - V2 with forced schema refresh
export async function createUser(email: string, password: string, name: string, role: 'USER' | 'SUPPLIER' | 'ADMIN' = 'USER'): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    console.log('🔍 V2: Checking if user exists:', email)
    
    // Step 1: Force schema refresh first
    console.log('🔄 V2: Forcing schema refresh...')
    const schemaRefresh = await fetch(`${DB_URL}/`, {
      method: 'GET',
      headers: {
        'apikey': DB_KEY,
        'Authorization': `Bearer ${DB_KEY}`,
        'Cache-Control': 'no-cache'
      }
    })
    
    if (schemaRefresh.ok) {
      console.log('✅ V2: Schema refreshed')
    }
    
    // Step 2: Check if user exists
    const encodedEmail = encodeURIComponent(email)
    const checkResponse = await fetch(`${DB_URL}/users?email=eq.${encodedEmail}`, {
      headers: getHeaders()
    })
    
    const existingUsers = await checkResponse.json()
    if (existingUsers.length > 0) {
      console.log('❌ V2: User already exists')
      return { success: false, error: 'User already exists' }
    }

    console.log('🔐 V2: Hashing password')
    const hashedPassword = await hashPassword(password)

    console.log('💾 V2: Creating user in database')
    
    // Step 3: Create user with explicit column selection and fresh timestamp
    const timestamp = new Date().toISOString()
    const payload = {
      email,
      name,
      role,
      password: hashedPassword,
      createdat: timestamp,
      updatedat: timestamp
    }
    
    console.log('🔍 V2: Payload being sent:', JSON.stringify(payload, null, 2))
    
    const createResponse = await fetch(`${DB_URL}/users`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Cache-Control': 'no-cache, max-age=0'
      },
      body: JSON.stringify(payload)
    })

    console.log('📡 V2: Response status:', createResponse.status)

    if (!createResponse.ok) {
      const error = await createResponse.text()
      console.log('❌ V2: Database error:', error)
      return { success: false, error: 'Failed to create user' }
    }

    const user = await createResponse.json()
    console.log('✅ V2: User created successfully')
    
    return { success: true, user }
  } catch (error) {
    console.log('💥 V2: Unexpected error:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

// Login user - V2
export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User; token?: string }> {
  try {
    console.log('🔍 V2: Looking up user:', email)
    
    const encodedEmail = encodeURIComponent(email)
    const response = await fetch(`${DB_URL}/users?email=eq.${encodedEmail}`, {
      headers: getHeaders()
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ V2: Database error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: response.url
      })
      return { success: false, error: 'Invalid credentials' }
    }

    const users = await response.json()
    if (!users || users.length === 0) {
      console.log('❌ V2: User not found')
      return { success: false, error: 'Invalid credentials' }
    }

    const user = users[0]
    console.log('🔐 V2: Verifying password')
    
    const isValidPassword = await verifyPassword(password, user.password || '')
    if (!isValidPassword) {
      console.log('❌ V2: Invalid password')
      return { success: false, error: 'Invalid credentials' }
    }

    console.log('🎫 V2: Generating JWT token')
    const token = generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdat: user.createdat,
        updatedat: user.updatedat
      }))
    }

    console.log('✅ V2: Login successful')
    return { 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdat: user.createdat,
        updatedat: user.updatedat
      },
      token 
    }
  } catch (error) {
    console.log('💥 V2: Login error:', error)
    return { success: false, error: 'Login failed' }
  }
}

// Get current user - V2
export function getCurrentUser(): AuthUser {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false }
  }

  const token = localStorage.getItem('auth_token')
  const userStr = localStorage.getItem('auth_user')

  if (!token || !userStr) {
    return { user: null, token: null, isAuthenticated: false }
  }

  try {
    const decoded = verifyJWT(token)
    if (!decoded) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      return { user: null, token: null, isAuthenticated: false }
    }

    const user = JSON.parse(userStr)
    return { user, token, isAuthenticated: true }
  } catch {
    return { user: null, token: null, isAuthenticated: false }
  }
}

// Logout user - V2
export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }
}

// RBAC functions - V2
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = { 'USER': 1, 'SUPPLIER': 2, 'ADMIN': 3 }
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
  return userLevel >= requiredLevel
}

export function canAccess(user: User | null, resource: string): boolean {
  if (!user) return false
  
  const permissions = {
    'USER': ['dashboard', 'profile'],
    'SUPPLIER': ['dashboard', 'profile', 'supplier-panel', 'inventory', 'batches'],
    'ADMIN': ['dashboard', 'profile', 'supplier-panel', 'inventory', 'admin-panel', 'users', 'batches']
  }
  
  return permissions[user.role]?.includes(resource) || false
}
