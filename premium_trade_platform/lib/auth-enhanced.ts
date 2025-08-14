import { createClient } from "@supabase/supabase-js"

// Enhanced authentication with real database operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'

// Create admin client for user management
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Define invitation codes with real account data
const INVITATION_CODES = {
  'ASTERO1': {
    company_name: 'Astero Trading Group',
    company_type: 'enterprise',
    email: 'admin@astero.trading',
    password: 'AsteroSecure2024!',
    full_name: 'Astero Administrator',
    subscription_type: 'enterprise',
    verification_status: 'verified',
    permissions: ['marketplace', 'selling', 'premium_features'],
    profile_data: {
      company_size: '500+',
      industry: 'International Trading',
      location: 'Madrid, Spain',
      phone: '+34 91 123 4567',
      website: 'https://astero.trading'
    }
  },
  'BETA50': {
    company_name: 'Beta Tester Company',
    company_type: 'enterprise',
    email: 'beta@dealsmarket.vip',
    password: 'BetaTest2024!',
    full_name: 'Beta Tester',
    subscription_type: 'enterprise',
    verification_status: 'verified',
    permissions: ['marketplace', 'selling', 'premium_features', 'beta_access'],
    profile_data: {
      company_size: '100-500',
      industry: 'Technology Testing',
      location: 'Barcelona, Spain',
      phone: '+34 93 123 4567',
      website: 'https://betatest.com'
    }
  }
}

export async function createDatabaseSchema() {
  const { error } = await supabaseAdmin.rpc('create_complete_schema', {})
  
  if (error) {
    console.error('Error creating schema:', error)
    return { success: false, error }
  }
  
  return { success: true }
}

export async function setupInitialData() {
  try {
    // Create accounts for invitation codes
    for (const [code, data] of Object.entries(INVITATION_CODES)) {
      // First, create the auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          full_name: data.full_name,
          invitation_code: code,
          company_name: data.company_name
        }
      })

      if (authError && !authError.message.includes('already registered')) {
        console.error(`Error creating auth user for ${code}:`, authError)
        continue
      }

      const userId = authData?.user?.id

      if (userId) {
        // Create user profile
        const { error: profileError } = await supabaseAdmin
          .from('users')
          .upsert({
            id: userId,
            auth_id: userId,
            email: data.email,
            full_name: data.full_name,
            company_name: data.company_name,
            company_type: data.company_type,
            subscription_type: data.subscription_type,
            subscription_status: 'active',
            verification_status: data.verification_status,
            profile_data: data.profile_data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error(`Error creating profile for ${code}:`, profileError)
        }

        // Create user limits
        const { error: limitsError } = await supabaseAdmin
          .from('user_limits')
          .upsert({
            user_id: userId,
            max_products: data.subscription_type === 'enterprise' ? 1000 : 50,
            max_purchases_per_month: data.subscription_type === 'enterprise' ? 500 : 20,
            current_products: 0,
            current_purchases_this_month: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (limitsError) {
          console.error(`Error creating limits for ${code}:`, limitsError)
        }

        console.log(`✅ Successfully created account for code: ${code}`)
      }
    }

    // Create invitation codes in database
    for (const [code, data] of Object.entries(INVITATION_CODES)) {
      const { error: codeError } = await supabaseAdmin
        .from('invitation_codes')
        .upsert({
          code: code,
          type: 'premium',
          max_uses: 1,
          current_uses: 0,
          benefits: {
            subscription_type: data.subscription_type,
            verification_status: data.verification_status,
            permissions: data.permissions
          },
          expires_at: null, // No expiration
          created_at: new Date().toISOString(),
          is_active: true
        })

      if (codeError) {
        console.error(`Error creating invitation code ${code}:`, codeError)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error setting up initial data:', error)
    return { success: false, error }
  }
}

export async function validateAndLoginWithCode(code: string) {
  try {
    const codeData = INVITATION_CODES[code.toUpperCase() as keyof typeof INVITATION_CODES]
    
    if (!codeData) {
      return {
        success: false,
        error: 'Invalid invitation code'
      }
    }

    // Sign in with the associated account
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: codeData.email,
      password: codeData.password
    })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_id', data.user.id)
      .single()

    if (profileError) {
      return {
        success: false,
        error: 'Failed to load user profile'
      }
    }

    return {
      success: true,
      data: {
        user: data.user,
        profile: profile,
        session: data.session
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Authentication failed'
    }
  }
}

export async function createRealAccount(email: string, password: string, invitationCode?: string) {
  try {
    let profileData = {
      subscription_type: 'free',
      verification_status: 'pending',
      permissions: ['marketplace']
    }

    // If invitation code is provided, use its benefits
    if (invitationCode) {
      const codeData = INVITATION_CODES[invitationCode.toUpperCase() as keyof typeof INVITATION_CODES]
      if (codeData) {
        profileData = {
          subscription_type: codeData.subscription_type,
          verification_status: codeData.verification_status,
          permissions: codeData.permissions
        }
      }
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        invitation_code: invitationCode
      }
    })

    if (authError) {
      return {
        success: false,
        error: authError.message
      }
    }

    const userId = authData.user.id

    // Create user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        auth_id: userId,
        email: email,
        full_name: '',
        subscription_type: profileData.subscription_type,
        subscription_status: 'active',
        verification_status: profileData.verification_status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      return {
        success: false,
        error: 'Failed to create user profile'
      }
    }

    // Create user limits
    await supabaseAdmin
      .from('user_limits')
      .insert({
        user_id: userId,
        max_products: profileData.subscription_type === 'enterprise' ? 1000 : 50,
        max_purchases_per_month: profileData.subscription_type === 'enterprise' ? 500 : 20,
        current_products: 0,
        current_purchases_this_month: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    return {
      success: true,
      data: {
        user: authData.user,
        profile: profile
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create account'
    }
  }
}

// Initialize the system
export async function initializeSystem() {
  console.log('🚀 Initializing DealsMarket system...')
  
  const schemaResult = await createDatabaseSchema()
  if (!schemaResult.success) {
    console.log('⚠️ Schema creation failed (might already exist)')
  }

  const dataResult = await setupInitialData()
  if (dataResult.success) {
    console.log('✅ System initialized successfully')
    console.log('📝 Available accounts:')
    console.log('   - ASTERO1: admin@astero.trading / AsteroSecure2024!')
    console.log('   - BETA50: beta@dealsmarket.vip / BetaTest2024!')
  } else {
    console.log('⚠️ Initial data setup had issues')
  }

  return dataResult.success
}
