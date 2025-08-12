-- Create login_codes table for email OTP authentication
-- Run this script in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS login_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attempts INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS login_codes_email_idx ON login_codes(email);
CREATE INDEX IF NOT EXISTS login_codes_code_idx ON login_codes(code);
CREATE INDEX IF NOT EXISTS login_codes_expires_at_idx ON login_codes(expires_at);

-- Row Level Security
ALTER TABLE login_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for login_codes - only allow service role access
CREATE POLICY "Service role can manage login codes" ON login_codes
FOR ALL USING (auth.role() = 'service_role');

-- Add cleanup function for expired codes
CREATE OR REPLACE FUNCTION cleanup_expired_login_codes()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM login_codes 
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$;

-- Create trigger to automatically cleanup on new inserts
CREATE OR REPLACE FUNCTION trigger_cleanup_login_codes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM cleanup_expired_login_codes();
  RETURN NEW;
END;
$$;

CREATE TRIGGER cleanup_login_codes_trigger
  AFTER INSERT ON login_codes
  EXECUTE FUNCTION trigger_cleanup_login_codes();

-- Additional tables for user management if they don't exist

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'user',
  verification_status TEXT DEFAULT 'pending',
  profile_image_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  images TEXT[] DEFAULT '{}',
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  condition TEXT DEFAULT 'good',
  category TEXT NOT NULL,
  subcategory TEXT,
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  shipping_included BOOLEAN DEFAULT false,
  shipping_cost DECIMAL(8,2) DEFAULT 0,
  location TEXT,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_verification_status_idx ON users(verification_status);
CREATE INDEX IF NOT EXISTS products_seller_id_idx ON products(seller_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured);
CREATE INDEX IF NOT EXISTS user_favorites_user_id_idx ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS user_favorites_product_id_idx ON user_favorites(product_id);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can view verified users" ON users
FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (auth.uid()::text = id::text);

-- Products policies
CREATE POLICY "Anyone can view active products" ON products
FOR SELECT USING (status = 'active');

CREATE POLICY "Users can manage their own products" ON products
FOR ALL USING (auth.uid()::text = seller_id::text);

-- Favorites policies
CREATE POLICY "Users can manage their own favorites" ON user_favorites
FOR ALL USING (auth.uid()::text = user_id::text);

-- Insert some demo data (optional)
INSERT INTO users (id, email, full_name, company_name, verification_status, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'demo@techcorp.com', 'TechCorp Solutions', 'TechCorp Solutions S.L.', 'verified', '2023-06-15T10:00:00Z'),
('22222222-2222-2222-2222-222222222222', 'demo@globaltrading.com', 'Global Trading Ltd', 'Global Trading Ltd', 'verified', '2023-07-20T14:30:00Z')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (id, title, description, price, images, seller_id, category, location, featured, verified) VALUES
(
  'demo-product-1',
  'iPhone 15 Pro Max 1TB - Titanio Natural',
  'Producto demo con todas las características de la plataforma real. Incluye verificación del vendedor, imágenes múltiples, y toda la funcionalidad del marketplace.',
  1250.00,
  ARRAY[
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop'
  ],
  '11111111-1111-1111-1111-111111111111',
  'electronics',
  'Madrid, España',
  true,
  true
),
(
  'demo-product-2', 
  'MacBook Pro 14" M3 Pro - Seminuevo',
  'MacBook Pro en excelente estado, usado solo 3 meses. Incluye todos los accesorios originales y factura de compra.',
  2200.00,
  ARRAY[
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop'
  ],
  '22222222-2222-2222-2222-222222222222',
  'electronics',
  'Barcelona, España',
  false,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
