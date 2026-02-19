# 🛍️ ElectroZone - Microservices E-Commerce Platform

A multi-language, scalable e-commerce platform for electronics built using **microservices architecture**. ElectroZone demonstrates modern backend design with independent services, REST APIs, and JWT authentication.

**Status**: ✅ Production-Ready | **Version**: 1.0.0 | **License**: MIT

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Services](#-services-detailed-documentation)
  - [User Service](#user-service)
  - [Product Service](#product-service)
  - [Order Service](#order-service)
  - [API Gateway](#api-gateway)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Database Schemas](#-database-schemas)
- [Communication Flow](#-service-communication-flow)
- [Team & Contributions](#-team--contributions)
- [Future Enhancements](#-future-enhancements)
- [References](#-references)

---

## 🎯 Overview

**ElectroZone** is a microservices-based e-commerce platform designed to sell electronic products online. The project focuses on:

- ✅ **Backend System Design**: Multi-language microservices architecture
- ✅ **Service Separation**: Independent deployment and development of services
- ✅ **Secure Communication**: RESTful APIs with JWT authentication
- ✅ **Scalability**: Each service can scale independently
- ✅ **Fault Isolation**: Failures in one service don't cascade to others
- ✅ **Payment Integration**: Stripe PaymentIntents for secure checkout

### System Capabilities

- 🔐 Secure user authentication and authorization
- 📦 Product and inventory management with search & filtering
- 🛒 Shopping cart with dynamic pricing (tax, shipping)
- 💳 Stripe payment processing with PaymentIntents
- 📋 Order processing and checkout logic
- 👥 User profile management and role-based access control
- 🌐 Multi-language support (7 languages)
- 🎨 Customizable themes (light/dark mode, 4 color schemes)
- 📱 Responsive mobile-first frontend
- 📊 Admin dashboard with analytics
- 🔄 Order status tracking and management

---

## 🏗️ System Architecture

### Architecture Diagram
*(Insert architecture diagram from report - pages 6-7)*

**[Add: /docs/images/architecture-diagram.png]**

### Microservices Overview

ElectroZone follows a **microservices pattern** where each service is independently deployable and owns a specific business domain:

┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
│         React + Next.js + TypeScript + Tailwind CSS         │
│  (User Dashboard | Admin Dashboard | Multi-Language UI)     │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────▼──────────┐
                    │  API Gateway  │
                    │ (Node.js/TS)  │
                    │  Port: 3001   │
                    └────┬──────────┘
                    │ Routing & Auth │
                    │ JWT Validation │
        ┌───────────┼────────────────┬──────────────┐
        │           │                │              │
    ┌───▼────┐  ┌──▼────────┐  ┌───▼──────┐
    │ User   │  │ Product  │  │  Order   │
    │Service │  │ Service  │  │ Service  │
    │(Node)  │  │(Python)  │  │  (Java)  │
    │Port:   │  │Port:     │  │Port:     │
    │5000    │  │8000      │  │8082      │
    └───┬────┘  └──┬───────┘  └───┬──────┘
        │          │              │
    ┌───▼────┐ ┌──▼────────┐ ┌───▼──────┐
    │MongoDB │ │PostgreSQL │ │  MySQL   │
    │27017   │ │5432       │ │3307      │
    └────────┘ └───────────┘ └──────────┘

### Service Responsibilities

| Service | Language | Database | Port | Key Functions |
|---------|----------|----------|------|---|
| **User Service** | Node.js + Express | MongoDB | 5000 | User registration, login, JWT tokens, profile management, role-based access control |
| **Product Service** | Python (FastAPI) | PostgreSQL | 8000 | Product CRUD, inventory management, search, filtering, categories, stock management |
| **Order Service** | Java (Spring Boot 3) | MySQL | 8082 | Order creation, checkout logic, order history, Stripe payment processing, payment status |
| **API Gateway** | Node.js + Express | - | 3001 | Request routing, authentication token validation, request logging, CORS management |
| **Frontend** | React + Next.js | - | 3000 | User interface, dashboards, cart management, theme switching, payment integration |

---

## 🛠️ Technology Stack

### Backend Services
- **Node.js** with **Express.js** - API Gateway & User Service
- **Python 3.12+** with **FastAPI** - Product Service (lightweight, high-performance)
- **Java 17** with **Spring Boot 3** - Order Service (enterprise-grade)
- **JWT** - Stateless authentication across services
- **Stripe API** - Payment processing (PaymentIntents)

### Databases
- **MongoDB** - User data (flexible schema, document-based)
- **PostgreSQL 17** - Product data (relational, ACID compliant)
- **MySQL 8.0+** - Order data (traditional relational database)

### Frontend
- **React 18+** - Component-based UI library
- **Next.js 13+** - Server-side rendering, routing, optimization
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built accessible components
- **i18n (Internationalization)** - 7-language support
- **Stripe.js** - Frontend payment handling

### DevOps & Deployment
- **Docker** - Containerization of services
- **Docker Compose** - Multi-container orchestration (development)
- **Kubernetes** (optional) - Production orchestration
- **Git & GitHub** - Version control

### Testing
- **Jest** - Unit testing framework
- **React Testing Library** - React component testing
- **PyTest** - Python unit testing (23 tests)
- **Playwright / Cypress** - End-to-end testing
- **Postman / Insomnia** - API testing

---

## ✨ Key Features

### 1. Multi-Language Support
- **7 Languages**: English, Spanish, French, Turkish, Russian, Farsi, Arabic
- Real-time translation switching without page reload
- Language preference persisted in localStorage
- Complete UI translation coverage

### 2. Authentication & Security
- **User Registration** with email verification
- **JWT Token-based Authentication** (stateless)
- **Role-Based Access Control** (User, Admin)
- **Protected Endpoints** - Unauthorized requests rejected
- **Secure Password Storage** - Hashed with bcrypt
- **Token Expiration & Refresh** mechanisms
- **Stripe Security** - PCI-compliant payment processing

### 3. Product Management
- **Browse Products** by category (Smartphones, Laptops, Tablets, etc.)
- **Advanced Search & Filtering** by price, brand, ratings
- **Product Details** with images, specifications, reviews
- **Inventory Tracking** - Stock availability updates
- **Admin Controls** - Add, edit, delete products
- **Stock Management** - Update quantities, availability checks
- **Category Management** - Organize products by type
- **Brand Filtering** - Filter by Apple, Samsung, Dell, HP, etc.

### 4. Shopping Cart & Checkout
- **Add/Remove Products** with quantity adjustments
- **Real-time Price Calculation**:
  - Subtotal
  - Shipping costs
  - Tax calculation
  - Total with discounts
- **Persistent Cart** across sessions
- **Checkout Flow**:
  - Shipping information form
  - Payment method selection
  - Stripe PaymentIntent integration
  - Order confirmation

### 5. Order Management & Payment
- **Order Creation** through secure checkout
- **Order History** with filters and sorting
- **Order Status Tracking** (Pending, Processing, Shipped, Delivered)
- **Payment Status Management** (Pending, Success, Failed)
- **Stripe Integration**:
  - PaymentIntents API for secure payments
  - Card payment processing
  - Payment confirmation & webhooks
- **Admin Analytics** - Total orders, revenue, trends
- **Detailed Order Records** in MySQL with full audit trail
- **Order Cancellation** with refund support

### 6. Admin Dashboard
- **Real-time Statistics**:
  - Total products in inventory
  - Total orders processed
  - Revenue metrics
  - Recent activity feeds
- **Product Management** - Create, update, delete, bulk operations
- **Order Management** - View, filter, update status, process payments
- **Collections/Categories** management
- **User Management** - Restricted admin access
- **Stock Monitoring** - Low stock alerts

### 7. Responsive Design
- **Mobile-First Approach**
- **Breakpoint Support**:
  - Mobile (< 768px)
  - Tablet (768px - 1024px)
  - Desktop (> 1024px)
- **Touch-Friendly UI** on mobile devices
- **Fast Load Times** with Next.js optimization

### 8. Customizable Themes
- **4 Color Schemes**: Green, Blue, Red, Orange
- **Light & Dark Modes**
- **Instant Theme Switching** without reload
- **User Preference Persistence**
- **Accessible Color Contrast** ratios

---

## 📁 Project Structure

ElectroZone/
├── frontend/                      # React + Next.js Frontend (Port 3000)
│   ├── src/
│   │   ├── app/                  # Next.js pages
│   │   ├── components/           # Reusable React components
│   │   │   ├── Header.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ShoppingCart.tsx
│   │   │   └── PaymentForm.tsx
│   │   ├── pages/
│   │   │   ├── products.tsx
│   │   │   ├── cart.tsx
│   │   │   ├── checkout.tsx
│   │   │   ├── payment.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── admin/
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── products.tsx
│   │   │   │   └── orders.tsx
│   │   │   └── ...
│   │   ├── hooks/                # Custom React hooks
│   │   ├── context/              # Context API (Theme, Auth, Cart)
│   │   ├── styles/               # Tailwind CSS config
│   │   ├── public/               # Static assets
│   │   └── utils/                # Helper functions
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── api-gateway/                   # Node.js + Express API Gateway (Port 3001)
│   ├── src/
│   │   ├── routes/               # Route definitions
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   └── users.ts
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.ts           # JWT verification
│   │   │   └── errorHandler.ts
│   │   ├── config/               # Configuration files
│   │   ├── app.ts                # Main Express app
│   │   └── server.ts             # Server entry point
│   ├── package.json
│   └── .env.example
│
├── services/
│   ├── user-service/             # Node.js + Express User Service (Port 5000)
│   │   ├── src/
│   │   │   ├── models/           # MongoDB schemas
│   │   │   │   └── User.ts
│   │   │   ├── controllers/      # Business logic
│   │   │   │   └── UserController.ts
│   │   │   ├── routes/           # Service routes
│   │   │   └── middleware/
│   │   ├── package.json
│   │   └── .env.example
│   │
│   ├── product-service/          # Python + FastAPI Product Service (Port 8000)
│   │   ├── main.py               # FastAPI app & endpoints
│   │   ├── database.py           # PostgreSQL config
│   │   ├── models.py             # SQLAlchemy models
│   │   ├── schemas.py            # Pydantic validation schemas
│   │   ├── crud.py               # Database operations
│   │   ├── requirements.txt
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   └── tests/
│   │       ├── test_main.py
│   │       └── test_crud.py
│   │
│   └── order-service/            # Java + Spring Boot Order Service (Port 8082)
│       ├── src/
│       │   └── main/
│       │       ├── java/com/electrozone/
│       │       │   ├── controller/
│       │       │   ├── service/
│       │       │   ├── entity/
│       │       │   ├── repository/
│       │       │   ├── config/
│       │       │   └── dto/
│       │       └── resources/
│       │           └── application.properties
│       ├── pom.xml
│       ├── .env.example
│       └── Dockerfile
│
├── docker/                        # Docker configurations
│   ├── Dockerfile.user-service
│   ├── Dockerfile.product-service
│   ├── Dockerfile.order-service
│   ├── Dockerfile.api-gateway
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── docs/                          # Documentation
│   ├── images/
│   │   ├── architecture-diagram.png
│   │   ├── user-dashboard.png
│   │   ├── admin-dashboard.png
│   │   ├── product-page.png
│   │   ├── checkout-flow.png
│   │   └── ...
│   ├── API.md                    # API endpoint documentation
│   ├── SETUP.md                  # Detailed setup guide
│   ├── TESTING.md                # Testing procedures
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── SERVICES.md               # Individual service docs
│
├── .github/
│   └── workflows/                # GitHub Actions CI/CD
│       └── test.yml
│
├── .gitignore
├── docker-compose.yml            # Development orchestration
├── package.json                  # Root package (if monorepo)
└── README.md                     # This file

---

## 🚀 Installation & Setup

### Prerequisites

Ensure you have the following installed:
- **Node.js** 16+ and npm/yarn
- **Python** 3.12+ with pip
- **Java** JDK 17+ (for Spring Boot)
- **Docker** & **Docker Compose** (optional, for containerized setup)
- **PostgreSQL** 17+ (for Product Service)
- **MongoDB** 4.4+ (for User Service)
- **MySQL** 8.0+ (for Order Service)
- **Git**

### Clone the Repository

git clone https://github.com/AYAScoding/ElectroZone.git
cd ElectroZone

### Quick Start with Docker Compose

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

The frontend will be available at `http://localhost:3000`

---

## 🔧 Services: Detailed Documentation

### **User Service**

**Location**: `services/user-service/`  
**Technology**: Node.js 16+ with Express.js  
**Database**: MongoDB 4.4+  
**Port**: 5000

#### Setup

cd services/user-service

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# MONGODB_URI=mongodb://localhost:27017/electrozone-users
# JWT_SECRET=your-very-secure-jwt-secret-key-here
# JWT_EXPIRY=7d
# PORT=5000
# NODE_ENV=development
# CORS_ORIGIN=http://localhost:3000

# Start the service
npm start

#### Key Features
- User registration with email verification
- Secure login with JWT token generation
- User profile management
- Role-based access control (customer, admin)
- Password hashing with bcrypt
- Token validation and refresh mechanisms

#### Main Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login (returns JWT)
- `GET /users/:id` - Get user profile (protected)
- `PUT /users/:id` - Update user profile (protected)
- `POST /auth/logout` - Logout (protected)

---

### **Product Service**

**Location**: `services/product-service/`  
**Technology**: Python 3.12+ with FastAPI  
**Database**: PostgreSQL 17  
**Port**: 8000

#### Features
✅ Complete CRUD operations for products and categories  
✅ Product search by name and description  
✅ Filter products by category (Laptops, Phones, Tablets, etc.)  
✅ Filter products by brand (Apple, Samsung, Dell, HP, etc.)  
✅ Stock availability checking  
✅ Inventory management with stock updates  
✅ RESTful API with automatic documentation  
✅ PostgreSQL database with SQLAlchemy ORM  
✅ Input validation with Pydantic schemas  
✅ Docker containerization  
✅ 23 comprehensive unit tests (100% pass rate)  
✅ CORS enabled for microservices integration

#### Setup - Option 1: Local Development

cd services/product-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Configure environment variables
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=your_password
# POSTGRES_HOST=localhost
# POSTGRES_PORT=5432
# POSTGRES_DB=product-service-database

# Create PostgreSQL database
# CREATE DATABASE "product-service-database";

# Start the service
fastapi dev main.py

Service runs at: `http://127.0.0.1:8000`

#### Setup - Option 2: Docker Deployment

# Using Docker Compose (recommended)
docker-compose up --build

# Or using Docker only
docker build -t electrozone-product-service .
docker run -d -p 8000:8000 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_HOST=host.docker.internal \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_DB=product-service-database \
  --name product-service \
  electrozone-product-service

#### API Documentation

**Interactive Docs** (after service starts):
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

#### Main Endpoints

**Categories**:
- `POST /categories/` - Create category
- `GET /categories/` - Get all categories (paginated)
- `GET /categories/{category_id}` - Get specific category
- `PUT /categories/{category_id}` - Update category
- `DELETE /categories/{category_id}` - Delete category

**Products**:
- `POST /products/` - Create product
- `GET /products/` - Get all products (paginated)
- `GET /products/{product_id}` - Get specific product
- `PUT /products/{product_id}` - Update product
- `DELETE /products/{product_id}` - Delete product
- `GET /products/category/{category_id}` - Get products by category
- `GET /products/brand/{brand}` - Get products by brand
- `GET /products/search/` - Search products (query: q)
- `GET /products/stock/available` - Get in-stock products
- `PATCH /products/{product_id}/stock` - Update stock (query: quantity)

#### Database Schema

**Products Table**:
- `id` (Integer) - Primary key
- `name` (String) - Product name
- `description` (Text) - Product description
- `price` (Float) - Product price
- `stock_quantity` (Integer) - Available quantity
- `brand` (String) - Product brand
- `category_id` (Integer) - Foreign key to categories
- `specifications` (JSON) - Product specs
- `image_url` (String) - Product image URL
- `created_at` / `updated_at` (DateTime) - Timestamps

**Categories Table**:
- `id` (Integer) - Primary key
- `name` (String, unique) - Category name
- `description` (Text) - Category description

#### Testing

# Activate virtual environment first
source venv/bin/activate

# Run all tests
pytest tests/ -v

# With coverage report
pytest tests/ -v --cov=. --cov-report=html

**Test Results**: 23 unit tests, 100% pass rate

#### Example API Calls

**Create Category**:
curl -X POST "http://127.0.0.1:8000/categories/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptops",
    "description": "Laptop computers and notebooks"
  }'

**Create Product**:
curl -X POST "http://127.0.0.1:8000/products/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Air M3",
    "description": "13-inch laptop with M3 chip, 16GB RAM",
    "price": 1299.99,
    "stock_quantity": 15,
    "brand": "Apple",
    "category_id": 1,
    "specifications": {
      "RAM": "16GB",
      "Storage": "512GB SSD",
      "Screen": "13.6 inch Liquid Retina"
    },
    "image_url": "https://example.com/macbook.jpg"
  }'

**Search Products**:
curl "http://127.0.0.1:8000/products/search/?q=macbook"

**Filter by Brand**:
curl "http://127.0.0.1:8000/products/brand/Apple"

**Update Stock**:
curl -X PATCH "http://127.0.0.1:8000/products/1/stock?quantity=20"

#### Troubleshooting

| Issue | Solution |
|-------|----------|
| Database Connection Error | Ensure PostgreSQL is running and .env credentials are correct |
| Port 8000 Already in Use | Stop other services or change port in docker-compose.yml |
| Module Not Found | Activate venv and run `pip install -r requirements.txt` |

---

### **Order Service**

**Location**: `services/order-service/`  
**Technology**: Java 17 with Spring Boot 3  
**Database**: MySQL 8.0+  
**Port**: 8082

#### Features
- Create, read, update, and delete orders
- Filter orders by user and status
- Update order status and payment status
- Trigger Stripe payment for an order via PaymentIntent
- Order history and audit trail
- Payment processing with Stripe
- Integration with other microservices

#### Configuration

Create `src/main/resources/application.properties`:

spring.application.name=order-service
server.port=8082

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3307/order_service_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate/JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Stripe Configuration
stripe.secret-key=${STRIPE_SECRET_KEY}
stripe.currency=usd
stripe.publishable-key=${STRIPE_PUBLISHABLE_KEY}

# Server Configuration
server.servlet.context-path=/api

#### Setup

cd services/order-service

# Set Stripe secret key (Windows PowerShell)
$env:STRIPE_SECRET_KEY="sk_test_your_real_key_here"

# On Mac/Linux
export STRIPE_SECRET_KEY="sk_test_your_real_key_here"

# Build the project
mvn clean install

# Run the service
./mvnw spring-boot:run
# or
mvn spring-boot:run

Service runs at: `http://localhost:8082`

#### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create a new order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/{id}` | Get order by ID |
| GET | `/api/orders/user/{userId}` | Get orders by user ID |
| GET | `/api/orders/status/{status}` | Get orders by status |
| PUT | `/api/orders/{id}/status` | Update order status |
| PUT | `/api/orders/{id}/payment-status` | Update payment status |
| PUT | `/api/orders/{id}/cancel` | Cancel order |
| DELETE | `/api/orders/{id}` | Delete order |
| POST | `/api/orders/{id}/pay` | Create Stripe PaymentIntent |

#### Example: Create Order

curl -X POST http://localhost:8082/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productId": 1,
    "quantity": 1,
    "totalAmount": 29.99,
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "paymentMethod": "CARD",
    "shippingAddress": "Some street 1, City"
  }'

**Response**: 201 Created with persisted order including id and orderDate

#### Example: Pay for Order (Stripe PaymentIntent)

curl -X POST http://localhost:8082/api/orders/{id}/pay

Creates a Stripe PaymentIntent for the order amount and returns `client_secret`. Frontend uses client_secret with Stripe.js to complete payment.

#### Database Schema

**Orders Table**:
- `id` (INT, Primary Key)
- `user_id` (VARCHAR) - User identifier
- `order_date` (DATETIME) - Order creation timestamp
- `total_price` (DECIMAL) - Total order amount
- `status` (ENUM) - pending, processing, shipped, delivered
- `payment_status` (ENUM) - pending, success, failed
- `payment_method` (VARCHAR) - card, paypal, etc.
- `shipping_address` (VARCHAR) - Delivery address
- `stripe_payment_intent_id` (VARCHAR) - Stripe PI ID
- `created_at` / `updated_at` (DATETIME) - Timestamps

**Order Items Table**:
- `id` (INT, Primary Key)
- `order_id` (INT, Foreign Key)
- `product_id` (INT)
- `quantity` (INT)
- `unit_price` (DECIMAL)

#### Tech Stack

- **Language**: Java 17
- **Framework**: Spring Boot 3
- **ORM**: Spring Data JPA / Hibernate
- **Database**: MySQL 8.0+
- **Payment**: Stripe Java SDK (PaymentIntents API)
- **Build Tool**: Maven

#### Notes

- Ensure MySQL is running and reachable on configured host/port
- In production, store `STRIPE_SECRET_KEY` in environment variables, not properties file
- PaymentIntent integration enables secure, PCI-compliant payment processing
- Service communicates with Product Service for inventory updates
- All order data persisted with full audit trail

---

### **API Gateway**

**Location**: `api-gateway/`  
**Technology**: Node.js 16+ with Express.js  
**Port**: 3001

#### Setup

cd api-gateway

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# PORT=3001
# USER_SERVICE_URL=http://localhost:5000
# PRODUCT_SERVICE_URL=http://localhost:8000
# ORDER_SERVICE_URL=http://localhost:8082
# JWT_SECRET=your-very-secure-jwt-secret-key-here
# LOG_LEVEL=debug
# NODE_ENV=development
# CORS_ORIGIN=http://localhost:3000

# Start the gateway
npm start

#### Key Responsibilities
- Routes all client requests to appropriate microservices
- Validates JWT authentication tokens
- Manages CORS policies for frontend
- Logs all requests
- Handles error responses
- Provides unified API entry point

#### How It Works

All frontend requests go through the gateway:
Frontend → API Gateway (3001) → Routes to appropriate service
           ↓
         User Service (5000)
         Product Service (8000)
         Order Service (8082)

---

## ▶️ Running the Application

### Option 1: Run Services Individually

**Terminal 1 - User Service**
cd services/user-service && npm start

**Terminal 2 - Product Service**
cd services/product-service && fastapi dev main.py

**Terminal 3 - Order Service**
cd services/order-service && mvn spring-boot:run

**Terminal 4 - API Gateway**
cd api-gateway && npm start

**Terminal 5 - Frontend**
cd frontend && npm run dev

All services will be running:
- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:3001`
- User Service: `http://localhost:5000`
- Product Service: `http://localhost:8000`
- Order Service: `http://localhost:8082`

### Option 2: Run with Docker Compose (Recommended)

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

### Health Check

Verify all services are running:

# User Service
curl http://localhost:5000/health

# Product Service
curl http://localhost:8000/docs

# Order Service
curl http://localhost:8082/actuator/health

# API Gateway
curl http://localhost:3001/health

# Frontend
open http://localhost:3000

---

## 📡 API Documentation

### Base URL
http://localhost:3001/api

### Authentication

All protected endpoints require a JWT token in the Authorization header:

Authorization: Bearer <jwt_token>

### Core Endpoints

#### User Service (via Gateway)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login (returns JWT token)
- `GET /users/:id` - Get user profile (protected)
- `PUT /users/:id` - Update user profile (protected)
- `POST /auth/logout` - Logout (protected)

#### Product Service (via Gateway)
- `GET /products` - Get all products (paginated)
- `GET /products/:id` - Get product details
- `POST /products` - Create product (admin only)
- `PUT /products/:id` - Update product (admin only)
- `DELETE /products/:id` - Delete product (admin only)
- `GET /products/search` - Search products by query
- `GET /categories` - Get all categories
- `GET /products/brand/:brand` - Filter by brand
- `GET /products/stock/available` - Get in-stock items

#### Order Service (via Gateway)
- `POST /orders` - Create new order (protected)
- `GET /orders` - Get user's orders (protected)
- `GET /orders/:id` - Get order details (protected)
- `GET /orders/user/:userId` - Get orders by user (protected)
- `GET /orders/status/:status` - Filter by status (protected)
- `PUT /orders/:id/status` - Update order status (admin only)
- `PUT /orders/:id/payment-status` - Update payment status (admin only)
- `POST /orders/:id/pay` - Create Stripe PaymentIntent (protected)
- `GET /admin/orders` - Get all orders (admin only)
- `PUT /orders/:id/cancel` - Cancel order (protected)

### Example API Calls

**Register User**
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

**Login User**
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

**Get Products**
curl http://localhost:3001/api/products?page=1&limit=10

**Create Order**
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "userId": 1,
    "productId": 1,
    "quantity": 2,
    "totalAmount": 1999.98,
    "shippingAddress": "123 Main St",
    "paymentMethod": "CARD"
  }'

**Make Payment with Stripe**
curl -X POST http://localhost:3001/api/orders/{orderId}/pay \
  -H "Authorization: Bearer <token>"

For complete API documentation, see `/docs/API.md`

---

## 🧪 Testing

### Frontend Tests

cd frontend
npm test                          # Run all tests
npm test -- --coverage          # With coverage report
npm run test:e2e                # E2E tests

### User Service Tests

cd services/user-service
npm test

### Product Service Tests

cd services/product-service

# Activate virtual environment first
source venv/bin/activate

# Run all tests
pytest tests/ -v

# With coverage report
pytest tests/ -v --cov=. --cov-report=html

**Results**: 23 unit tests, 100% pass rate

### Order Service Tests

cd services/order-service
mvn test

### API Gateway Tests

cd api-gateway
npm test

### Testing Checklist

- ✅ Unit tests for core business logic
- ✅ Component rendering tests (React)
- ✅ API endpoint tests with sample requests
- ✅ JWT authentication flow validation
- ✅ Authorization checks (protected endpoints)
- ✅ Database schema validation
- ✅ Error handling and edge cases
- ✅ UI responsiveness across devices
- ✅ Multi-language support
- ✅ Theme switching functionality
- ✅ Stripe payment integration
- ✅ Order creation and processing
- ✅ Product inventory management

For detailed testing procedures, see `/docs/TESTING.md`

---

## 🐳 Deployment

### Docker Build & Run

**Build Individual Services**
# User Service
docker build -f docker/Dockerfile.user-service -t electrozone-user-service .

# Product Service
docker build -f docker/Dockerfile.product-service -t electrozone-product-service .

# Order Service
docker build -f docker/Dockerfile.order-service -t electrozone-order-service .

# API Gateway
docker build -f docker/Dockerfile.api-gateway -t electrozone-api-gateway .

# Frontend
docker build -f docker/Dockerfile.frontend -t electrozone-frontend .

**Run with Docker Compose**
docker-compose -f docker-compose.yml up -d

### Production Deployment

#### Using Kubernetes

# Apply configuration files
kubectl apply -f k8s/

# Check deployments
kubectl get deployments
kubectl get pods
kubectl get services

#### Using Cloud Platforms

**AWS ECS/Fargate**
# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker tag electrozone-frontend:latest <account>.dkr.ecr.<region>.amazonaws.com/electrozone-frontend:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/electrozone-frontend:latest

**Heroku** (Simple deployment)
heroku login
heroku create electrozone
git push heroku main

For detailed deployment procedures, see `/docs/DEPLOYMENT.md`

---

## 🗄️ Database Schemas

### User Service - MongoDB

// User Collection
{
  _id: ObjectId,
  email: String (unique),
  firstName: String,
  lastName: String,
  passwordHash: String,
  role: Enum ["customer", "admin"],
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  preferences: {
    language: String,
    theme: String,
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean
}

### Product Service - PostgreSQL

-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT FOREIGN KEY,
  stock_quantity INT DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  brand VARCHAR(100),
  image_url VARCHAR(500),
  specifications JSONB,
  rating DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Order Service - MySQL

-- Orders Table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(50) NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_price DECIMAL(10, 2),
  status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
  payment_status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT FOREIGN KEY,
  product_id INT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

---

## 🔄 Service Communication Flow

### User Registration & Login Flow

1. User enters credentials on frontend
   ↓
2. Frontend sends POST /auth/register to API Gateway
   ↓
3. API Gateway forwards to User Service
   ↓
4. User Service validates input, hashes password, stores in MongoDB
   ↓
5. User Service returns success/error to API Gateway
   ↓
6. API Gateway returns response to frontend
   ↓
7. Frontend stores JWT token in localStorage

### Product Browse & Search Flow

1. User navigates to Products page
   ↓
2. Frontend sends GET /products?search=laptop to API Gateway
   ↓
3. API Gateway forwards request to Product Service
   ↓
4. Product Service queries PostgreSQL database
   ↓
5. Product Service returns results with filters applied
   ↓
6. API Gateway returns paginated results to frontend
   ↓
7. Frontend displays products with dynamic filtering

### Order Checkout & Payment Flow

1. User clicks "Place Order" with items in cart
   ↓
2. Frontend sends POST /orders with JWT token to API Gateway
   ↓
3. API Gateway validates JWT token
   ↓
4. API Gateway forwards to Order Service with user_id from JWT
   ↓
5. Order Service creates order in MySQL (status: PENDING)
   ↓
6. Order Service calls Product Service to update inventory
   ↓
7. Frontend receives order ID and initiates Stripe payment
   ↓
8. Frontend sends POST /orders/{id}/pay to Order Service
   ↓
9. Order Service creates Stripe PaymentIntent
   ↓
10. Order Service returns client_secret to frontend
   ↓
11. Stripe.js on frontend completes payment
   ↓
12. Stripe webhook notifies Order Service of payment success
   ↓
13. Order Service updates payment_status to SUCCESS
   ↓
14. Frontend displays confirmation with order details

### Admin Dashboard Flow

1. Admin logs in with admin account
   ↓
2. JWT token marked with role: "admin"
   ↓
3. Admin navigates to Dashboard
   ↓
4. Frontend sends GET /admin/orders with JWT
   ↓
5. API Gateway validates token and checks admin role
   ↓
6. Request forwarded to Order Service
   ↓
7. Order Service returns all orders with analytics
   ↓
8. Frontend displays statistics and order management interface

### Inter-Service Communication

Order Service requests product info:

POST /orders
├─ Validate order items
├─ Call Product Service: GET /products/{id}
├─ Check stock availability
├─ Update Product Service: PATCH /products/{id}/stock
└─ Create order in MySQL

Request Flow:
Order Service → API Gateway → Product Service → PostgreSQL

---

## 👥 Team & Contributions

### Development Team

| Name | ID | Role | Services | Responsibilities |
|------|-------|------|----------|------------------|
| **Ayyoub Asri** | 2203060248 | Backend Developer | Product Service, Order Service | Database design, service logic, Stripe integration, inter-service communication |
| **Missira Abba Boukar** | 2103060182 | Backend Developer | User Service, API Gateway | Authentication, JWT tokens, authorization, routing, CORS management |
| **Meryem Balili** | 2203060043 | Frontend Developer | React + Next.js | UI/UX design, dashboards, multi-language support, theme management, payment UI |

### Supervisor
**Leila Vaighan**

### Key Learning Outcomes

- ✅ Microservices architecture design and implementation
- ✅ Multi-language backend development (Node.js, Python, Java)
- ✅ RESTful API design and communication patterns
- ✅ JWT-based authentication across services
- ✅ Database design for different SQL/NoSQL systems
- ✅ Payment integration with Stripe (PaymentIntents)
- ✅ Docker containerization and deployment
- ✅ Frontend-backend integration in large systems
- ✅ Teamwork and collaborative development
- ✅ Security best practices in microservices

---

## 🚀 Future Enhancements

### Planned Features

- 📧 **Email Notification Service** - Order updates, promotions, newsletters
- 🤖 **Recommendation Engine** - ML-based product suggestions based on user history
- 💬 **Real-time Chat Support** - Customer support via WebSockets
- 📊 **Advanced Analytics** - Sales trends, customer behavior, revenue forecasting
- 💳 **Additional Payment Methods** - PayPal, local payment gateways
- 📱 **Mobile App** - React Native or Flutter mobile client
- 🔍 **Search Optimization** - Elasticsearch for faster product search
- 🛡️ **Enhanced Security** - OAuth2, two-factor authentication, end-to-end encryption
- 📦 **Inventory Management** - Automated stock alerts, supplier integration
- 🌍 **Multi-region Deployment** - CDN, regional servers, load balancing
- 📈 **Order Analytics** - Revenue reports, customer lifetime value
- 🔔 **Push Notifications** - Real-time alerts for orders and promotions

### Technology Roadmap

- [ ] Kubernetes orchestration for production
- [ ] Service mesh (Istio) for advanced routing
- [ ] Message queue (RabbitMQ/Kafka) for async communication
- [ ] GraphQL API alongside REST
- [ ] Real-time notifications (WebSockets)
- [ ] Machine learning recommendations
- [ ] Monitoring & logging (Prometheus, ELK stack)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Rate limiting and DDoS protection
- [ ] Database replication and backups

---

## 📸 Project Screenshots

### User Interface
*(Insert screenshots from report)*

**[Add: /docs/images/user-dashboard.png]**  
User Dashboard - Product browsing, search, cart

**[Add: /docs/images/product-page.png]**  
Product Page - Detailed product info, reviews, add to cart

**[Add: /docs/images/checkout-flow.png]**  
Checkout Flow - Shipping info, payment method selection

**[Add: /docs/images/admin-dashboard.png]**  
Admin Dashboard - Orders, products, analytics

**[Add: /docs/images/payment-page.png]**  
Payment Page - Stripe integration, card details

---

## 📚 References

### Official Documentation
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Spring Boot Documentation](https://docs.spring.io/spring-boot)
- [Docker Documentation](https://docs.docker.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Stripe Documentation](https://stripe.com/docs)

### Learning Resources
- [Microservices Architecture Patterns](https://microservices.io/patterns/index.html)
- [REST API Best Practices](https://restfulapi.net)
- [JWT Authentication Guide](https://jwt.io/introduction)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices)
- [Stripe PaymentIntents Guide](https://stripe.com/docs/payments/payment-intents)

### Related Projects
- [AYAScoding GitHub](https://github.com/AYAScoding)
- [Similar Microservices Projects](https://github.com/topics/microservices)
- [ElectroZone Repository](https://github.com/AYAScoding/ElectroZone)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

For questions, issues, or contributions:

- **GitHub Issues**: [Open an issue](https://github.com/AYAScoding/ElectroZone/issues)
- **Email**: contact@electrozone.dev
- **Documentation**: [See /docs folder](/docs)
- **Project Timeline**: Start: Nov 24, 2025 | Deadline: Jan 5, 2026

---

## 🎯 Quick Links

- 📖 [Detailed Setup Guide](/docs/SETUP.md)
- 🔌 [API Documentation](/docs/API.md)
- 🧪 [Testing Guide](/docs/TESTING.md)
- 🚀 [Deployment Guide](/docs/DEPLOYMENT.md)
- 🏗️ [Architecture Details](/docs/ARCHITECTURE.md)
- 🔐 [Security Guide](/docs/SECURITY.md)
- 💳 [Payment Integration Guide](/docs/PAYMENT.md)

---

**Last Updated**: February 19, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Project Timeline**: November 24, 2025 - January 5, 2026

Made with ❤️ by the ElectroZone Team
