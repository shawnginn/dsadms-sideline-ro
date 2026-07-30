export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key")
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      product_id, 
      ro_number, 
      tech_name, 
      quantity_billed, 
      unit_cost_at_sale, 
      unit_retail_billed, 
      labor_hours_logged, 
      labor_cost_rate, 
      labor_retail_billed 
    } = body;

    // 1. Insert Repair Order Billing Entry (Margin calculated automatically in DB)
    const { data: roBilling, error: roError } = await supabase
      .from('ro_billings')
      .insert([{ 
        product_id, 
        ro_number, 
        tech_name, 
        quantity_billed: quantity_billed || 1, 
        unit_cost_at_sale, 
        unit_retail_billed, 
        labor_hours_logged: labor_hours_logged || 0, 
        labor_cost_rate: labor_cost_rate || 0, 
        labor_retail_billed: labor_retail_billed || 0 
      }])
      .select()
      .single();

    if (roError) throw roError;

    // 2. Decrement Physical Inventory Count
    const { error: stockError } = await supabase.rpc('decrement_inventory', {
      p_id: product_id,
      qty: quantity_billed || 1
    });

    return NextResponse.json({ success: true, roBilling });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
