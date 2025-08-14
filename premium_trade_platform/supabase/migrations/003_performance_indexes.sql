-- Performance indexes for DealsMarket B2B platform

-- Products table indexes for faster searching and filtering
create index if not exists idx_products_slug on products (slug);
create index if not exists idx_products_category on products (category_id);
create index if not exists idx_products_created on products (created_at desc);
create index if not exists idx_products_price on products (price);
create index if not exists idx_products_title_fts on products using gin (to_tsvector('simple', title));
create index if not exists idx_products_status on products (status) where status = 'active';
create index if not exists idx_products_featured on products (featured) where featured = true;
create index if not exists idx_products_seller on products (seller_id);

-- User profiles table indexes
create index if not exists idx_profiles_verification on profiles (verification_status);
create index if not exists idx_profiles_company on profiles (company_name);
create index if not exists idx_profiles_subscription on profiles (subscription_type);

-- Favorites table indexes for quick lookup
create index if not exists idx_favorites_user on favorites (user_id);
create index if not exists idx_favorites_product on favorites (product_id);
create index if not exists idx_favorites_composite on favorites (user_id, product_id);

-- Analytics table indexes for performance tracking
create index if not exists idx_analytics_event on analytics (event_type);
create index if not exists idx_analytics_timestamp on analytics (timestamp desc);
create index if not exists idx_analytics_user on analytics (user_id);

-- Orders table indexes for transaction tracking
create index if not exists idx_orders_buyer on orders (buyer_id);
create index if not exists idx_orders_seller on orders (seller_id);
create index if not exists idx_orders_status on orders (status);
create index if not exists idx_orders_created on orders (created_at desc);

-- Categories table indexes
create index if not exists idx_categories_parent on categories (parent_id);
create index if not exists idx_categories_active on categories (active) where active = true;

-- Search performance optimization
create index if not exists idx_products_search_composite on products (category_id, status, price) where status = 'active';
create index if not exists idx_products_location on products using gin (to_tsvector('simple', location));

-- Performance monitoring
comment on index idx_products_slug is 'Fast product lookup by slug';
comment on index idx_products_title_fts is 'Full-text search on product titles';
comment on index idx_products_search_composite is 'Composite index for search filters';
