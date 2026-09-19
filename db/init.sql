-- BajriX Marketplace Schema (PostgreSQL DDL)

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    icon VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    unit_of_measure VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category_id UUID NOT NULL REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

CREATE TABLE IF NOT EXISTS sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    gst_number VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    rating NUMERIC(3,2) DEFAULT 4.50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sellers_status ON sellers(status);
CREATE INDEX IF NOT EXISTS idx_sellers_city ON sellers(city);

CREATE TABLE IF NOT EXISTS seller_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    price NUMERIC(12,2) NOT NULL CHECK (price > 0),
    available_stock INTEGER NOT NULL CHECK (available_stock >= 0),
    min_order_quantity INTEGER NOT NULL CHECK (min_order_quantity >= 1),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_seller_product UNIQUE (seller_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_listings_product_status ON seller_listings(product_id, status);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON seller_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_price ON seller_listings(price);
