-- Create the orders table in Supabase
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    state TEXT NOT NULL,
    commune TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    product_name TEXT NOT NULL,
    product_price TEXT NOT NULL,
    product_color TEXT,
    product_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert orders (for public submissions)
CREATE POLICY "Allow public inserts" ON orders FOR INSERT WITH CHECK (true);

-- Create a policy that allows authenticated users to read orders (for admin)
CREATE POLICY "Allow authenticated reads" ON orders FOR SELECT TO authenticated USING (true);