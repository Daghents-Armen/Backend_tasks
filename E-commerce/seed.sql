INSERT INTO users (full_name, email) VALUES
('John', 'john@mail.com'),
('Emili', 'emili@mail.com'),
('Miguel', 'miguel@mail.com'),
('Dave', 'dave@mail.com');

INSERT INTO products (title, price_amd) VALUES
('CPU', 200),
('RAM', 500),
('Monitor', 700),
('GPU', 500),
('Mouse', 23),
('Keyboard', 45);

INSERT INTO orders (user_id, status) VALUES 
(1, 'delivered'),
(1, 'cancelled'),
(2, 'created'),
(2, 'delivered'),
(null, 'created');
(3, 'created');

INSERT INTO order_items (order_id, product_id, quantity, unit_price_amd) VALUES
(1, 1, 2, 5000),
(1, 2, 1, 3000),
(2, 3, 2, 4000),
(2, 4, 1, 5000),
(3, 1, 2, 5000),
(3, 2, 1, 3000),
(4, 3, 2, 4000),
(4, 4, 1, 5000),
(5, 1, 2, 5000),
(5, 2, 1, 3000),
(6, 3, 2, 4000),
(6, 4, 1, 5000);

INSERT INTO payments (order_id, provider, amount_amd) VALUES 
(1, 'card', 530000),
(2, 'idram' 530000),
(4, 'arca', 65000);
