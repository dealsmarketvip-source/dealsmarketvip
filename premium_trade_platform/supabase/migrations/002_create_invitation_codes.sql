-- Create invitation_codes table
CREATE TABLE invitation_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  subscription_type VARCHAR(20) DEFAULT 'premium' CHECK (subscription_type IN ('premium', 'vip')),
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year')
);

-- Create index for faster lookups
CREATE INDEX idx_invitation_codes_code ON invitation_codes(code);
CREATE INDEX idx_invitation_codes_email ON invitation_codes(email);
CREATE INDEX idx_invitation_codes_used ON invitation_codes(used);

-- Enable RLS
ALTER TABLE invitation_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own invitation codes" ON invitation_codes
  FOR SELECT USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY "Users can update their own invitation codes" ON invitation_codes
  FOR UPDATE USING (auth.uid() = user_id OR email = auth.email());

-- Allow service role to insert and manage codes
CREATE POLICY "Service role can manage invitation codes" ON invitation_codes
  FOR ALL USING (auth.role() = 'service_role');

-- Insert test invitation codes
INSERT INTO invitation_codes (code, email, subscription_type) VALUES
  ('PREMIUM-VIP-2024-001', 'test1@dealsmarket.vip', 'vip'),
  ('PREMIUM-VIP-2024-002', 'test2@dealsmarket.vip', 'vip'),
  ('PREMIUM-VIP-2024-003', 'admin@dealsmarket.vip', 'vip'),
  ('PREMIUM-ACCESS-001', 'company1@example.com', 'premium'),
  ('PREMIUM-ACCESS-002', 'company2@example.com', 'premium'),
  ('PREMIUM-ACCESS-003', 'company3@example.com', 'premium'),
  ('VIP-GOLD-MEMBER-001', 'vip1@company.com', 'vip'),
  ('VIP-GOLD-MEMBER-002', 'vip2@company.com', 'vip'),
  ('INSTANT-VERIFY-001', 'quick@access.com', 'premium'),
  ('INSTANT-VERIFY-002', 'fast@track.com', 'premium');

-- Create function to generate random invitation codes
CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
  code_exists BOOLEAN := TRUE;
BEGIN
  WHILE code_exists LOOP
    result := '';
    FOR i IN 1..15 LOOP
      IF i = 6 OR i = 11 THEN
        result := result || '-';
      ELSE
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
      END IF;
    END LOOP;
    
    SELECT EXISTS(SELECT 1 FROM invitation_codes WHERE code = result) INTO code_exists;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
