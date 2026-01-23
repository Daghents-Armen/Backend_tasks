INSERT INTO students (full_name, email,
phone, status) VALUES ('ani', 'an@mail.com', '091671223', 'active'),
('vahram', 'vahram@mail.com', '091198223', 'active'),
('armen', 'armen@mail.com', '091111223', 'active'), 
('vazgen', 'vazgen@mail.com', '091134223', 'paused'),
('steve', 'steve@mail.com', '091132223', 'active'), 
('lianna', 'lianna@mail.com', '091153723', 'paused'),
('lucas', 'lucas@mail.com', '091161223', 'active'),
('ignacio', 'ignacio@mail.com', '091191223', 'active');

INSERT INTO courses (title, level, price_amd, is_published)
VALUES ('Computer Science', 'intermediate', 22, true),
('physics', 'beginner', 14, false),
('math', 'advanced', 23, false),
('history', 'intermediate', 10, true),
('biology', 'intermediate', 7, true);

INSERT INTO support_tickets (subject, description, priority, state) VALUES
('Login issue', 'Cannot log into the system', 'high', 'open'),
('Payment error', 'Payment not going through', 'high', 'in_progress'),
('UI bug', 'Button is not clickable', 'medium', 'open'),
('Slow performance', 'App is very slow on dashboard', 'low', 'open'),
('Email problem', 'Verification email not received', 'medium', 'resolved'),
('Crash on start', 'App crashes on startup', 'high', 'open'),
('Password reset', 'Reset link not working', 'medium', 'closed'),
('Data sync', 'Data not syncing properly', 'low', 'open');

INSERT INTO inventory_items (name, category, quantity, unit_price_amd, is_available)
VALUES
('Dell Laptop', 'laptop', 5, 350000, true),
('HP Laptop', 'laptop', 0, 320000, true),
('Office Chair', 'chair', 12, 45000, true),
('Meeting Chair', 'chair', 0, 40000, true),
('HDMI Cable', 'cable', 30, 3000, true),
('Ethernet Cable', 'cable', 0, 2500, true),
('24-inch Monitor', 'monitor', 7, 85000, true),
('27-inch Monitor', 'monitor', 3, 120000, true),
('CHAIR', 'chair', 15, 7000, true),
('Old laptop', 'laptop', 0, 90000, false);

SELECT * FROM students WHERE status = 'active'
ORDER BY created_at DESC;

SELECT * FROM students WHERE email = 'armen@mail.com';

SELECT full_name, phone FROM students WHERE phone IS NOT NULL;

SELECT * FROM courses WHERE is_published = true;

SELECT * FROM courses WHERE price_amd BETWEEN 12 AND 20;

SELECT * FROM support_tickets WHERE state = 'open' AND priority = 'high';

SELECT * FROM support_tickets
WHERE created_at >= NOW() - INTERVAL '7 days';

SELECT * FROM inventory_items WHERE quantity = 0;

SELECT name, quantity, unit_price_amd, quantity * unit_price_amd AS total_value_amd
FROM inventory_items;

UPDATE students SET status = 'paused'
WHERE status = 'active' AND email = 'steve@mail.com';

UPDATE students SET phone = '099123456'
WHERE email = 'lianna@mail.com';

UPDATE courses SET is_published = true
WHERE level = 'beginner';

UPDATE support_tickets
SET state = 'in_progress'
WHERE id IN (
  SELECT id
  FROM support_tickets
  WHERE state = 'open'
  ORDER BY created_at
  LIMIT 2
);

UPDATE support_tickets
SET state = 'resolved'
WHERE id = 1;

UPDATE inventory_items
SET quantity = quantity + 10,
updated_at = now()
WHERE name = 'HP Laptop';

DELETE FROM students WHERE email = 'lucas@mail.com';

DELETE FROM students WHERE status = 'dropped';

DELETE FROM inventory_items WHERE is_available = false;

