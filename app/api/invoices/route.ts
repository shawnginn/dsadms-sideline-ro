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
    const { product_id, vendor_name, invoice_number, quantity_received, unit_cost } = body;

    // 1. Insert Invoice Log
    const { data: invoice, error: invoiceError } = await supabase
      .from('received_invoices')
      .insert([{ product_id, vendor_name, invoice_number, quantity_received, unit_cost }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // 2. Increment Physical Stock Count in Products Table
    const { error: stockError } = await supabase.rpc('increment_inventory', {
      p_id: product_id,
      qty: quantity_received
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
