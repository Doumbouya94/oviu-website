# OVIU — Custom Creative Production Platform

> Full-stack e-commerce web application built for **OVIU**, a Canadian custom production brand specializing in personalized apparel, accessories, and creative gifts. Developed as part of an internship.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Live Features](#live-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Security](#security)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Acknowledgements](#acknowledgements)
- [Team Collaboration](#Team)

---

## About the Project

OVIU is a creative brand that helps individuals, families, small businesses, and communities express their identity through custom products — from DTF and HTV printed apparel to 3D-printed accessories and vinyl stickers.

This web platform was designed and developed to:

- Introduce and represent the OVIU brand online
- Display a bilingual (English / French) product catalog with detailed variant management
- Allow customers to browse, customize, and purchase products
- Provide administrators with a full-featured dashboard to manage products and monitor orders

**OVIU** stands for: **O**riginality · **V**ision · **I**dentity · **U**niqueness

---

## Live Features

**Customer-Facing**
- Home, About, Gallery, FAQ, and Contact pages
- Bilingual interface (EN / FR) via a global Language Context
- Product catalog with size, color, and variant browsing
- Shopping cart and Stripe-powered checkout
- Responsive design across mobile and desktop

**Admin Dashboard**
- Protected route (authenticated access only)
- Product management: create, read, update, and delete products
- Bilingual product form with drag-and-drop image upload
- Image hosting via Cloudinary with transformation support
- Order statistics: daily and monthly order tracking
- Clean table UI with inline delete confirmation and image lightbox

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, JavaScript (ES2022+) |
| Styling | CSS Modules, TailwindCSS,custom design tokens |
| State / Context | React Context API (Language, Auth) |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| File Storage | Cloudinary (image upload + CDN delivery) |
| Payments | Stripe (checkout sessions) |
| Auth | JWT (JSON Web Tokens) via HTTP headers |
| Dev Tools | ESLint, Vite HMR, Nodemon |

---

## Project Architecture

The project follows a clean separation between frontend and backend, organized by feature on the client side and by responsibility on the server side.

```
oviu/
├── backend/               # Express REST API
│   ├── config/            # DB connection (MongoDB) and Cloudinary setup
│   ├── controllers/       # Business logic: auth, products, orders
│   ├── middleware/        # Multer upload handler, JWT auth guard
│   ├── models/            # Mongoose schemas: Product, Order, Payment
│   └── routes/            # Express routers: /products, /orders
│
└── frontend/              # React + Vite SPA
    └── src/
        ├── components/    # Shared layout components (NavBar, Footer)
        ├── context/       # Global Language context (EN/FR switching)
        ├── features/      # Page-level feature modules
        │   ├── admin/     # Admin dashboard + product form
        │   ├── home/      # Landing page
        │   ├── about-us/  # Brand story
        │   ├── products-page/
        │   ├── gallery-portfolio/
        │   ├── cart/
        │   ├── payment/
        │   ├── contact-us/
        │   └── FAQ/
        ├── lib/           # Shared API helper (apiFetch)
        ├── routes/        # React Router configuration
        └── translations/  # EN/FR string maps
```

### Data Models

**Product** — Bilingual apparel model with full variant support:
- `name`, `description` (EN + FR)
- `category`, `neckType`, `material`
- `sizes[]`, `colors[]`
- `stockVariants[]` — matrix of size × color × quantity
- `images[]` — Cloudinary URLs + alt text (EN + FR)
- `price`, `isCustomizable`, `tags[]`

**Order** — Tracks customer purchases with line items, status, and payment reference.

**Payment** — Stores Stripe session metadata linked to an order.

---

## Security

Several security measures were applied across the stack:

**Authentication & Authorization**
- JWT-based authentication: tokens are issued on login and must be included in the `Authorization` header for all protected routes
- A dedicated `auth` middleware validates tokens server-side before any sensitive operation is executed
- The `/admin` route is conditionally rendered client-side and gated server-side — no admin data is reachable without a valid token

**Input Validation**
- Mongoose schema-level validation enforces required fields, data types, and enum constraints on every write operation
- Controller-level `try/catch` blocks with `console.error` logging ensure validation errors surface rather than fail silently

**File Upload Safety**
- Multer middleware restricts file type and size before any upload reaches Cloudinary
- Images are stored on Cloudinary's CDN rather than the server filesystem, eliminating local storage attack surface

**Environment Isolation**
- All secrets (MongoDB URI, Cloudinary credentials, Stripe keys, JWT secret) are stored in `.env` files and never committed to version control
- `.env` is listed in `.gitignore`

**API Design**
- Routes are split by resource and responsibility (`/api/products`, `/api/orders`) with no overly permissive catch-alls
- CORS is configured explicitly on the Express server

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_API_BASE_URL=http://localhost:5000
```

---

## Getting Started

**Prerequisites:** Node.js ≥ 18, MongoDB Atlas account, Cloudinary account, Stripe account

**1. Clone the repository**

```bash
git clone https://github.com/your-username/oviu.git
cd oviu
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

**4. Add your environment variables** (see above)

**5. Start the development servers**

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:5000`.

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Admin login, returns JWT | No |
| `GET` | `/api/products` | Fetch all products | No |
| `GET` | `/api/products/:id` | Fetch single product | No |
| `POST` | `/api/products` | Create product (with images) | Yes |
| `PUT` | `/api/products/:id` | Update product | Yes |
| `DELETE` | `/api/products/:id` | Delete product | Yes |
| `GET` | `/api/orders` | Fetch all orders | Yes |
| `GET` | `/api/orders/stats/today` | Today's order statistics | Yes |
| `GET` | `/api/orders/stats/monthly` | Monthly order statistics | Yes |
| `POST` | `/api/orders` | Create a new order | No |

---

## Folder Structure

```
backend/
├── config/
│   ├── cloudinary.js       # Cloudinary SDK configuration
│   └── db.js               # Mongoose connection
├── controllers/
│   ├── authController.js   # Login, JWT issuance
│   ├── orderController.js  # Order CRUD + stats logic
│   └── productController.js
├── middleware/
│   └── upload.js           # Multer + Cloudinary storage engine
├── models/
│   ├── Order.js
│   ├── Payment.js
│   └── Products.js         # Bilingual + variant schema
├── routes/
│   ├── orderRoutes.js
│   └── productRoutes.js
└── index.js                # Express app entry point
```

```
frontend/src/
├── components/layouts/     # NavBar, Footer (shared)
├── context/                # LanguageContext (EN/FR)
├── features/               # One folder per page/feature
├── lib/api.js              # apiFetch — shared auth-aware HTTP helper
├── routes/AppRoutes.jsx    # React Router v6 route definitions
└── translations/           # All UI strings in EN and FR
```

---

## Team

This project was built collaboratively by a team of 8 developers as part of an academic industry collaboration with **OVIU**.

| Name | Role | GitHub |
|---|---|---|
| [David Molano] | [Full-Stack — Admin Dashboard Operations, Product API, Orders API, Cloudinary Integration, MongoDB Integration, Gallery Section Frontend Design, IT Team Leader, Product Client Side Operations, Bilingual support, Mongoose schemas, Data modeling] | [@Mola2025](https://github.com/Mola2025) |
| [Teammate 2] | [e.g. Frontend — Home, About, Gallery pages] | [@username](https://github.com/username) |
| [Teammate 3] | [e.g. Backend — Auth, JWT middleware] | [@username](https://github.com/username) |
| [Teammate 4] | [e.g. Frontend — Cart, Payment, Stripe integration] | [@username](https://github.com/username) |
| [Teammate 5] | [e.g. Frontend — Product Catalog] | [@username](https://github.com/username) |
| [Teammate 6] | [e.g. Backend — Orders, Statistics endpoints] | [@username](https://github.com/username) |
| [Teammate 7] | [e.g. UI/UX — Design system, CSS, responsive layout] | [@username](https://github.com/username) |
| [Teammate 8] | [e.g. Database] | [@username](https://github.com/username) |

---

*Special thanks to the OVIU team for the opportunity to work on a real-world production project.*
