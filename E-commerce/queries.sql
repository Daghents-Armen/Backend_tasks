SELECT orders.id, users.full_name, orders.status, orders.created_at
FROM users INNER JOIN orders ON users.id = orders.user_id;

SELECT users.full_name, orders.id, orders.status
FROM users LEFT JOIN orders ON users.id = orders.user_id;

SELECT orders.id, users.full_name, orders.status 
FROM users RIGHT JOIN orders ON users.id = orders.user_id;

SELECT users.full_name, orders.id, orders.status 
FROM users FULL JOIN orders ON users.id = orders.user_id;

SELECT orders.id, products.title, order_items.quantity, order_items.unit_price_amd
FROM orders INNER JOIN order_items ON orders.id = order_items.order_id
INNER JOIN products ON products.id = order_items.product_id;

SELECT orders.id, orders.status, payments.provider, payments.amount_amd
FROM orders LEFT JOIN payments ON orders.id = payments.order_id;

SELECT order_id, SUM(quantity * unit_price_amd) FROM order_items
GROUP BY order_id;

SELECT users.full_name, users.id, SUM(order_items.quantity * order_items.unit_price_amd)
FROM users INNER JOIN orders ON users.id = orders.user_id
INNER JOIN order_items ON orders.id = order_items.order_id
GROUP BY users.id, users.full_name;

SELECT products.id, products.title, SUM(order_items.quantity)
FROM products INNER JOIN order_items
ON products.id = order_items.product_id
GROUP BY products.id, products.title;
