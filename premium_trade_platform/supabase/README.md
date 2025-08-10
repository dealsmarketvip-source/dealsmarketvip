# Supabase Database Setup for DealsMarket

## Quick Setup Instructions

### 1. Create a Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Note down your project URL and anon key

### 2. Configure Environment Variables
1. Copy `.env.example` to `.env.local`
2. Update the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 3. Run Database Migrations
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`
4. Run migrations: `supabase db push`

### 4. Alternative: Manual Setup
If you prefer to set up manually, copy and run the SQL from:
`migrations/001_create_users_and_verification.sql`

## Database Schema Overview

### Tables Created:
- **users**: Core user information and subscription status
- **companies**: Company verification and details
- **verification_requests**: Document verification tracking
- **subscriptions**: Premium subscription management
- **user_sessions**: User session tracking
- **audit_logs**: Activity logging for security

### Key Features:
- ✅ Row Level Security (RLS) enabled
- ✅ Automatic timestamps with triggers
- ✅ UUID primary keys
- ✅ Proper foreign key relationships
- ✅ Indexes for performance
- ✅ TypeScript types included

### Authentication Flow:
1. User signs up → Creates auth user + user profile
2. User can create company profile
3. User submits verification documents
4. Admin reviews and approves/rejects
5. User gets premium access upon verification

### Verification Process:
1. **Identity Verification**: Personal documents
2. **Company Verification**: Business registration, tax documents
3. **Financial Verification**: Bank statements, financial documents

## Usage in Code

```typescript
import { useAuth } from '@/hooks/use-auth'
import { db } from '@/lib/supabase'

// In components
const { user, userProfile, signIn, signUp } = useAuth()

// Database operations
const { data: companies } = await db.companies.getByUserId(userId)
const { data: verificationRequest } = await db.verificationRequests.create({
  user_id: userId,
  company_id: companyId,
  request_type: 'company',
  documents: [...]
})
```

## Security Notes
- All tables have RLS enabled
- Users can only access their own data
- Service role key needed for admin operations
- Audit logs track all important actions
- Session management included for security
