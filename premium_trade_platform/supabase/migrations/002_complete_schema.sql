-- Complete DealsMarket Database Schema
-- This creates all necessary tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    company_type TEXT CHECK (company_type IN ('individual', 'small_business', 'enterprise')),
    subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium', 'enterprise')),
    subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'cancelled', 'past_due')),
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    profile_image_url TEXT,
    phone TEXT,
    address JSONB,
    profile_data JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    currency TEXT DEFAULT 'EUR',
    category TEXT NOT NULL,
    subcategory TEXT,
    condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'excellent', 'good', 'fair')),
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'sold', 'inactive', 'archived')),
    location TEXT,
    shipping_included BOOLEAN DEFAULT true,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'disputed')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    shipping_address JSONB,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('payment', 'refund', 'fee', 'withdrawal')),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    payment_provider TEXT,
    payment_provider_id TEXT,
    fees DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- User limits table
CREATE TABLE IF NOT EXISTS public.user_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    max_products INTEGER DEFAULT 10,
    max_purchases_per_month INTEGER DEFAULT 5,
    current_products INTEGER DEFAULT 0,
    current_purchases_this_month INTEGER DEFAULT 0,
    reset_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Invitation codes table
CREATE TABLE IF NOT EXISTS public.invitation_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'standard' CHECK (type IN ('standard', 'premium', 'enterprise')),
    max_uses INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    benefits JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification documents table
CREATE TABLE IF NOT EXISTS public.verification_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('id_card', 'passport', 'business_license', 'tax_document')),
    document_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON public.user_favorites(product_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can read their own profile and public profiles
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = auth_id);

-- Products: Everyone can read active products, sellers can manage their own
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (status = 'active');

CREATE POLICY "Sellers can manage their own products" ON public.products
    FOR ALL USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = seller_id));

-- Orders: Users can see orders they're involved in
CREATE POLICY "Users can view their orders" ON public.orders
    FOR SELECT USING (
        auth.uid() = (SELECT auth_id FROM public.users WHERE id = buyer_id) OR
        auth.uid() = (SELECT auth_id FROM public.users WHERE id = seller_id)
    );

CREATE POLICY "Buyers can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_id FROM public.users WHERE id = buyer_id));

-- Transactions: Users can see their own transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users can manage their favorites" ON public.user_favorites
    FOR ALL USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

-- User limits: Users can see their own limits
CREATE POLICY "Users can view their own limits" ON public.user_limits
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

-- Functions

-- Function to validate invitation codes
CREATE OR REPLACE FUNCTION validate_invitation_code(code_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.invitation_codes 
        WHERE code = code_input 
        AND is_active = true 
        AND (expires_at IS NULL OR expires_at > NOW())
        AND current_uses < max_uses
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to use invitation code
CREATE OR REPLACE FUNCTION use_invitation_code(code_input TEXT, user_id_input UUID DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
    code_record RECORD;
    result JSONB;
BEGIN
    -- Get the invitation code
    SELECT * INTO code_record 
    FROM public.invitation_codes 
    WHERE code = code_input 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > NOW())
    AND current_uses < max_uses;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or expired code');
    END IF;

    -- Increment usage count
    UPDATE public.invitation_codes 
    SET current_uses = current_uses + 1,
        updated_at = NOW()
    WHERE code = code_input;

    -- Return success with benefits
    result := jsonb_build_object(
        'success', true,
        'message', 'Code used successfully',
        'benefits', code_record.benefits,
        'type', code_record.type
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user limits
CREATE OR REPLACE FUNCTION check_user_limit(user_id_input UUID, limit_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    limits_record RECORD;
BEGIN
    SELECT * INTO limits_record 
    FROM public.user_limits 
    WHERE user_id = user_id_input;

    IF NOT FOUND THEN
        RETURN false;
    END IF;

    CASE limit_type
        WHEN 'products' THEN
            RETURN limits_record.current_products < limits_record.max_products;
        WHEN 'purchases' THEN
            RETURN limits_record.current_purchases_this_month < limits_record.max_purchases_per_month;
        ELSE
            RETURN false;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update product view count
CREATE OR REPLACE FUNCTION increment_product_views(product_id_input UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.products 
    SET views_count = views_count + 1,
        updated_at = NOW()
    WHERE id = product_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create complete schema (for initialization)
CREATE OR REPLACE FUNCTION create_complete_schema()
RETURNS VOID AS $$
BEGIN
    -- This function ensures all tables exist
    -- The actual table creation is done above
    -- This is just a placeholder for the initialization system
    NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial invitation codes
INSERT INTO public.invitation_codes (code, type, max_uses, benefits, is_active) VALUES
('ASTERO1', 'enterprise', 1, '{"subscription_type": "enterprise", "verification_status": "verified", "permissions": ["marketplace", "selling", "premium_features"]}', true),
('BETA50', 'enterprise', 1, '{"subscription_type": "enterprise", "verification_status": "verified", "permissions": ["marketplace", "selling", "premium_features", "beta_access"]}', true)
ON CONFLICT (code) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;
