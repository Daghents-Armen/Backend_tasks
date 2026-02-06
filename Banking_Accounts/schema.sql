CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id),
    currency TEXT NOT NULL CHECK(currency IN ('AMD','USD','EUR')),
    balance BIGINT NOT NULL DEFAULT 0 CHECK (balance >= 0),
    status TEXT NOT NULL CHECK(status IN ('active','frozen','closed')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('deposit','withdraw','transfer')),
    from_account_id INT REFERENCES accounts(id),
    to_account_id INT REFERENCES accounts(id),
    amount BIGINT NOT NULL CHECK(amount > 0),
    reference TEXT NOT NULL UNIQUE,
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    meta JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
