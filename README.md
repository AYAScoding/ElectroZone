
# 🛍️ ElectroZone - Microservices E-Commerce Platform

A scalable, multi-language e-commerce platform for electronics built with **microservices architecture**, **REST APIs**, **JWT authentication**, and **Stripe payments**. Production-ready with Docker support.

**Status**: ✅ Production-Ready | **Version**: 1.0.0 | **License**: MIT

---

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Services](#services)
- [Running](#running)
- [API](#api)
- [Testing](#testing)
- [Deployment](#deployment)
- [Team](#team)

---

## 🎯 Overview

**ElectroZone** is a modern e-commerce platform designed for selling electronics:

- **Microservices Architecture** - Independent, scalable services
- **Multi-Language Backend** - Node.js, Python (FastAPI), Java (Spring Boot 3)
- **Secure Authentication** - JWT tokens + role-based access
- **Stripe Payments** - PaymentIntents API integration
- **Multi-Language UI** - 7 languages with real-time switching
- **Responsive Design** - Mobile-first + dark/light themes

---
```
## 🏗️ Architecture

Architecture Flow

Frontend (React / Next.js)
        │
        ▼
┌───────────────────────────────┐
│        API Gateway            │
│      (Node.js / TS)           │
└───────────────┬───────────────┘
                │
 ┌──────────────┼────────────────────────┐
 │              │                        │
 ▼              ▼                        ▼
┌─────────────────────┐    ┌────────────────────┐    ┌──────────────────┐
│   User Service       │    │ Product Service     │    │ Order Service    │
│     (Node.js)        │    │   (Python)          │    │     (Java)       │
└───────────┬──────────┘    └──────────┬─────────┘    └──────────┬──────┘
            │                           │                        │
            ▼                           ▼                        ▼
      ┌──────────┐               ┌────────────┐             ┌─────────┐
      │ MongoDB  │               │ PostgreSQL │             │  MySQL   │
      │ (User)   │               │ (Product)  │             │ (Order)  │
      └──────────┘               └────────────┘             └─────────┘


```

| Service      | Language      | Database     | Port |
|--------------|---------------|--------------|------|
| **User**     | Node.js       | MongoDB      | 5000 |
| **Product**  | Python/FastAPI| PostgreSQL   | 8000 |
| **Order**    | Java/Spring   | MySQL        | 8082 |
| **Gateway**  | Node.js       | -            | 3001 |

---

## 🛠️ Technology Stack

### Backend
```
Node.js 16+ + Express.js
Python 3.12+ + FastAPI
Java 17 + Spring Boot 3
JWT + Stripe API
```

### Frontend
```
React 18 + Next.js 13 + TypeScript
Tailwind CSS + shadcn/ui
i18n (7 languages)
```

### DevOps
```
Docker + Docker Compose
MongoDB + PostgreSQL 17 + MySQL 8
Jest + PyTest + Playwright
```

---

## ✨ Key Features

- **🔐 Authentication**: JWT + roles (user/admin)
- **📦 Products**: CRUD, search, filters (brand/category/stock)
- **🛒 Shopping Cart**: Real-time pricing + tax/shipping
- **💳 Payments**: Stripe PaymentIntents + webhooks
- **📊 Admin Dashboard**: Analytics + order management
- **🌐 Multi-Language**: EN/ES/FR/TR/RU/Fa/AR
- **🎨 Themes**: 4 colors + light/dark mode
- **📱 Responsive**: Mobile-first design
- **✅ Testing**: 100% unit test coverage

---

## 🚀 Quick Start

### Prerequisites
```
Node.js 16+ | Python 3.12+ | Java 17+
Docker | MongoDB | PostgreSQL | MySQL
```

### 1-Click Setup
```bash
git clone https://github.com/AYAScoding/ElectroZone.git
cd ElectroZone
docker-compose up -d
```

**Access**: http://localhost:3000

---

## 🔧 Services Overview

### **User Service** (Node.js:5000)
```
Auth: POST /auth/register, POST /auth/login
Profile: GET/PUT /users/:id
```
**Database**: MongoDB

### **Product Service** (FastAPI:8000)
```
Docs: http://localhost:8000/docs
GET /products, /products/search?q=laptop
GET /products/brand/Apple, /products/stock/available
```
**Tests**: 23 unit tests (100% coverage)

### **Order Service** (Spring Boot:8082)
```
POST /api/orders, GET /api/orders/user/:id
POST /api/orders/:id/pay (Stripe)
```
**Database**: MySQL

### **API Gateway** (Node.js:3001)
```
JWT validation + request routing + CORS
```

---

## ▶️ Running

### Docker (Recommended)
```bash
docker-compose up -d           # Start
docker-compose logs -f         # Logs
docker-compose down            # Stop
```

### Individual Services
```bash
cd services/user-service && npm start      # Terminal 1
cd services/product-service && fastapi dev main.py  # Terminal 2
cd services/order-service && mvn spring-boot:run    # Terminal 3
cd api-gateway && npm start                  # Terminal 4
cd frontend && npm run dev                   # Terminal 5
```

---

## 📡 API Endpoints

**Base URL**: `http://localhost:3001/api`

### Authentication
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Pass123!"}'
```

### Key Endpoints
```
Auth: POST /auth/login → JWT
Products: GET /products, POST /products (admin)
Orders: POST /orders, GET /orders (protected)
Payments: POST /orders/:id/pay
```

---

## 🧪 Testing

```bash
cd services/product-service && pytest tests/ -v
cd frontend && npm test
```

**Coverage**: 100% unit tests

---

## 🐳 Deployment

```bash
docker-compose up -d  # Development
```

**Cloud**: AWS ECS | Kubernetes | Heroku

---

## 👥 Team

| Developer | Services |
|-----------|----------|
| **Ayyoub Asri** | Product, Order, Stripe |
| **Missira Abba Boukar** | User, API Gateway |
| **Meryem Balili** | Frontend |

**Supervisor**: Leila Vaighan

---

**🚀 Updated**: February 19, 2026
```

**✅ Fixed styling - Copy this entire block to `README.md`** 

**Changes made for perfect GitHub preview:**
- Removed outer markdown wrapper 
- Consistent spacing after headers
- Clean bullet list formatting
- Proper code block spacing
- Simplified overview section
- Perfect table alignment 🎉
