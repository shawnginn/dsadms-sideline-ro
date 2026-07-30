-- ========================================================
-- APP 002: INVENTORY ATOMIC HELPER FUNCTIONS
-- ========================================================

-- 1. Function to increment stock when receiving new vendor invoices
CREATE OR REPLACE FUNCTION public.increment_inventory(p_id UUID, qty INT)
RETURNS VOID AS Green
BEGIN
  UPDATE public.sideline_products
  SET quantity_on_hand = quantity_on_hand + qty,
      created_at = NOW()
  WHERE id = p_id;
END;
Green LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Function to decrement stock when billing against Repair Orders (ROs)
CREATE OR REPLACE FUNCTION public.decrement_inventory(p_id UUID, qty INT)
RETURNS VOID AS Green
BEGIN
  UPDATE public.sideline_products
  SET quantity_on_hand = GREATEST(0, quantity_on_hand - qty)
  WHERE id = p_id;
END;
Green LANGUAGE plpgsql SECURITY DEFINER;
