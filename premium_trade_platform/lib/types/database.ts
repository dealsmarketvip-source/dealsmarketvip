// Database Types for DealsMarket.vip Marketplace

export interface InvitationCode {
  id: string;
  code: string;
  type: 'general' | 'business' | 'premium' | 'verification_bypass';
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  expires_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  auth_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  dni?: string;
  country?: string;
  city?: string;
  address?: string;
  profile_image_url?: string;
  user_type: 'individual' | 'business' | 'freelancer';
  subscription_type: 'free' | 'premium';
  subscription_status: 'active' | 'inactive' | 'pending' | 'cancelled';
  verification_status: 'pending' | 'in_review' | 'verified' | 'rejected';
  verification_bypass: boolean;
  account_balance: number;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserLimits {
  id: string;
  user_id: string;
  max_products: number;
  max_purchases: number;
  current_products: number;
  current_purchases: number;
  reset_date?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationDocument {
  id: string;
  user_id: string;
  document_type: 'dni' | 'passport' | 'business_license' | 'tax_certificate' | 'bank_statement';
  document_url: string;
  document_name?: string;
  file_size?: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewer_notes?: string;
  uploaded_at: string;
  reviewed_at?: string;
}

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  brand?: string;
  model?: string;
  location?: string;
  shipping_included: boolean;
  shipping_cost: number;
  images: string[];
  specifications: Record<string, any>;
  status: 'draft' | 'active' | 'sold' | 'inactive' | 'suspended';
  featured: boolean;
  verified: boolean;
  views_count: number;
  favorites_count: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  uploaded_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  shipping_cost: number;
  tax_amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_method?: string;
  stripe_payment_intent_id?: string;
  shipping_address?: Record<string, any>;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  order_id?: string;
  type: 'sale' | 'purchase' | 'refund' | 'payout' | 'fee' | 'subscription';
  amount: number;
  currency: string;
  description?: string;
  stripe_transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'premium';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  price_paid: number;
  currency: string;
  billing_period: 'monthly' | 'yearly';
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancelled_at?: string;
  trial_end?: string;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface UserSearch {
  id: string;
  user_id?: string;
  search_query: string;
  filters_applied?: Record<string, any>;
  results_count?: number;
  clicked_product_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserAnalytics {
  id: string;
  user_id: string;
  metric_type: string;
  metric_value: number;
  period_start?: string;
  period_end?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  product_id?: string;
  order_id?: string;
  subject?: string;
  content: string;
  is_read: boolean;
  message_type: 'message' | 'offer' | 'question' | 'complaint';
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Extended database schema for Supabase
export interface Database {
  public: {
    Tables: {
      invitation_codes: {
        Row: InvitationCode;
        Insert: Omit<InvitationCode, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<InvitationCode, 'id' | 'created_at' | 'updated_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_limits: {
        Row: UserLimits;
        Insert: Omit<UserLimits, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserLimits, 'id' | 'created_at' | 'updated_at'>>;
      };
      verification_documents: {
        Row: VerificationDocument;
        Insert: Omit<VerificationDocument, 'id' | 'uploaded_at'>;
        Update: Partial<Omit<VerificationDocument, 'id' | 'uploaded_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      product_images: {
        Row: ProductImage;
        Insert: Omit<ProductImage, 'id' | 'uploaded_at'>;
        Update: Partial<Omit<ProductImage, 'id' | 'uploaded_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, 'id' | 'created_at'>;
        Update: Partial<Omit<Transaction, 'id' | 'created_at'>>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_favorites: {
        Row: UserFavorite;
        Insert: Omit<UserFavorite, 'id' | 'created_at'>;
        Update: Partial<Omit<UserFavorite, 'id' | 'created_at'>>;
      };
      user_searches: {
        Row: UserSearch;
        Insert: Omit<UserSearch, 'id' | 'created_at'>;
        Update: Partial<Omit<UserSearch, 'id' | 'created_at'>>;
      };
      user_analytics: {
        Row: UserAnalytics;
        Insert: Omit<UserAnalytics, 'id' | 'created_at'>;
        Update: Partial<Omit<UserAnalytics, 'id' | 'created_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at' | 'updated_at'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>;
      };
    };
    Views: {};
    Functions: {
      validate_invitation_code: {
        Args: { code_input: string };
        Returns: boolean;
      };
      use_invitation_code: {
        Args: { code_input: string; user_id_input?: string };
        Returns: {
          success: boolean;
          error?: string;
          code_type?: string;
          verification_bypass?: boolean;
        };
      };
      check_user_limit: {
        Args: { user_id_input: string; limit_type: string };
        Returns: boolean;
      };
    };
    Enums: {};
  };
}

// Utility types for marketplace functionality
export type UserProfile = User & {
  limits?: UserLimits;
  verification_documents?: VerificationDocument[];
  subscription?: Subscription;
};

export type ProductWithImages = Product & {
  images_data?: ProductImage[];
  seller?: Pick<User, 'id' | 'full_name' | 'verification_status' | 'profile_image_url'>;
};

export type OrderWithDetails = Order & {
  product?: Product;
  buyer?: Pick<User, 'id' | 'full_name' | 'email'>;
  seller?: Pick<User, 'id' | 'full_name' | 'email'>;
  transactions?: Transaction[];
};

export type UserDashboard = {
  user: UserProfile;
  selling_products: Product[];
  purchased_orders: OrderWithDetails[];
  selling_orders: OrderWithDetails[];
  recent_transactions: Transaction[];
  analytics: UserAnalytics[];
  favorites: ProductWithImages[];
  messages: Message[];
};

// Form types for frontend
export interface CreateProductForm {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  condition?: string;
  brand?: string;
  model?: string;
  location?: string;
  shipping_included: boolean;
  shipping_cost?: number;
  images: File[];
  specifications?: Record<string, any>;
}

export interface UpdateUserProfileForm {
  full_name?: string;
  phone?: string;
  dni?: string;
  country?: string;
  city?: string;
  address?: string;
  user_type?: 'individual' | 'business' | 'freelancer';
}

export interface VerificationForm {
  user_type: 'individual' | 'business' | 'freelancer';
  documents: {
    type: 'dni' | 'passport' | 'business_license' | 'tax_certificate' | 'bank_statement';
    file: File;
  }[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Search and filter types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  min_price?: number;
  max_price?: number;
  condition?: string;
  location?: string;
  seller_verified?: boolean;
  featured?: boolean;
  sort_by?: 'created_at' | 'price' | 'views_count' | 'favorites_count';
  sort_order?: 'asc' | 'desc';
}

export interface SearchParams extends ProductFilters {
  q?: string;
  page?: number;
  limit?: number;
}
