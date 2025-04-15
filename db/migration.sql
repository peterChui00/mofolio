-- Create Enums
CREATE TYPE position_side AS ENUM ('LONG', 'SHORT');

CREATE TYPE order_status AS ENUM ('PENDING', 'FILLED');

CREATE TYPE order_action AS ENUM ('BUY', 'SELL');

-- Tag
CREATE TABLE tags (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_tag_name UNIQUE (user_id, name)
);

-- Portfolio
CREATE TABLE portfolios (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  base_currency TEXT NOT NULL DEFAULT 'USD' CHECK (
     LENGTH(base_currency) = 3
    AND base_currency ~ '^[A-Z]{3}$'
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trade
CREATE TABLE trades (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  portfolio_id TEXT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  side position_side NOT NULL,
  notes TEXT,
  opened_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE trade_tags (
  trade_id TEXT REFERENCES trades(id) ON DELETE CASCADE,
  tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (trade_id, tag_id)
);

-- Order
CREATE TABLE orders (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  trade_id TEXT NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
  action order_action NOT NULL,
  quantity NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  fee NUMERIC NOT NULL,
  status order_status NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal Entry
CREATE TABLE journal_entries (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE journal_entry_tags (
  journal_entry_id TEXT REFERENCES journal_entries(id) ON DELETE CASCADE,
  tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (journal_entry_id, tag_id)
);

-- Create trigger function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public, extensions
AS $$
BEGIN
  -- Insert default portfolio for the new user
  INSERT INTO public.portfolios (user_id, name)
  VALUES (
    NEW.id,
    'My Portfolio'
  );

  RETURN NEW;
END;
$$;

-- Trigger handle_new_user every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

ALTER TABLE trade_tags ENABLE ROW LEVEL SECURITY;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

ALTER TABLE journal_entry_tags ENABLE ROW LEVEL SECURITY;

-- Tag Policies
CREATE POLICY "Users can view their own tags"
ON tags
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own tags"
ON tags
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tags"
ON tags
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own tags"
ON tags
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Portfolio Policies
CREATE POLICY "Users can view their own portfolios"
ON portfolios
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own portfolios"
ON portfolios
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own portfolios"
ON portfolios
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own portfolios"
ON portfolios
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Trade Policies
CREATE POLICY "Users can view their own trades"
ON trades
FOR SELECT
TO authenticated
USING (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create trades in their own portfolios"
ON trades
FOR INSERT
TO authenticated
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own trades"
ON trades
FOR UPDATE
TO authenticated
USING (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own trades"
ON trades
FOR DELETE
TO authenticated
USING (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

-- Trade Tag Policies
CREATE POLICY "Users can view their own trade tags"
ON trade_tags
FOR SELECT
TO authenticated
USING (
  trade_id IN (
    SELECT trades.id FROM trades
    JOIN portfolios ON trades.portfolio_id = portfolios.id
    WHERE portfolios.user_id = auth.uid()
  )
  AND tag_id IN (
    SELECT id FROM tags WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can tag their own trades"
ON trade_tags
FOR INSERT
TO authenticated
WITH CHECK (
  trade_id IN (
    SELECT trades.id FROM trades
    JOIN portfolios ON trades.portfolio_id = portfolios.id
    WHERE portfolios.user_id = auth.uid()
  )
  AND tag_id IN (
    SELECT id FROM tags WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove tags from their own trades"
ON trade_tags
FOR DELETE
TO authenticated
USING (
  trade_id IN (
    SELECT trades.id FROM trades
    JOIN portfolios ON trades.portfolio_id = portfolios.id
    WHERE portfolios.user_id = auth.uid()
  )
  AND tag_id IN (
    SELECT id FROM tags WHERE user_id = auth.uid()
  )
);

-- Order Policies
CREATE POLICY "Users can view orders for their own trades"
ON orders
FOR SELECT
TO authenticated
USING (
  trade_id IN (
    SELECT trades.id FROM trades
    JOIN portfolios ON trades.portfolio_id = portfolios.id
    WHERE portfolios.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create orders for their own trades"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (
  trade_id IN (
    SELECT trades.id FROM trades
    JOIN portfolios ON trades.portfolio_id = portfolios.id
    WHERE portfolios.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update orders for their own trades"
ON orders
FOR UPDATE
TO authenticated
USING (
  trade_id IN (
    SELECT trades.id FROM trades
    JOIN portfolios ON trades.portfolio_id = portfolios.id
    WHERE portfolios.user_id = auth.uid()
  )
)
WITH CHECK (
  trade_id IN (
    SELECT trades.id FROM trades
    JOIN portfolios ON trades.portfolio_id = portfolios.id
    WHERE portfolios.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete orders for their own trades"
ON orders
FOR DELETE
TO authenticated
USING (
  trade_id IN (
    SELECT trades.id FROM trades
    JOIN portfolios ON trades.portfolio_id = portfolios.id
    WHERE portfolios.user_id = auth.uid()
  )
);

-- Journal Entry Policies
CREATE POLICY "Users can view their own journal entries"
ON journal_entries
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own journal entries"
ON journal_entries
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own journal entries"
ON journal_entries
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own journal entries"
ON journal_entries
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Journal Entry Tag Policies
CREATE POLICY "Users can view their own journal entry tags"
ON journal_entry_tags
FOR SELECT
TO authenticated
USING (
  journal_entry_id IN (
    SELECT id FROM journal_entries WHERE user_id = auth.uid()
  )
  AND
  tag_id IN (
    SELECT id FROM tags WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can tag their own journal entries"
ON journal_entry_tags
FOR INSERT
TO authenticated
WITH CHECK (
  journal_entry_id IN (
    SELECT id FROM journal_entries WHERE user_id = auth.uid()
  )
  AND
  tag_id IN (
    SELECT id FROM tags WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove tags from their own journal entries"
ON journal_entry_tags
FOR DELETE
TO authenticated
USING (
  journal_entry_id IN (
    SELECT id FROM journal_entries WHERE user_id = auth.uid()
  )
  AND
  tag_id IN (
    SELECT id FROM tags WHERE user_id = auth.uid()
  )
);