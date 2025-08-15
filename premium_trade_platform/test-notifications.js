// Simple test to reproduce the notification error
// Run this in browser console to see what's happening

// Test 1: Check if it's a serialization issue
console.log('=== TEST 1: Error Object Serialization ===')
const testError = new Error('Test error message')
testError.details = 'Some details'
testError.code = 'TEST_CODE'

console.error('Direct error log:', testError)
console.error('Error in object:', { error: testError })
console.error('Error stringified:', JSON.stringify(testError))
console.error('Error with message:', { message: testError.message, error: testError })

// Test 2: Check Supabase error structure
console.log('=== TEST 2: Supabase-like Error ===')
const supabaseError = {
  message: 'relation "notifications" does not exist',
  details: 'The schema public does not contain a table named notifications',
  hint: 'Perhaps you meant to reference the table "public.notifications"',
  code: '42P01'
}

console.error('Supabase error direct:', supabaseError)
console.error('Supabase error in object:', { error: supabaseError })

// Test 3: Test the actual pattern used in code
console.log('=== TEST 3: Actual Code Pattern ===')
try {
  throw supabaseError
} catch (error) {
  console.error('Error fetching notifications:', error) // This might show [object Object]
  console.error('Error fetching notifications with details:', {
    message: error?.message || 'Unknown error',
    details: error?.details,
    hint: error?.hint,
    code: error?.code
  })
}

console.log('=== TEST COMPLETE ===')
