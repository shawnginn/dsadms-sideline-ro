-- ====================================================================
-- BELIZE APP 002: SIDELINE RO MULTI-TENANT DATABASE SCHEMA
-- ====================================================================

-- 1. LOCATIONS / DEALERSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    
    -- Subscription & Billing
    subscription_status VARCHAR(50) DEFAULT 'inactive', -- active, past_due, canceled, inactive
    subscription_plan VARCHAR(50) DEFAULT 'monthly',    -- monthly ($9.99/mo), yearly ($99.99/yr)
    is_trial_bypass BOOLEAN DEFAULT FALSE,             -- True for pilot accounts bypassing Lemon Squeezy
    lemon_squeezy_customer_id VARCHAR(255),
    lemon_squeezy_subscription_id VARCHAR(255),
    
    -- Shop Benchmarks & Specs
    target_door_rate NUMERIC(10, 2) DEFAULT 180.00,
    avg_tech_wage NUMERIC(10, 2) DEFAULT 35.00,
    target_parts_margin NUMERIC(5, 2) DEFAULT 55.00,
    target_labor_gp NUMERIC(5, 2) DEFAULT 65.00,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS & ROLES TABLE
CREATE TABLE IF NOT EXISTS public.app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,                           -- Links to Supabase Auth user
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'STANDARD')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MASTER INVENTORY TABLE (LOCATION SCOPED)
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    vendor_id UUID,
    op_code VARCHAR(100) NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    qty_on_hand INT NOT NULL DEFAULT 0,
    max_stock_level INT NOT NULL DEFAULT 24,
    low_stock_threshold INT NOT NULL DEFAULT 5,
    unit_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    previous_cost NUMERIC(10, 2) DEFAULT 0.00,
    price_changed BOOLEAN DEFAULT FALSE,
    parts_retail_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    std_labor_hours NUMERIC(5, 2) DEFAULT 0.20,
    std_labor_dollars NUMERIC(10, 2) DEFAULT 25.00,
    expected_qty_per_op INT DEFAULT 1,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VENDORS TABLE (LOCATION SCOPED)
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    auto_order_enabled BOOLEAN DEFAULT TRUE,
    preferred_order_method VARCHAR(10) DEFAULT 'Email' CHECK (preferred_order_method IN ('Email', 'SMS')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REPAIR ORDERS & BILLED ITEMS
CREATE TABLE IF NOT EXISTS public.repair_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    ro_number VARCHAR(100) NOT NULL,
    tech_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'open',                 -- open, committed
    total_parts_retail NUMERIC(10, 2) DEFAULT 0.00,
    total_labor_dollars NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.billed_ro_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ro_id UUID REFERENCES public.repair_orders(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES public.inventory_items(id),
    qty_billed INT NOT NULL DEFAULT 1,
    unit_parts_retail NUMERIC(10, 2) NOT NULL,
    unit_wholesale_cost NUMERIC(10, 2) NOT NULL,
    labor_dollars NUMERIC(10, 2) NOT NULL,
    labor_hours NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) FOR MULTI-TENANT ISOLATION
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_orders ENABLE ROW LEVEL SECURITY;

