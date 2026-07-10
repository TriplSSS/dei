CREATE TABLE IF NOT EXISTS products (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_num INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_active_category_idx ON products (active, category);
CREATE INDEX IF NOT EXISTS products_updated_at_idx ON products (updated_at DESC);
