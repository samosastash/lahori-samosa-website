-- Fix RLS policies for orders table
-- First, let's check current policies
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public order creation" ON orders;
DROP POLICY IF EXISTS "Allow public order reading by ID" ON orders;

-- Create new policies that actually work
CREATE POLICY "Enable insert for public" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for public" ON orders
  FOR SELECT USING (true);

-- Verify the policies were created
SELECT * FROM pg_policies WHERE tablename = 'orders';
