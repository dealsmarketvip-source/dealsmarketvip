-- DealsMarket B2B Platform Seed Data
-- Populate database with realistic European B2B content

-- Insert subscription plans
INSERT INTO subscription_plans (id, name, description, price_monthly, price_yearly, max_products, max_purchases_monthly, features, is_active) VALUES
(
    uuid_generate_v4(),
    'Free',
    'Basic access to the platform',
    0.00,
    0.00,
    1,
    1,
    '["Basic product listing", "1 inquiry per month", "Community access", "Basic search filters"]',
    true
),
(
    uuid_generate_v4(),
    'Premium',
    'Full access for serious B2B companies',
    49.99,
    499.99,
    50,
    100,
    '["Unlimited product listings", "Unlimited inquiries", "Company verification", "Advanced analytics", "Priority support", "Featured listings", "Advanced search filters", "Export capabilities", "API access", "Dedicated account manager"]',
    true
);

-- Insert categories
INSERT INTO categories (id, name, slug, description, parent_id, sort_order, is_active) VALUES
(uuid_generate_v4(), 'Manufacturing & Industry', 'manufacturing-industry', 'Industrial equipment, machinery, and manufacturing services', NULL, 1, true),
(uuid_generate_v4(), 'Technology & Software', 'technology-software', 'IT services, software solutions, and tech equipment', NULL, 2, true),
(uuid_generate_v4(), 'Construction & Real Estate', 'construction-real-estate', 'Building materials, construction services, and real estate', NULL, 3, true),
(uuid_generate_v4(), 'Energy & Environment', 'energy-environment', 'Renewable energy, environmental services, and sustainability solutions', NULL, 4, true),
(uuid_generate_v4(), 'Logistics & Transportation', 'logistics-transportation', 'Shipping, freight, and logistics services', NULL, 5, true),
(uuid_generate_v4(), 'Finance & Professional Services', 'finance-professional', 'Financial services, consulting, and professional business services', NULL, 6, true),
(uuid_generate_v4(), 'Healthcare & Medical', 'healthcare-medical', 'Medical equipment, pharmaceutical, and healthcare services', NULL, 7, true),
(uuid_generate_v4(), 'Agriculture & Food', 'agriculture-food', 'Agricultural products, food processing, and agribusiness', NULL, 8, true),
(uuid_generate_v4(), 'Textiles & Fashion', 'textiles-fashion', 'Textile manufacturing, fashion, and apparel industry', NULL, 9, true),
(uuid_generate_v4(), 'Chemicals & Materials', 'chemicals-materials', 'Chemical products, raw materials, and specialty materials', NULL, 10, true);

-- Insert sample users (including ASTERO1 admin)
INSERT INTO users (id, email, password_hash, full_name, phone, email_verified, phone_verified, status, is_admin, role, timezone, language) VALUES
(
    uuid_generate_v4(),
    'admin@astero.trading',
    crypt('SecureAdmin2024!', gen_salt('bf')),
    'ASTERO Trading Group Admin',
    '+34912345678',
    true,
    true,
    'active',
    true,
    'admin',
    'Europe/Madrid',
    'es'
),
(
    uuid_generate_v4(),
    'marco.rossi@italiansteel.com',
    crypt('ItalianSteel2024!', gen_salt('bf')),
    'Marco Rossi',
    '+39066789012',
    true,
    true,
    'active',
    false,
    'user',
    'Europe/Rome',
    'es'
),
(
    uuid_generate_v4(),
    'sophie.dubois@francetrade.fr',
    crypt('FranceTrade2024!', gen_salt('bf')),
    'Sophie Dubois',
    '+33145678901',
    true,
    true,
    'active',
    false,
    'user',
    'Europe/Paris',
    'es'
),
(
    uuid_generate_v4(),
    'klaus.mueller@germantech.de',
    crypt('GermanTech2024!', gen_salt('bf')),
    'Klaus Müller',
    '+49307890123',
    true,
    true,
    'active',
    false,
    'user',
    'Europe/Berlin',
    'es'
),
(
    uuid_generate_v4(),
    'elena.garcia@spanishlogistics.es',
    crypt('SpanishLog2024!', gen_salt('bf')),
    'Elena García',
    '+34915678901',
    true,
    true,
    'active',
    false,
    'user',
    'Europe/Madrid',
    'es'
),
(
    uuid_generate_v4(),
    'jan.kowalski@polishmanufacturing.pl',
    crypt('PolishMfg2024!', gen_salt('bf')),
    'Jan Kowalski',
    '+48226789012',
    true,
    true,
    'active',
    false,
    'user',
    'Europe/Warsaw',
    'es'
),
(
    uuid_generate_v4(),
    'petra.van.berg@dutchexport.nl',
    crypt('DutchExport2024!', gen_salt('bf')),
    'Petra van Berg',
    '+31207890123',
    true,
    true,
    'active',
    false,
    'user',
    'Europe/Amsterdam',
    'es'
),
(
    uuid_generate_v4(),
    'ahmed.hassan@middleeasttrading.ae',
    crypt('METrading2024!', gen_salt('bf')),
    'Ahmed Hassan',
    '+971567890123',
    true,
    true,
    'active',
    false,
    'user',
    'Asia/Dubai',
    'es'
);

-- Insert companies for each user
WITH user_data AS (
    SELECT 
        id as user_id, 
        email,
        ROW_NUMBER() OVER (ORDER BY created_at) as rn
    FROM users 
    WHERE email != 'admin@astero.trading'
)
INSERT INTO companies (id, user_id, company_name, legal_name, tax_id, company_type, industry, description, website, founded_year, employee_count, annual_revenue_range, headquarters_address, country, city, verification_status) 
SELECT 
    uuid_generate_v4(),
    user_id,
    CASE rn
        WHEN 1 THEN 'Italian Steel Works S.p.A.'
        WHEN 2 THEN 'France Trade Solutions SAS'
        WHEN 3 THEN 'German Tech Industries GmbH'
        WHEN 4 THEN 'Spanish Logistics Group S.L.'
        WHEN 5 THEN 'Polish Manufacturing Co. Sp. z o.o.'
        WHEN 6 THEN 'Dutch Export Partners B.V.'
        WHEN 7 THEN 'Middle East Trading LLC'
    END,
    CASE rn
        WHEN 1 THEN 'Italian Steel Works Società per Azioni'
        WHEN 2 THEN 'France Trade Solutions Société par Actions Simplifiée'
        WHEN 3 THEN 'German Tech Industries Gesellschaft mit beschränkter Haftung'
        WHEN 4 THEN 'Spanish Logistics Group Sociedad Limitada'
        WHEN 5 THEN 'Polish Manufacturing Company Spółka z ograniczoną odpowiedzialnością'
        WHEN 6 THEN 'Dutch Export Partners Besloten Vennootschap'
        WHEN 7 THEN 'Middle East Trading Limited Liability Company'
    END,
    CASE rn
        WHEN 1 THEN 'IT12345678901'
        WHEN 2 THEN 'FR23456789012'
        WHEN 3 THEN 'DE345678901'
        WHEN 4 THEN 'ES456789012'
        WHEN 5 THEN 'PL567890123'
        WHEN 6 THEN 'NL678901234'
        WHEN 7 THEN 'AE789012345'
    END,
    'private_company',
    CASE rn
        WHEN 1 THEN 'Steel & Metal Manufacturing'
        WHEN 2 THEN 'International Trade'
        WHEN 3 THEN 'Technology & Engineering'
        WHEN 4 THEN 'Logistics & Transportation'
        WHEN 5 THEN 'Manufacturing & Production'
        WHEN 6 THEN 'Import/Export'
        WHEN 7 THEN 'Trading & Commerce'
    END,
    CASE rn
        WHEN 1 THEN 'Leading manufacturer of high-quality steel products for European industrial markets. Specializing in structural steel, specialized alloys, and custom fabrication services.'
        WHEN 2 THEN 'Premier international trading company facilitating B2B connections between European and global markets. Expert in trade finance and cross-border transactions.'
        WHEN 3 THEN 'Innovative technology solutions provider specializing in industrial automation, IoT systems, and advanced manufacturing technologies for European enterprises.'
        WHEN 4 THEN 'Comprehensive logistics solutions across Spain and Europe, offering warehousing, distribution, and supply chain optimization services.'
        WHEN 5 THEN 'Modern manufacturing facility producing precision components and assemblies for automotive, aerospace, and industrial applications.'
        WHEN 6 THEN 'Strategic export partner connecting Dutch manufacturers with global markets, specializing in high-tech and sustainable solutions.'
        WHEN 7 THEN 'Established trading company bridging European and Middle Eastern markets, facilitating large-scale B2B transactions and partnerships.'
    END,
    CASE rn
        WHEN 1 THEN 'https://www.italiansteelworks.com'
        WHEN 2 THEN 'https://www.francetradesolutions.fr'
        WHEN 3 THEN 'https://www.germantechindustries.de'
        WHEN 4 THEN 'https://www.spanishlogistics.es'
        WHEN 5 THEN 'https://www.polishmanufacturing.pl'
        WHEN 6 THEN 'https://www.dutchexportpartners.nl'
        WHEN 7 THEN 'https://www.middleeasttrading.ae'
    END,
    CASE rn
        WHEN 1 THEN 1985
        WHEN 2 THEN 1992
        WHEN 3 THEN 1998
        WHEN 4 THEN 2001
        WHEN 5 THEN 1987
        WHEN 6 THEN 1995
        WHEN 7 THEN 2005
    END,
    CASE rn
        WHEN 1 THEN '201-500'
        WHEN 2 THEN '51-200'
        WHEN 3 THEN '101-300'
        WHEN 4 THEN '51-200'
        WHEN 5 THEN '201-500'
        WHEN 6 THEN '11-50'
        WHEN 7 THEN '51-200'
    END,
    CASE rn
        WHEN 1 THEN '50M-100M'
        WHEN 2 THEN '10M-50M'
        WHEN 3 THEN '50M-100M'
        WHEN 4 THEN '10M-50M'
        WHEN 5 THEN '50M-100M'
        WHEN 6 THEN '10M-50M'
        WHEN 7 THEN '100M+'
    END,
    CASE rn
        WHEN 1 THEN 'Via Milano 123, Industrial District'
        WHEN 2 THEN '45 Boulevard Haussmann'
        WHEN 3 THEN 'Potsdamer Platz 1'
        WHEN 4 THEN 'Calle Gran Via 28'
        WHEN 5 THEN 'ul. Marszałkowska 84/92'
        WHEN 6 THEN 'Museumplein 19'
        WHEN 7 THEN 'Sheikh Zayed Road, DIFC'
    END,
    CASE rn
        WHEN 1 THEN 'Italy'
        WHEN 2 THEN 'France'
        WHEN 3 THEN 'Germany'
        WHEN 4 THEN 'Spain'
        WHEN 5 THEN 'Poland'
        WHEN 6 THEN 'Netherlands'
        WHEN 7 THEN 'United Arab Emirates'
    END,
    CASE rn
        WHEN 1 THEN 'Milan'
        WHEN 2 THEN 'Paris'
        WHEN 3 THEN 'Berlin'
        WHEN 4 THEN 'Madrid'
        WHEN 5 THEN 'Warsaw'
        WHEN 6 THEN 'Amsterdam'
        WHEN 7 THEN 'Dubai'
    END,
    'verified'
FROM user_data;

-- Create admin company for ASTERO1
INSERT INTO companies (id, user_id, company_name, legal_name, tax_id, company_type, industry, description, website, founded_year, employee_count, annual_revenue_range, headquarters_address, country, city, verification_status)
SELECT 
    uuid_generate_v4(),
    id,
    'ASTERO Trading Group',
    'ASTERO Trading Group S.L.',
    'ES999888777',
    'private_company',
    'Platform & Technology',
    'Premier European B2B marketplace platform connecting verified companies for high-value transactions and business partnerships.',
    'https://www.astero.trading',
    2018,
    '11-50',
    '10M-50M',
    'Paseo de la Castellana 95',
    'Spain',
    'Madrid',
    'verified'
FROM users WHERE email = 'admin@astero.trading';

-- Insert premium products
WITH company_users AS (
    SELECT u.id as user_id, c.id as company_id, c.company_name, c.industry
    FROM users u
    JOIN companies c ON u.id = c.user_id
    WHERE u.email != 'admin@astero.trading'
)
INSERT INTO products (id, seller_id, company_id, title, description, category, price, currency, minimum_order_value, quantity_available, unit_type, images, specifications, terms_and_conditions, delivery_time, payment_terms, geographic_coverage, certifications, tags, status, featured, views_count, inquiries_count)
SELECT 
    uuid_generate_v4(),
    cu.user_id,
    cu.company_id,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 'Premium Structural Steel Beams - Grade S355'
        WHEN cu.company_name LIKE '%France Trade%' THEN 'European Market Entry Consulting Services'
        WHEN cu.company_name LIKE '%German Tech%' THEN 'Industrial IoT Automation Systems'
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 'Pan-European Logistics & Distribution'
        WHEN cu.company_name LIKE '%Polish%' THEN 'Precision CNC Machined Components'
        WHEN cu.company_name LIKE '%Dutch%' THEN 'Sustainable Technology Export Services'
        WHEN cu.company_name LIKE '%Middle East%' THEN 'Luxury Automotive Import/Export'
    END,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 'High-grade structural steel beams manufactured to European standards EN 10025. Perfect for construction, industrial buildings, and infrastructure projects. Certified quality with full traceability documentation. Available in various sizes and specifications.'
        WHEN cu.company_name LIKE '%France Trade%' THEN 'Comprehensive market entry consulting for companies looking to establish presence in European markets. Including regulatory compliance, partnership development, and local market intelligence. 98% success rate.'
        WHEN cu.company_name LIKE '%German Tech%' THEN 'Complete Industrial IoT solution including sensors, gateways, cloud platform, and analytics dashboard. Increase manufacturing efficiency by 30%. Compatible with major ERP systems. Full technical support included.'
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 'End-to-end logistics solutions covering warehousing, distribution, and supply chain management across Spain and Europe. 99.8% on-time delivery rate. Custom solutions for any industry.'
        WHEN cu.company_name LIKE '%Polish%' THEN 'High-precision CNC machined components for automotive, aerospace, and industrial applications. ISO 9001:2015 certified. Tolerances up to ±0.005mm. Fast turnaround times.'
        WHEN cu.company_name LIKE '%Dutch%' THEN 'Strategic export services for Dutch sustainable technology companies. Market research, partner identification, regulatory support. Focus on renewable energy and clean tech sectors.'
        WHEN cu.company_name LIKE '%Middle East%' THEN 'Premium luxury automotive import/export services between Europe and Middle East. Exclusive partnerships with top European brands. Full concierge service including logistics and documentation.'
    END,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 'Manufacturing & Industry'
        WHEN cu.company_name LIKE '%France Trade%' THEN 'Finance & Professional Services'
        WHEN cu.company_name LIKE '%German Tech%' THEN 'Technology & Software'
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 'Logistics & Transportation'
        WHEN cu.company_name LIKE '%Polish%' THEN 'Manufacturing & Industry'
        WHEN cu.company_name LIKE '%Dutch%' THEN 'Finance & Professional Services'
        WHEN cu.company_name LIKE '%Middle East%' THEN 'Logistics & Transportation'
    END,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 1250.00
        WHEN cu.company_name LIKE '%France Trade%' THEN 15000.00
        WHEN cu.company_name LIKE '%German Tech%' THEN 25000.00
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 8500.00
        WHEN cu.company_name LIKE '%Polish%' THEN 450.00
        WHEN cu.company_name LIKE '%Dutch%' THEN 12000.00
        WHEN cu.company_name LIKE '%Middle East%' THEN 75000.00
    END,
    'EUR',
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 50000.00
        WHEN cu.company_name LIKE '%France Trade%' THEN 15000.00
        WHEN cu.company_name LIKE '%German Tech%' THEN 25000.00
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 8500.00
        WHEN cu.company_name LIKE '%Polish%' THEN 5000.00
        WHEN cu.company_name LIKE '%Dutch%' THEN 12000.00
        WHEN cu.company_name LIKE '%Middle East%' THEN 75000.00
    END,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 1000
        WHEN cu.company_name LIKE '%France Trade%' THEN 1
        WHEN cu.company_name LIKE '%German Tech%' THEN 5
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 1
        WHEN cu.company_name LIKE '%Polish%' THEN 10000
        WHEN cu.company_name LIKE '%Dutch%' THEN 1
        WHEN cu.company_name LIKE '%Middle East%' THEN 25
    END,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 'metric tons'
        WHEN cu.company_name LIKE '%France Trade%' THEN 'project'
        WHEN cu.company_name LIKE '%German Tech%' THEN 'complete system'
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 'monthly contract'
        WHEN cu.company_name LIKE '%Polish%' THEN 'pieces'
        WHEN cu.company_name LIKE '%Dutch%' THEN 'project'
        WHEN cu.company_name LIKE '%Middle East%' THEN 'vehicles'
    END,
    '["https://images.unsplash.com/photo-1588776814546-1ffcf47267a5", "https://images.unsplash.com/photo-1581094794329-c8112a89af12"]',
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN '{"grade": "S355", "standard": "EN 10025", "yield_strength": "355 MPa", "dimensions": "Various sizes available"}'
        WHEN cu.company_name LIKE '%France Trade%' THEN '{"duration": "3-6 months", "success_rate": "98%", "markets": "27 EU countries", "languages": "FR, EN, DE, ES"}'
        WHEN cu.company_name LIKE '%German Tech%' THEN '{"connectivity": "Wi-Fi, Ethernet, 4G", "sensors": "Temperature, Pressure, Vibration", "platform": "Cloud-based", "compatibility": "SAP, Oracle"}'
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN '{"coverage": "Spain & EU", "delivery_time": "24-48h", "tracking": "Real-time", "warehouses": "15 locations"}'
        WHEN cu.company_name LIKE '%Polish%' THEN '{"tolerance": "±0.005mm", "materials": "Steel, Aluminum, Titanium", "finish": "Various", "certification": "ISO 9001:2015"}'
        WHEN cu.company_name LIKE '%Dutch%' THEN '{"sectors": "Renewable Energy, Clean Tech", "markets": "Global", "success_rate": "92%", "languages": "NL, EN, DE"}'
        WHEN cu.company_name LIKE '%Middle East%' THEN '{"brands": "Ferrari, Lamborghini, Porsche, McLaren", "markets": "UAE, Saudi, Qatar", "service": "Full concierge", "certification": "Authorized dealer"}'
    END,
    'Payment: 30% advance, 70% on delivery. Delivery terms: FOB/CIF available. Quality guarantee: 24 months. Cancellation: 48h notice required.',
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN '4-6 weeks'
        WHEN cu.company_name LIKE '%France Trade%' THEN '3-6 months'
        WHEN cu.company_name LIKE '%German Tech%' THEN '8-12 weeks'
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN '24-48 hours'
        WHEN cu.company_name LIKE '%Polish%' THEN '2-4 weeks'
        WHEN cu.company_name LIKE '%Dutch%' THEN '3-6 months'
        WHEN cu.company_name LIKE '%Middle East%' THEN '6-8 weeks'
    END,
    'Net 30 days, Wire transfer or Letter of Credit accepted',
    '["Spain", "France", "Germany", "Italy", "Portugal", "Netherlands", "Belgium"]',
    '["ISO 9001:2015", "CE Marking", "EN Standards"]',
    '["premium", "european", "verified", "b2b", "industrial", "quality"]',
    'active',
    true,
    FLOOR(RANDOM() * 1000 + 100),
    FLOOR(RANDOM() * 50 + 5)
FROM company_users;

-- Insert additional products for variety
INSERT INTO products (id, seller_id, company_id, title, description, category, price, currency, minimum_order_value, quantity_available, unit_type, images, status, featured, views_count, inquiries_count)
SELECT 
    uuid_generate_v4(),
    cu.user_id,
    cu.company_id,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 'Custom Steel Fabrication Services'
        WHEN cu.company_name LIKE '%France Trade%' THEN 'B2B Partnership Development'
        WHEN cu.company_name LIKE '%German Tech%' THEN 'Predictive Maintenance Software'
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 'Cross-Border E-commerce Fulfillment'
        WHEN cu.company_name LIKE '%Polish%' THEN 'Automotive Parts Manufacturing'
        WHEN cu.company_name LIKE '%Dutch%' THEN 'Green Technology Consulting'
        WHEN cu.company_name LIKE '%Middle East%' THEN 'Business Aviation Services'
    END,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 'Bespoke steel fabrication for industrial and architectural projects. Expert welding, cutting, and finishing services.'
        WHEN cu.company_name LIKE '%France Trade%' THEN 'Strategic partnership development and joint venture facilitation for European market expansion.'
        WHEN cu.company_name LIKE '%German Tech%' THEN 'AI-powered predictive maintenance software reducing equipment downtime by up to 40%.'
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 'Complete e-commerce fulfillment solutions for cross-border sales within Europe and beyond.'
        WHEN cu.company_name LIKE '%Polish%' THEN 'Tier 1 automotive supplier manufacturing precision parts for European automotive industry.'
        WHEN cu.company_name LIKE '%Dutch%' THEN 'Sustainability consulting helping companies transition to green technologies and practices.'
        WHEN cu.company_name LIKE '%Middle East%' THEN 'Premium business aviation services including aircraft sales, leasing, and maintenance.'
    END,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 'Manufacturing & Industry'
        WHEN cu.company_name LIKE '%France Trade%' THEN 'Finance & Professional Services'
        WHEN cu.company_name LIKE '%German Tech%' THEN 'Technology & Software'
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 'Logistics & Transportation'
        WHEN cu.company_name LIKE '%Polish%' THEN 'Manufacturing & Industry'
        WHEN cu.company_name LIKE '%Dutch%' THEN 'Energy & Environment'
        WHEN cu.company_name LIKE '%Middle East%' THEN 'Logistics & Transportation'
    END,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 2500.00
        WHEN cu.company_name LIKE '%France Trade%' THEN 25000.00
        WHEN cu.company_name LIKE '%German Tech%' THEN 18000.00
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 5500.00
        WHEN cu.company_name LIKE '%Polish%' THEN 125.00
        WHEN cu.company_name LIKE '%Dutch%' THEN 8500.00
        WHEN cu.company_name LIKE '%Middle East%' THEN 150000.00
    END,
    'EUR',
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 10000.00
        WHEN cu.company_name LIKE '%France Trade%' THEN 25000.00
        WHEN cu.company_name LIKE '%German Tech%' THEN 18000.00
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 5500.00
        WHEN cu.company_name LIKE '%Polish%' THEN 10000.00
        WHEN cu.company_name LIKE '%Dutch%' THEN 8500.00
        WHEN cu.company_name LIKE '%Middle East%' THEN 150000.00
    END,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 50
        WHEN cu.company_name LIKE '%France Trade%' THEN 3
        WHEN cu.company_name LIKE '%German Tech%' THEN 10
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 1
        WHEN cu.company_name LIKE '%Polish%' THEN 50000
        WHEN cu.company_name LIKE '%Dutch%' THEN 5
        WHEN cu.company_name LIKE '%Middle East%' THEN 12
    END,
    CASE 
        WHEN cu.company_name LIKE '%Steel%' THEN 'projects'
        WHEN cu.company_name LIKE '%France Trade%' THEN 'partnerships'
        WHEN cu.company_name LIKE '%German Tech%' THEN 'licenses'
        WHEN cu.company_name LIKE '%Spanish Logistics%' THEN 'annual contract'
        WHEN cu.company_name LIKE '%Polish%' THEN 'pieces'
        WHEN cu.company_name LIKE '%Dutch%' THEN 'consulting projects'
        WHEN cu.company_name LIKE '%Middle East%' THEN 'aircraft'
    END,
    '["https://images.unsplash.com/photo-1559827260-dc66d52bef19", "https://images.unsplash.com/photo-1581092160562-40aa08e78837"]',
    'active',
    false,
    FLOOR(RANDOM() * 500 + 50),
    FLOOR(RANDOM() * 25 + 2)
FROM company_users;

-- Insert wanted posts (buyers looking for products/services)
INSERT INTO wanted_posts (id, buyer_id, company_id, title, description, category, budget_min, budget_max, currency, quantity_needed, required_by, requirements, status, responses_count)
SELECT 
    uuid_generate_v4(),
    cu.user_id,
    cu.company_id,
    CASE (RANDOM() * 7)::INT
        WHEN 0 THEN 'Seeking Industrial Automation Solutions'
        WHEN 1 THEN 'Need Bulk Steel Materials for Construction'
        WHEN 2 THEN 'Looking for European Distribution Partner'
        WHEN 3 THEN 'Require Sustainable Packaging Solutions'
        WHEN 4 THEN 'Seeking IT Infrastructure Upgrade'
        WHEN 5 THEN 'Need Precision Manufacturing Services'
        WHEN 6 THEN 'Looking for Trade Finance Solutions'
    END,
    CASE (RANDOM() * 7)::INT
        WHEN 0 THEN 'Our manufacturing facility requires modern automation solutions to increase efficiency and reduce costs. Looking for integrated systems with IoT capabilities.'
        WHEN 1 THEN 'Large construction project requiring high-quality steel beams and structural materials. EU standards compliance mandatory.'
        WHEN 2 THEN 'Established manufacturer seeking reliable distribution partner for European market expansion. Must have existing network.'
        WHEN 3 THEN 'Food processing company transitioning to sustainable packaging. Need eco-friendly materials that meet food safety standards.'
        WHEN 4 THEN 'Growing tech company needs comprehensive IT infrastructure upgrade including servers, networking, and security solutions.'
        WHEN 5 THEN 'Aerospace project requiring precision-machined components with strict tolerance requirements and full traceability.'
        WHEN 6 THEN 'Expanding business needs trade finance solutions for international B2B transactions. Looking for competitive rates.'
    END,
    CASE (RANDOM() * 6)::INT
        WHEN 0 THEN 'Technology & Software'
        WHEN 1 THEN 'Manufacturing & Industry'
        WHEN 2 THEN 'Logistics & Transportation'
        WHEN 3 THEN 'Energy & Environment'
        WHEN 4 THEN 'Technology & Software'
        WHEN 5 THEN 'Manufacturing & Industry'
    END,
    CASE (RANDOM() * 5)::INT
        WHEN 0 THEN 50000.00
        WHEN 1 THEN 25000.00
        WHEN 2 THEN 100000.00
        WHEN 3 THEN 15000.00
        WHEN 4 THEN 200000.00
    END,
    CASE (RANDOM() * 5)::INT
        WHEN 0 THEN 150000.00
        WHEN 1 THEN 75000.00
        WHEN 2 THEN 300000.00
        WHEN 3 THEN 45000.00
        WHEN 4 THEN 500000.00
    END,
    'EUR',
    CASE (RANDOM() * 4)::INT + 1
        WHEN 1 THEN 1
        WHEN 2 THEN 5
        WHEN 3 THEN 10
        WHEN 4 THEN 100
    END,
    CURRENT_DATE + INTERVAL '3 months',
    '{"certifications_required": true, "eu_compliance": true, "warranty_required": "24 months", "installation_support": true}',
    'active',
    FLOOR(RANDOM() * 15 + 3)
FROM (
    SELECT u.id as user_id, c.id as company_id, c.company_name
    FROM users u
    JOIN companies c ON u.id = c.user_id
    WHERE u.email != 'admin@astero.trading'
    ORDER BY RANDOM()
    LIMIT 15
) cu;

-- Insert notifications for all users
WITH all_users AS (
    SELECT id FROM users WHERE email != 'admin@astero.trading'
),
notification_types AS (
    SELECT unnest(ARRAY[
        'inquiry_received',
        'deal_created',
        'verification_approved',
        'product_viewed',
        'system_announcement'
    ]) as type
)
INSERT INTO notifications (id, user_id, type, title, message, data, read, priority, delivery_method)
SELECT 
    uuid_generate_v4(),
    au.id,
    nt.type,
    CASE nt.type
        WHEN 'inquiry_received' THEN '💼 Nueva consulta recibida'
        WHEN 'deal_created' THEN '🤝 Nuevo deal en proceso'
        WHEN 'verification_approved' THEN '✅ Verificación empresarial aprobada'
        WHEN 'product_viewed' THEN '👀 Tu producto ha sido visto'
        WHEN 'system_announcement' THEN '📢 Bienvenido a DealsMarket Premium'
    END,
    CASE nt.type
        WHEN 'inquiry_received' THEN 'Has recibido una nueva consulta para uno de tus productos. Un comprador verificado está interesado en conocer más detalles.'
        WHEN 'deal_created' THEN 'Se ha creado un nuevo deal por valor de €125,000. Revisa los términos y confirma tu participación.'
        WHEN 'verification_approved' THEN '¡Enhorabuena! Tu empresa ha sido verificada exitosamente. Ahora puedes acceder a todas las funciones premium.'
        WHEN 'product_viewed' THEN 'Tu producto "Premium Steel Beams" ha sido visto por 15 empresas verificadas en las últimas 24 horas.'
        WHEN 'system_announcement' THEN 'Bienvenido a la plataforma B2B más exclusiva de Europa. Explora deals millonarios con empresas verificadas.'
    END,
    CASE nt.type
        WHEN 'inquiry_received' THEN '{"product_id": "' || uuid_generate_v4() || '", "buyer_company": "Industrial Partners Ltd", "amount": 85000}'
        WHEN 'deal_created' THEN '{"deal_id": "' || uuid_generate_v4() || '", "amount": 125000, "currency": "EUR"}'
        WHEN 'verification_approved' THEN '{"verification_date": "' || NOW() || '", "status": "verified"}'
        WHEN 'product_viewed' THEN '{"product_id": "' || uuid_generate_v4() || '", "views": 15, "period": "24h"}'
        WHEN 'system_announcement' THEN '{"platform": "DealsMarket", "user_tier": "Premium"}'
    END,
    CASE WHEN RANDOM() < 0.3 THEN true ELSE false END,
    CASE nt.type
        WHEN 'inquiry_received' THEN 'high'
        WHEN 'deal_created' THEN 'high'
        WHEN 'verification_approved' THEN 'medium'
        WHEN 'product_viewed' THEN 'low'
        WHEN 'system_announcement' THEN 'medium'
    END,
    'in_app'
FROM all_users au
CROSS JOIN notification_types nt
ORDER BY RANDOM()
LIMIT 100;

-- Insert sample inquiries
WITH products_sample AS (
    SELECT p.id as product_id, p.seller_id, u2.id as potential_buyer_id
    FROM products p
    JOIN users u1 ON p.seller_id = u1.id
    CROSS JOIN users u2
    WHERE u1.id != u2.id
    AND u1.email != 'admin@astero.trading'
    AND u2.email != 'admin@astero.trading'
    ORDER BY RANDOM()
    LIMIT 20
)
INSERT INTO inquiries (id, product_id, buyer_id, seller_id, subject, message, quantity, proposed_price, currency, status, priority)
SELECT 
    uuid_generate_v4(),
    ps.product_id,
    ps.potential_buyer_id,
    ps.seller_id,
    'Inquiry about bulk order and pricing',
    'Hello, I am interested in your product for a large industrial project. Could you please provide detailed pricing for bulk orders and availability? We need delivery within 6-8 weeks. Looking forward to your response.',
    CASE (RANDOM() * 4)::INT + 1
        WHEN 1 THEN 10
        WHEN 2 THEN 25
        WHEN 3 THEN 50
        WHEN 4 THEN 100
    END,
    CASE (RANDOM() * 5)::INT + 1
        WHEN 1 THEN 75000.00
        WHEN 2 THEN 125000.00
        WHEN 3 THEN 200000.00
        WHEN 4 THEN 350000.00
        WHEN 5 THEN 500000.00
    END,
    'EUR',
    CASE (RANDOM() * 3)::INT
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'responded'
        WHEN 2 THEN 'negotiating'
    END,
    CASE (RANDOM() * 3)::INT
        WHEN 0 THEN 'medium'
        WHEN 1 THEN 'high'
        WHEN 2 THEN 'urgent'
    END
FROM products_sample ps;

-- Insert user preferences for all users
INSERT INTO user_preferences (id, user_id, email_notifications, push_notifications, privacy_settings)
SELECT 
    uuid_generate_v4(),
    id,
    '{"inquiries": true, "deals": true, "payments": true, "marketing": false, "security": true}',
    '{"inquiries": true, "deals": true, "payments": true, "system": true}',
    '{"profile_visibility": "verified_only", "contact_info_visible": true, "company_info_visible": true, "deal_history_visible": false}'
FROM users;

-- Update products view and inquiry counts
UPDATE products SET 
    views_count = FLOOR(RANDOM() * 2000 + 100),
    inquiries_count = FLOOR(RANDOM() * 80 + 5),
    updated_at = NOW()
WHERE status = 'active';

-- Update wanted posts response counts
UPDATE wanted_posts SET 
    responses_count = FLOOR(RANDOM() * 25 + 3),
    updated_at = NOW()
WHERE status = 'active';

-- Mark some notifications as read
UPDATE notifications SET 
    read = true,
    read_at = NOW() - INTERVAL '1 day' * RANDOM() * 7
WHERE RANDOM() < 0.4;

COMMIT;
