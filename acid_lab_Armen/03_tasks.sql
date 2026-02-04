UPDATE accounts SET balance = balance - 400 WHERE id = 1;
INSERT INTO transfers (from_account_id, to_account_id, amount_amd) VALUES
(1, 2, -1);
UPDATE accounts SET balance = balance + 400 WHERE id = 2;

BEGIN;

UPDATE accounts SET balance = balance - 400 WHERE id = 1;
INSERT INTO transfers (from_account_id, to_account_id, amount_amd) VALUES
(1, 2, -1);
UPDATE accounts SET balance = balance + 400 WHERE id = 2;

COMMIT;

BEGIN

UPDATE accounts SET balance = balance - 100 WHERE id = 1;

SAVEPOINT step1;

INSERT INTO transfers (from_account_id, to_account_id, amount_amd) VALUES
(1, 2, -1);

ROLLBACK TO step1;

INSERT INTO transfers (from_account_id, to_account_id, amount_amd, note)
VALUES (1, 2, 100, 'partial transfer after savepoint');

COMMIT;
