-- Create Enums
CREATE TYPE position_side AS ENUM ('LONG', 'SHORT');

CREATE TYPE order_status AS ENUM ('PENDING', 'FILLED');

CREATE TYPE order_action AS ENUM ('BUY', 'SELL');

-- Tag
CREATE TABLE tag_groups (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_tag_group_name UNIQUE (user_id, name)
);

CREATE TABLE tags (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES tag_groups(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trade
CREATE TABLE trades (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  portfolio_id TEXT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  side position_side NOT NULL,
  notes TEXT,
  opened_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Journal Entry
CREATE TABLE journal_folders (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journal_entries (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id TEXT references portfolios(id) ON DELETE SET NULL,
  folder_id TEXT references journal_folders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  date DATE,
  content JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journal_entry_tags (
  journal_entry_id TEXT REFERENCES journal_entries(id) ON DELETE CASCADE,
  tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (journal_entry_id, tag_id)
);

CREATE TABLE journal_templates (
  id TEXT DEFAULT nanoid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_journal_template_name UNIQUE (user_id, name)
);

CREATE OR REPLACE VIEW public.trade_summary WITH ( security_invoker = ON
) AS
-- Pre-aggregate order data
WITH order_aggregates AS (
    SELECT
        o.trade_id,
        -- Position
        SUM(
            CASE WHEN o.status = 'FILLED'
                AND o.action = 'BUY' THEN
                o.quantity
            WHEN o.status = 'FILLED'
                AND o.action = 'SELL' THEN
                - o.quantity
            ELSE
                0
            END) AS position,
        -- Total fee
        SUM(
            CASE WHEN o.status = 'FILLED' THEN
                o.fee
            ELSE
                0
            END) AS total_fee,
        -- BUY
        SUM(
            CASE WHEN o.status = 'FILLED'
                AND o.action = 'BUY' THEN
                o.quantity
            ELSE
                0
            END) AS total_buy_qty,
        SUM(
            CASE WHEN o.status = 'FILLED'
                AND o.action = 'BUY' THEN
                o.quantity * o.price
            ELSE
                0
            END) AS total_buy_value,
        -- SELL
        SUM(
            CASE WHEN o.status = 'FILLED'
                AND o.action = 'SELL' THEN
                o.quantity
            ELSE
                0
            END) AS total_sell_qty,
        SUM(
            CASE WHEN o.status = 'FILLED'
                AND o.action = 'SELL' THEN
                o.quantity * o.price
            ELSE
                0
            END) AS total_sell_value,
        -- Gross PnL
        SUM(
            CASE WHEN o.status = 'FILLED'
                AND o.action = 'SELL' THEN
                o.quantity * o.price
            WHEN o.status = 'FILLED'
                AND o.action = 'BUY' THEN
                - o.quantity * o.price
            ELSE
                0
            END) AS gross_pnl
    FROM
        orders o
    WHERE
        o.status = 'FILLED' -- Filter early to reduce rows
    GROUP BY
        o.trade_id
),
-- Calculate PnL
pnl_calc AS (
    SELECT
        t.id AS trade_id,
        t.side,
        oa.total_buy_qty,
        oa.total_sell_qty,
        oa.total_buy_value,
        oa.total_sell_value,
        oa.total_fee,
        -- Avg Buy Price
        CASE WHEN oa.total_buy_qty = 0 THEN
            0
        ELSE
            oa.total_buy_value / oa.total_buy_qty
        END AS avg_buy_price,
        -- Avg Sell Price
        CASE WHEN oa.total_sell_qty = 0 THEN
            0
        ELSE
            oa.total_sell_value / oa.total_sell_qty
        END AS avg_sell_price,
        -- Gross PnL（without fee）
        CASE WHEN t.side = 'LONG' THEN
            ROUND(LEAST (oa.total_buy_qty, oa.total_sell_qty) * (oa.total_sell_value / NULLIF (oa.total_sell_qty, 0) - oa.total_buy_value / NULLIF (oa.total_buy_qty, 0)), 3)
        WHEN t.side = 'SHORT' THEN
            ROUND(LEAST (oa.total_sell_qty, oa.total_buy_qty) * (oa.total_sell_value / NULLIF (oa.total_sell_qty, 0) - oa.total_buy_value / NULLIF (oa.total_buy_qty, 0)), 3)
        ELSE
            0
        END AS gross_pnl,
        -- Realized PnL
        CASE WHEN t.side = 'LONG' THEN
            ROUND(LEAST (oa.total_buy_qty, oa.total_sell_qty) * (oa.total_sell_value / NULLIF (oa.total_sell_qty, 0) - oa.total_buy_value / NULLIF (oa.total_buy_qty, 0)) - oa.total_fee, 3)
        WHEN t.side = 'SHORT' THEN
            ROUND(LEAST (oa.total_sell_qty, oa.total_buy_qty) * (oa.total_sell_value / NULLIF (oa.total_sell_qty, 0) - oa.total_buy_value / NULLIF (oa.total_buy_qty, 0)) - oa.total_fee, 3)
        ELSE
            0
        END AS realized_pnl
    FROM
        order_aggregates oa
        JOIN trades t ON t.id = oa.trade_id)
    SELECT
        t.id,
        t.portfolio_id,
        t.symbol,
        t.side,
        t.notes,
        t.opened_at,
        t.closed_at,
    -- Tags
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT tg.name), NULL) AS tags,
    -- Position
    COALESCE(oa.position, 0) AS position,
    -- Total fee
    COALESCE(oa.total_fee, 0) AS fee,
    -- Average price
    CASE WHEN t.side = 'LONG'
        AND oa.total_buy_qty > 0 THEN
        ROUND(oa.total_buy_value / oa.total_buy_qty, 3)
    WHEN t.side = 'SHORT'
        AND oa.total_sell_qty > 0 THEN
        ROUND(oa.total_sell_value / oa.total_sell_qty, 3)
    ELSE
        0
    END AS average_price,
    -- PnL
    pnlc.realized_pnl AS pnl,
    -- Status
    CASE WHEN COALESCE(oa.position, 0) != 0 THEN
        'OPEN'
    WHEN pnlc.gross_pnl > 0 THEN
        'WIN'
    WHEN pnlc.gross_pnl < 0 THEN
        'LOSS'
    ELSE
        'BREAK_EVEN'
    END AS status
FROM
    trades t
    LEFT JOIN order_aggregates oa ON oa.trade_id = t.id
    LEFT JOIN pnl_calc pnlc ON pnlc.trade_id = t.id
    LEFT JOIN trade_tags tt ON tt.trade_id = t.id
    LEFT JOIN tags tg ON tg.id = tt.tag_id
GROUP BY
    t.id,
    oa.position,
    oa.total_fee,
    oa.total_buy_qty,
    oa.total_buy_value,
    oa.total_sell_qty,
    oa.total_sell_value,
    pnlc.realized_pnl,
    pnlc.gross_pnl;

-- RPC function to get tag groups by user
CREATE OR REPLACE FUNCTION get_tags_grouped(uid UUID)
RETURNS JSONB
LANGUAGE sql
SET search_path = public
AS $$
  SELECT json_agg(ordered_result)
  FROM (
    SELECT group_id, group_name, tags FROM (
      -- Grouped tags
      SELECT
        tg.id AS group_id,
        tg.name AS group_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name
            )
            ORDER BY t.created_at
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'::json
        ) AS tags,
        tg.created_at AS group_created_at,
        0 AS sort_order
      FROM
        tag_groups tg
      LEFT JOIN tags t ON t.group_id = tg.id AND t.user_id = uid
      WHERE
        tg.user_id = uid
      GROUP BY
        tg.id, tg.name, tg.created_at

      UNION ALL

      -- Ungrouped tags
      SELECT
        'ungrouped' AS group_id,
        'Ungrouped' AS group_name,
        json_agg(
          json_build_object(
            'id', t.id,
            'name', t.name
          )
          ORDER BY t.created_at
        ) AS tags,
        NULL AS group_created_at,
        1 AS sort_order 
      FROM
        tags t
      WHERE
        t.user_id = uid AND t.group_id IS NULL
    ) AS combined_result
    ORDER BY sort_order, group_created_at DESC
  ) AS ordered_result;
$$;

CREATE OR REPLACE FUNCTION add_trade(
  input JSONB
)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  trade_id TEXT := nanoid();
  order_item JSONB;
  tag_id TEXT;
BEGIN
  -- Validate trade input
  IF input->>'side' NOT IN ('LONG', 'SHORT') THEN
    RAISE EXCEPTION 'Invalid side value: %. Must be LONG or SHORT.', input->>'side';
  END IF;

  -- Insert trade
  INSERT INTO trades (
    id, portfolio_id, symbol, side, notes, opened_at, closed_at
  ) VALUES (
    trade_id,
    input->>'portfolio_id',
    input->>'symbol',
    (input->>'side')::position_side,
    input->>'notes',
    (input->>'opened_at')::TIMESTAMPTZ,
    (input->>'closed_at')::TIMESTAMPTZ
  );

  -- Insert orders
  FOR order_item IN 
    SELECT * FROM JSONB_ARRAY_ELEMENTS(input->'orders') 
  LOOP
    -- Validate order input
    IF order_item->>'action' NOT IN ('BUY', 'SELL') THEN
      RAISE EXCEPTION 'Invalid order action: %. Must be BUY or SELL.', order_item->>'action';
    END IF;

    IF order_item->>'status' NOT IN ('PENDING', 'FILLED') THEN
      RAISE EXCEPTION 'Invalid order status: %. Must be PENDING or FILLED.', order_item->>'status';
    END IF;

    -- Insert order
    INSERT INTO orders (
      trade_id, action, quantity, price, fee, status, executed_at
    ) VALUES (
      trade_id,
      (order_item->>'action')::order_action,
      (order_item->>'quantity')::NUMERIC,
      (order_item->>'price')::NUMERIC,
      (order_item->>'fee')::NUMERIC,
      (order_item->>'status')::order_status,
      (order_item->>'executed_at')::TIMESTAMPTZ
    );
  END LOOP;

  -- INSERT trade_tags
  IF input ? 'tag_ids' AND jsonb_typeof(input->'tag_ids') = 'array' THEN
    FOR tag_id IN SELECT JSONB_ARRAY_ELEMENTS_TEXT(input->'tag_ids') LOOP
      INSERT INTO trade_tags (trade_id, tag_id)
      VALUES (trade_id, tag_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  RETURN trade_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_trade(
  input JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_trade_id TEXT := input->>'id';
  order_item JSONB;
  tag_id TEXT;
BEGIN
  -- Check if trade exists
  IF NOT EXISTS (SELECT 1 FROM trades WHERE id = v_trade_id) THEN
    RAISE EXCEPTION 'Trade with id % does not exist.', v_trade_id;
  END IF;

  -- Validate side
  IF input->>'side' NOT IN ('LONG', 'SHORT') THEN
    RAISE EXCEPTION 'Invalid side value: %. Must be LONG or SHORT.', input->>'side';
  END IF;

  -- Update trade
  UPDATE trades SET
    portfolio_id = input->>'portfolio_id',
    symbol = input->>'symbol',
    side = (input->>'side')::position_side,
    notes = input->>'notes',
    opened_at = (input->>'opened_at')::TIMESTAMPTZ,
    closed_at = (input->>'closed_at')::TIMESTAMPTZ
  WHERE id = v_trade_id;

  -- Reset orders
  DELETE FROM orders WHERE trade_id = v_trade_id;

  -- Insert orders
  FOR order_item IN 
    SELECT * FROM JSONB_ARRAY_ELEMENTS(input->'orders') 
  LOOP
    -- Validate order input
    IF order_item->>'action' NOT IN ('BUY', 'SELL') THEN
      RAISE EXCEPTION 'Invalid order action: %. Must be BUY or SELL.', order_item->>'action';
    END IF;

    IF order_item->>'status' NOT IN ('PENDING', 'FILLED') THEN
      RAISE EXCEPTION 'Invalid order status: %. Must be PENDING or FILLED.', order_item->>'status';
    END IF;

    -- Insert orders
    INSERT INTO orders (
      trade_id, action, quantity, price, fee, status, executed_at
    ) VALUES (
      v_trade_id,
      (order_item->>'action')::order_action,
      (order_item->>'quantity')::NUMERIC,
      (order_item->>'price')::NUMERIC,
      (order_item->>'fee')::NUMERIC,
      (order_item->>'status')::order_status,
      (order_item->>'executed_at')::TIMESTAMPTZ
    );
  END LOOP;

  -- Reset trade_tags
  DELETE FROM trade_tags WHERE trade_id = v_trade_id;

-- INSERT trade_tags
  IF input ? 'tag_ids' AND jsonb_typeof(input->'tag_ids') = 'array' THEN
    FOR tag_id IN SELECT JSONB_ARRAY_ELEMENTS_TEXT(input->'tag_ids') LOOP
      INSERT INTO trade_tags (trade_id, tag_id)
      VALUES (v_trade_id, tag_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION get_journal(uid UUID)
RETURNS TABLE (
    folder_id TEXT,
    folder_name TEXT,
    -- parent_folder_id TEXT,
    entry_id TEXT,
    entry_title TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY

  -- Entries inside folders
  SELECT
    f.id AS folder_id,
    f.name AS folder_name,
    -- f.parent_id AS parent_folder_id,
    e.id AS entry_id,
    e.title AS entry_title,
    e.created_at
  FROM journal_folders f
  LEFT JOIN journal_entries e ON f.id = e.folder_id
  WHERE f.user_id = uid

  UNION ALL

  -- Uncategorized (folder is NULL)
  SELECT
    NULL AS folder_id,
    '_uncategorized' AS folder_name,
    -- NULL AS parent_folder_id,
    e.id AS entry_id,
    e.title AS entry_title,
    e.created_at
  FROM journal_entries e
  WHERE e.folder_id IS NULL AND e.user_id = uid;

END;
$$;

-- Trigger function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to update updated_at column on journal_entries table
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

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
ALTER TABLE tag_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_templates ENABLE ROW LEVEL SECURITY;

-- Tag Group Policies
CREATE POLICY "Users can view their own tag groups"
ON tag_groups
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own tag groups"
ON tag_groups
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tag groups"
ON tag_groups
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own tag groups"
ON tag_groups
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

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

-- Journal Folder Policies
CREATE POLICY "Users can view their own journal folders" ON journal_folders
    FOR SELECT TO authenticated
        USING (user_id = auth.uid ());

CREATE POLICY "Users can create their own journal folders" ON journal_folders
    FOR INSERT TO authenticated
        WITH CHECK (user_id = auth.uid ());

CREATE POLICY "Users can update their own journal folders" ON journal_folders
    FOR UPDATE TO authenticated
        USING (user_id = auth.uid ())
        WITH CHECK (user_id = auth.uid ());

CREATE POLICY "Users can delete their own journal folders" ON journal_folders
    FOR DELETE TO authenticated
        USING (user_id = auth.uid ());

-- Journal Entry Policies
CREATE POLICY "Users can view their own journal entries" ON journal_entries
    FOR SELECT TO authenticated
        USING (user_id = auth.uid ());

CREATE POLICY "Users can insert their own journal entries" ON journal_entries
    FOR INSERT TO authenticated
        WITH CHECK (user_id = auth.uid ());

CREATE POLICY "Users can update their own journal entries" ON journal_entries
    FOR UPDATE TO authenticated
        USING (user_id = auth.uid ())
        WITH CHECK (user_id = auth.uid ());

CREATE POLICY "Users can delete their own journal entries" ON journal_entries
    FOR DELETE TO authenticated
        USING (user_id = auth.uid ());

-- Journal Entry Tag Policies
CREATE POLICY "Users can view their own journal entry tags"
ON journal_entry_tags
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM journal_entries
    WHERE journal_entries.id = journal_entry_tags.journal_entry_id
      AND journal_entries.user_id = auth.uid()
  )
  AND
  EXISTS (
    SELECT 1 FROM tags
    WHERE tags.id = journal_entry_tags.tag_id
      AND tags.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert tags for their own entries"
ON journal_entry_tags
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM journal_entries
    WHERE journal_entries.id = journal_entry_tags.journal_entry_id
      AND journal_entries.user_id = auth.uid()
  )
  AND
  EXISTS (
    SELECT 1 FROM tags
    WHERE tags.id = journal_entry_tags.tag_id
      AND tags.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete tags for their own entries"
ON journal_entry_tags
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM journal_entries
    WHERE journal_entries.id = journal_entry_tags.journal_entry_id
      AND journal_entries.user_id = auth.uid()
  )
  AND
  EXISTS (
    SELECT 1 FROM tags
    WHERE tags.id = journal_entry_tags.tag_id
      AND tags.user_id = auth.uid()
  )
);

-- Journal Template Policies
CREATE POLICY "Users can view their own journal templates" ON journal_templates
    FOR SELECT TO authenticated
        USING (user_id = auth.uid ());

CREATE POLICY "Users can insert their own journal templates" ON journal_templates
    FOR INSERT TO authenticated
        WITH CHECK (user_id = auth.uid ());

CREATE POLICY "Users can update their own journal templates" ON journal_templates
    FOR UPDATE TO authenticated
        USING (user_id = auth.uid ())
        WITH CHECK (user_id = auth.uid ());

CREATE POLICY "Users can delete their own journal templates" ON journal_templates
    FOR DELETE TO authenticated
        USING (user_id = auth.uid ());