BEGIN;

if (SELECT 1 FROM pg_database WHERE datname='e_commerce');

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    price_amd INT NOT NULL CHECK (price_amd >= 0),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'created' CHECK(status IN ('delivered', 'created', 'cancelled', 'in_progress')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE armenian_provider AS ENUM('idram', 'card', 'arca');

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    provider armenian_provider,
    amount_amd INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price_amd INT NOT NULL
    CHECK(unit_price_amd >= 0)
    CHECK(quantity > 0)
);

COMMIT;

