# 🚀 Pure RESTful CRUD API (Node.js + Express + MongoDB)

A backend-only REST API built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and standard npm libraries using modern **JavaScript (ES Modules)**. No views, no frontend templates—100% pure JSON API.

---

## 📦 Libraries Used

| Library | Version | Purpose |
| :--- | :--- | :--- |
| **`express`** | `^4.21.2` | Minimalist web framework for routing and middleware. |
| **`mongoose`** | `^8.9.5` | ODM (Object Data Modeling) library for MongoDB with schema validation, indexes, and hooks. |
| **`joi`** | `^17.13.3` | Schema validation library for incoming request body, query parameters, and IDs. |
| **`cors`** | `^2.8.5` | Cross-Origin Resource Sharing middleware. |
| **`dotenv`** | `^16.4.7` | Loads environment variables from `.env`. |
| **`morgan`** | `^1.10.0` | HTTP request logger middleware. |
| **`nodemon`** | `^3.1.9` | Auto-restarts server during development. |

---

## 📁 API Architecture

```
d:/typescript-node/
├── src/
│   ├── config/
│   │   └── db.js                 # Mongoose connection & disconnect handlers
│   ├── constants/
│   │   └── categories.js         # Allowed categories & status enums
│   ├── controllers/
│   │   └── product.controller.js # Full CRUD methods (Create, Read, Update, Delete, Stats)
│   ├── middleware/
│   │   ├── error.middleware.js   # 404 handler & centralized error handler
│   │   └── validate.middleware.js# Generic Joi request validation middleware
│   ├── models/
│   │   └── product.model.js      # Mongoose schema, compound indexes, pre-save hook
│   ├── routes/
│   │   ├── index.js              # Base API router with health check
│   │   └── product.routes.js     # Product REST routes
│   ├── utils/
│   │   ├── apiResponse.js        # Standardized JSON response envelope
│   │   └── seeder.js             # Database seeding script with realistic data
│   ├── validators/
│   │   └── product.validator.js  # Joi validation schemas (body, query, params)
│   ├── app.js                    # Express app configuration & middlewares
│   └── server.js                 # Server entry point
├── .env                          # Local environment variables
├── .env.example
├── .gitignore
└── package.json
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/product_crud_db
CLIENT_URL=http://localhost:5000
```

### 3. Seed Sample Data (Optional)
```bash
npm run seed
```

### 4. Run Server
```bash
npm run dev    # Development mode (nodemon)
# or
npm start      # Production mode
```

---

## 📡 REST API Endpoints

### Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root API info & endpoint directory |
| `GET` | `/api/v1/health` | Health & uptime check |
| `POST` | `/api/v1/products` | **Create** a new product (validated via Joi) |
| `GET` | `/api/v1/products` | **Read all** products (with search, category filter, pagination, sorting) |
| `GET` | `/api/v1/products/:id` | **Read one** product by MongoDB ObjectId |
| `PUT` | `/api/v1/products/:id` | **Update** product by ID (validated via Joi) |
| `DELETE` | `/api/v1/products/:id` | **Delete** product by ID |
| `GET` | `/api/v1/products/analytics/stats` | Aggregated stats (total products, average price, total stock, category breakdown) |

---

### Query Parameters for `GET /api/v1/products`

- `page` *(number, default: 1)*
- `limit` *(number, default: 10, max: 100)*
- `search` *(string)* - searches title, description, and SKU
- `category` *(string)* - e.g. `Electronics`, `Computers`, `Accessories`, `Audio`, `Gaming`, `Wearables`, `Home & Kitchen`, `Other`
- `minPrice` & `maxPrice` *(numbers)*
- `inStock` *(boolean: `true` or `false`)*
- `sortBy` *(string: `createdAt`, `price`, `title`, `stock`, `rating`)*
- `sortOrder` *(string: `asc` or `desc`)*

---

### 💻 cURL / API Testing Examples

#### 1. Create a Product (`POST /api/v1/products`)
```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Logitech MX Master 3S Wireless Mouse",
    "description": "Ergonomic wireless performance mouse with 8K DPI tracking and quiet clicks.",
    "price": 99.99,
    "category": "Accessories",
    "stock": 25,
    "sku": "LOGI-MXM3S-01",
    "rating": 4.9,
    "tags": ["mouse", "ergonomic", "wireless"]
  }'
```

#### 2. Get All Products with Filters (`GET /api/v1/products`)
```bash
curl "http://localhost:5000/api/v1/products?category=Accessories&minPrice=50&sortBy=price&sortOrder=asc&page=1&limit=5"
```

#### 3. Get Single Product by ID (`GET /api/v1/products/:id`)
```bash
curl http://localhost:5000/api/v1/products/<PRODUCT_ID>
```

#### 4. Update Product (`PUT /api/v1/products/:id`)
```bash
curl -X PUT http://localhost:5000/api/v1/products/<PRODUCT_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "price": 89.99,
    "stock": 18
  }'
```

#### 5. Delete Product (`DELETE /api/v1/products/:id`)
```bash
curl -X DELETE http://localhost:5000/api/v1/products/<PRODUCT_ID>
```

#### 6. Analytics & Aggregation (`GET /api/v1/products/analytics/stats`)
```bash
curl http://localhost:5000/api/v1/products/analytics/stats
```
