-- ========================================================
-- APP 002: SIDELINE RO & MARGIN TRACKER - SUPABASE SCHEMA
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS & INVENTORY CATALOG
CREATE TABLE IF NOT EXISTS public.sideline_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    sku VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    quantity_on_hand INT DEFAULT 0,
    default_wholesale_cost DECIMAL(10,2) DEFAULT 0.00,
    default_retail_price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RECEIVED INVOICES (COST BASING)
CREATE TABLE IF NOT EXISTS public.received_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.sideline_products(id) ON DELETE CASCADE,
    vendor_name VARCHAR(255) NOT NULL,
    invoice_number VARCHAR(100) NOT NULL,
    quantity_received INT NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    received_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REPAIR ORDER (RO) BILLING & LABOR TRACKER
CREATE TABLE IF NOT EXISTS public.ro_billings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.sideline_products(id) ON DELETE RESTRICT,
    ro_number VARCHAR(100) NOT NULL,
    tech_name VARCHAR(150),
    quantity_billed INT NOT NULL DEFAULT 1,
    unit_cost_at_sale DECIMAL(10,2) NOT NULL,
    unit_retail_billed DECIMAL(10,2) NOT NULL,
    labor_hours_logged DECIMAL(5,2) DEFAULT 0.00,
    labor_cost_rate DECIMAL(10,2) DEFAULT 0.00,
    labor_retail_billed DECIMAL(10,2) DEFAULT 0.00,
    total_net_margin DECIMAL(10,2) GENERATED ALWAYS AS (
        (unit_retail_billed * quantity_billed + labor_retail_billed) - 
        (unit_cost_at_sale * quantity_billed + (labor_hours_logged * labor_cost_rate))
    ) STORED,
    billed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY ENFORCEMENT
ALTER TABLE public.sideline_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.received_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ro_billings ENABLE ROW LEVEL SECURITY;
