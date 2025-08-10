export interface User {
  id: string;
  auth_id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  phone?: string;
  country?: string;
  subscription_type: 'free' | 'premium' | 'vip';
  subscription_status: 'active' | 'inactive' | 'pending';
  verification_status: 'pending' | 'in_review' | 'verified' | 'rejected';
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  user_id: string;
  company_name: string;
  company_registration_number?: string;
  tax_id?: string;
  industry?: string;
  company_size?: 'small' | 'medium' | 'large' | 'enterprise';
  website_url?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  verification_status: 'pending' | 'in_review' | 'verified' | 'rejected';
  verification_documents: DocumentMetadata[];
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  company_id: string;
  request_type: 'identity' | 'company' | 'financial';
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  documents: DocumentMetadata[];
  submission_data: Record<string, any>;
  reviewer_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  subscription_type: 'premium' | 'vip';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  price_paid: number;
  currency: string;
  billing_period: 'monthly' | 'yearly';
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  expires_at: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface DocumentMetadata {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  condition: string;
  location?: string;
  images: string[];
  specifications: Record<string, any>;
  status: string;
  featured: boolean;
  verified: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

// Database schema type for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      companies: {
        Row: Company;
        Insert: Omit<Company, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>;
      };
      verification_requests: {
        Row: VerificationRequest;
        Insert: Omit<VerificationRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VerificationRequest, 'id' | 'created_at' | 'updated_at'>>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_sessions: {
        Row: UserSession;
        Insert: Omit<UserSession, 'id' | 'created_at'>;
        Update: Partial<Omit<UserSession, 'id' | 'created_at'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
