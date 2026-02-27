
# 🛍️ ElectroZone - Full-Stack Microservices E-Commerce

**ElectroZone** is a high-performance, professional e-commerce platform for high-end electronics. Built with a modern **microservices architecture**, it demonstrates seamless integration between different languages and frameworks, advanced security patterns, and premium user experiences.

[![Status](https://img.shields.io/badge/Status-Live-success.svg)](#)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](#)

---
---
## 🖼️ Gallery

### 🛍️ Customer Experience

<p align="center">
  <img src="./screenshots/storefront.png" width="45%" alt="Storefront Catalog" />
  <img src="./screenshots/product-detail.png" width="45%" alt="Product Details" />
  <br/>
  <em>Modern, responsive catalog with advanced filtering and immersive product views.</em>
</p>

---

### 🛠️ Admin Command Center

<p align="center">
  <img src="./screenshots/admin-overview.png" width="45%" alt="Admin Overview" />
  <img src="./screenshots/admin-orders.png" width="45%" alt="Order Management" />
  <br/>
  <em>Comprehensive analytics dashboard with real-time order processing and management tools.</em>
</p>

---

## 🏗️ Architecture

The platform follows a **Decoupled Microservices Pattern**, ensuring each domain (Users, Products, Orders) is independently scalable and maintainable.

```mermaid
graph TD
    User((Customer)) --> Frontend[Next.js Storefront]
    Admin((Admin)) --> Dashboard[Next.js Admin Dashboard]
    
    Frontend --> Gateway[API Gateway / Proxy]
    Dashboard --> Gateway
    
    Gateway --> US[User Service - Node.js]
    Gateway --> PS[Product Service - FastAPI]
    Gateway --> OS[Order Service - Spring Boot]
    
    US --- Mongo[(MongoDB)]
    PS --- Postgre[(PostgreSQL)]
    OS --- MySQL[(MySQL)]
    
    OS -.->|Stock Update| PS
```

| Service | Technology | Port | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js / React | `3000` | Customer Catalog & Checkout |
| **Admin UI** | Next.js / Tailwind | `3001` | Inventory & Order Analytics |
| **User** | Node.js / Express | `5001` | Auth, Identity & Role Management |
| **Product** | FastAPI / Python | `8000` | Catalog Service & Stock Logic |
| **Order** | Spring Boot / Java | `8082` | Transactional Processing & Stripe |

---

## 🛠️ Technology Stack

### **Frontend & UI**
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **State/Data:** React Hooks + Server Actions
- **i18n:** Multi-language support (7+ languages)

### **Backend Ecosystem**
- **Java:** Spring Boot 3, Hibernate, MySQL
- **Python:** FastAPI, SQLAlchemy, PostgreSQL
- **Node.js:** Express, JWT, MongoDB
- **Payments:** Stripe API Integration

---

## ✨ Enterprise Features

- **🔐 Robust Security:** Zero-trust JWT authentication with role-based dashboard access.
- **📦 Smart Inventory:** Atomic stock reduction logic across Product/Order service boundaries.
- **💳 Payment Mastery:** Secure checkout flow using Stripe's latest PaymentIntents.
- **🌐 Global Reach:** RTL support and real-time language switching.
- **📊 Real-time Ops:** Dynamic admin overview with live sales analytics and recent activity tracking.

---

## 🚀 Getting Started

### 1-Click Deployment (Docker)
```bash
git clone https://github.com/AYAScoding/ElectroZone.git
cd ElectroZone
docker-compose up -d
```
*App will be available at [http://localhost:3000](http://localhost:3000)*

### Manual Development Setup
1. **User Service:** `cd user-service && npm run dev`
2. **Product Service:** `cd product-service && uvicorn main:app`
3. **Order Service:** `cd order-service && mvn spring-boot:run`
4. **Admin Dashboard:** `cd admin-dashboard && npm run dev`
5. **Frontend:** `cd frontend && npm run dev`

---

##  Development Team

| Role | Developer | Focus |
| :--- | :--- | :--- |
| **Lead Engineer** | **Ayyoub Asri** | Microservices Architecture & Payments |
| **Security Engineer** | **Missira Abba Boukar** | Auth & Identity Services |
| **UI/UX Designer** | **Meryem Balili** | Frontend Experience |

---


