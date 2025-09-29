-- Step 2: Create indexes and enable RLS
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public order creation" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public order reading by ID" ON orders
  FOR SELECT USING (true);
