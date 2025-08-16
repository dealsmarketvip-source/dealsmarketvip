// Test the isDatabaseConnected function
console.log('=== Testing isDatabaseConnected ===')

// Simulate the environment
const supabaseUrl = 'https://placeholder.supabase.co'
const supabaseAnonKey = 'placeholder_anon_key_for_build_only'

const isDatabaseConnected = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         !supabaseUrl.includes('placeholder') && 
         !supabaseAnonKey.includes('placeholder')
}

console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey)
console.log('URL exists:', !!supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)
console.log('URL includes placeholder:', supabaseUrl.includes('placeholder'))
console.log('Key includes placeholder:', supabaseAnonKey.includes('placeholder'))
console.log('Final result:', isDatabaseConnected())

// The function should return false, but it might be returning true
