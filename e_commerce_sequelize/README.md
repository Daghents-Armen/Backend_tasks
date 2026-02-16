# E-Commerce Backend API
### Express + Sequelize + PostgreSQL
Clean Architecture • Migration-First • Transaction-Safe

---

# Project Overview

This is a production-style REST API for an E-Commerce system built using:

- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- Sequelize CLI

The project demonstrates:

- Migration-first database design
- Clean layered architecture
- Transactions for critical business logic
- Proper separation of concerns
- Nested associations
- Aggregation queries
- Pagination & filtering
- Centralized error handling

---

# Core Features

## Entities

- Users
- Products
- Orders
- Order Items (Many-to-Many bridge table)
- Addresses (optional)

## Key Sequelize Concepts Used

- Sequelize CLI
- Config vs runtime connection
- Migrations
- Models
- Associations
- Transactions
- Nested include
- Aggregation (SUM)
- Pagination (limit/offset)

---

# Architecture

This project follows a layered structure:

Routes → Controllers → Services → Models → Database

### Layer Responsibilities

| Layer | Responsibility |
|--------|----------------|
| Routes | Maps URL to controller |
| Controllers | Handle HTTP (req/res only) |
| Services | Business logic + transactions |
| Models | ORM mapping |
| Migrations | Database schema |
| Config | Database connection |

---

```
---

# Installation

##  Clone Repository

```bash
git clone <your-repo-url>
cd project
```

## Install Dependencies

```bash
npm install
```

If creating from scratch:

```bash
npm init -y
npm i express sequelize pg pg-hstore dotenv
npm i -D sequelize-cli nodemon
```

---

# Environment Variables

Create a `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASS=postgres
PORT=3000
```

---

#  Database Setup

IMPORTANT  
This project uses migration-first schema management.

- Models DO NOT create tables
- `sequelize.sync()` is NOT used
- Tables are created via migrations

---

## Step 1 — Create Database

```bash
npm run db:create
```

## Step 2 — Run Migrations

```bash
npm run db:migrate
```

## Step 3 — Start Server

```bash
npm run dev
```

---

#  Available Scripts

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js",

  "db:create": "sequelize-cli db:create",
  "db:drop": "sequelize-cli db:drop",
  "db:migrate": "sequelize-cli db:migrate",
  "db:rollback": "sequelize-cli db:migrate:undo",
  "db:seed": "sequelize-cli db:seed:all",
  "db:reset": "sequelize-cli db:drop && sequelize-cli db:create && sequelize-cli db:migrate && sequelize-cli db:seed:all"
}
```

---

# Database Design

## Tables

- users
- products
- orders
- order_items
- addresses (optional)

---

## Relationships

User 1 → N Orders  
Order 1 → N OrderItems  
Product 1 → N OrderItems  
User 1 → N Addresses (optional)

---

## Why `order_items` Exists?

Orders and Products have a many-to-many relationship.

The `order_items` table stores:

- quantity
- unit_price (price snapshot at purchase time)
- order_id
- product_id

This prevents price changes from affecting historical orders.

---

#  Config vs Runtime DB Connection

## config/config.js

Used by Sequelize CLI for:

- migrations
- seeders
- db:create
- db:drop

---

## config/db.js

Used by Express runtime for:

- Connecting to DB
- Running queries
- Transactions

---

#  API Endpoints

---

##  Users

### Create User
POST /users

### Get All Users
GET /users

### Get User by ID
GET /users/:id

### Get User Orders
GET /users/:id/orders

---

## Products

### Create Product
POST /products

### List Products (pagination + filters)
GET /products?page=1&limit=10

### Update Product
PATCH /products/:id

---

##  Orders

### Create Order
POST /orders

### Add Item to Order (Transaction)
POST /orders/:id/items

### Get Order with Items
GET /orders/:id

### Change Order Status
PATCH /orders/:id/status

---

#  Transactions (Critical Logic)

Transactions are used for:

- Adding item to order
- Updating stock
- Restoring stock on cancel
- Recomputing order total

Example flow:

1. Verify order is pending
2. Check product stock
3. Insert/update order_item
4. Decrement product stock
5. Recalculate order total
6. Commit transaction

If any step fails → rollback.

---

#  Advanced Queries

### Nested Include

Order → OrderItems → Product

### Aggregation

Top-selling products using:

SUM(quantity)

### Pagination

Using:

limit / offset

---

#  Server Startup Flow

server.js:

1. Load environment variables
2. Connect to database
3. Authenticate connection
4. Start Express server

-Server does NOT:
- Create tables
- Run migrations

---

#  Important Rules

- Never use `sequelize.sync()` in production
- Always use migrations
- Keep controllers thin
- Business logic must live in services
- Always use transactions for multi-step DB operations
- Never expose passwordHash in API responses

---

#  Development Workflow

1. Create migration
2. Run migration
3. Create model
4. Define associations
5. Create service logic
6. Create controller
7. Wire route
8. Test endpoint

---

#  Production Notes

For production:

- Use a real password hashing system (bcrypt)
- Add validation middleware
- Add authentication (JWT)
- Add role-based authorization
- Add request validation (Joi/Zod)
- Add logging system
- Add rate limiting
- Use environment-based configs

---

#  Educational Purpose

This project is designed to teach:

- How ORMs really work
- Why migrations matter
- Clean architecture in Node.js
- Proper transaction usage
- Scalable backend structure

---

#  License

MIT

---

# Author

Built as a structured learning project for mastering Sequelize and Express backend architecture.

