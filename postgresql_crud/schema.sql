CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'dropped')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    price_amd INT NOT NULL CHECK (price_amd >= 0),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    state TEXT NOT NULL DEFAULT 'open' CHECK (state IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inventory_items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('laptop', 'monitor', 'cable', 'chair')),
    quantity INT NOT NULL CHECK (quantity >= 0),
    unit_price_amd INT NOT NULL CHECK (unit_price_amd >= 0),
    is_available BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT now()
);