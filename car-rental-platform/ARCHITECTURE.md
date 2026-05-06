# Car Rental Platform - Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────┐         ┌──────────────────────┐          │
│  │  Customer Portal     │         │   Host Portal        │          │
│  │  (React + Vite)      │         │  (React + Vite)      │          │
│  │                      │         │                      │          │
│  │ - Browse Cars        │         │ - Add Cars           │          │
│  │ - Book Cars          │         │ - Manage Cars        │          │
│  │ - View Bookings      │         │ - View Bookings      │          │
│  └──────────────────────┘         └──────────────────────┘          │
│           │                                  │                       │
│           └──────────────┬───────────────────┘                       │
│                          │                                           │
│                    HTTP/HTTPS                                        │
│                    (Axios)                                           │
│                          │                                           │
└──────────────────────────┼───────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / CORS                              │
├─────────────────────────────────────────────────────────────────────┤
│  - CORS Configuration                                                │
│  - Request Routing                                                   │
│  - Response Handling                                                 │
└──────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER (Spring Boot)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              SECURITY LAYER                                 │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  JWT Authentication Filter                           │  │   │
│  │  │  - Token Validation                                  │  │   │
│  │  │  - User Authentication                              │  │   │
│  │  │  - Role-Based Access Control                        │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                           │                                          │
│                           ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              CONTROLLER LAYER                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │   │
│  │  │ AuthController│  │ CarController│  │BookingController│  │   │
│  │  │              │  │              │  │              │     │   │
│  │  │ - Register   │  │ - Browse     │  │ - Create     │     │   │
│  │  │ - Login      │  │ - Add        │  │ - View       │     │   │
│  │  │              │  │ - Update     │  │ - Cancel     │     │   │
│  │  │              │  │ - Delete     │  │              │     │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                           │                                          │
│                           ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              SERVICE LAYER                                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │   │
│  │  │ AuthService  │  │ CarService   │  │BookingService│     │   │
│  │  │              │  │              │  │              │     │   │
│  │  │ - Register   │  │ - CRUD Ops   │  │ - Booking    │     │   │
│  │  │ - Login      │  │ - Validation │  │ - Validation │     │   │
│  │  │ - JWT Gen    │  │ - Image Mgmt │  │ - Pricing    │     │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │   │
│  │                                                              │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │ CloudinaryService                                    │  │   │
│  │  │ - Image Upload                                       │  │   │
│  │  │ - Image Deletion                                     │  │   │
│  │  │ - URL Management                                     │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                           │                                          │
│                           ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              REPOSITORY LAYER (Data Access)                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │   │
│  │  │UserRepository│  │CarRepository │  │BookingRepository│   │   │
│  │  │              │  │              │  │              │     │   │
│  │  │ - Find User  │  │ - Find Cars  │  │ - Find       │     │   │
│  │  │ - Save User  │  │ - Save Car   │  │ - Save       │     │   │
│  │  │ - Delete User│  │ - Delete Car │  │ - Delete     │     │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                           │                                          │
│                           ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              ENTITY LAYER (Domain Models)                   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │   │
│  │  │    User      │  │     Car      │  │   Booking    │     │   │
│  │  │              │  │              │  │              │     │   │
│  │  │ - id         │  │ - id         │  │ - id         │     │   │
│  │  │ - username   │  │ - model      │  │ - userId     │     │   │
│  │  │ - password   │  │ - age        │  │ - carId      │     │   │
│  │  │ - email      │  │ - price      │  │ - startDate  │     │   │
│  │  │ - role       │  │ - images     │  │ - endDate    │     │   │
│  │  │ - address    │  │ - hostId     │  │ - status     │     │   │
│  │  │ - license    │  │              │  │ - totalPrice │     │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                             │  │
│  │                                                              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │  users   │  │   cars   │  │ bookings │  │car_images│   │  │
│  │  │          │  │          │  │          │  │          │   │  │
│  │  │ - id     │  │ - id     │  │ - id     │  │ - carId  │   │  │
│  │  │ - user   │  │ - model  │  │ - userId │  │ - url    │   │  │
│  │  │ - pass   │  │ - age    │  │ - carId  │  │          │   │  │
│  │  │ - email  │  │ - price  │  │ - dates  │  │          │   │  │
│  │  │ - role   │  │ - hostId │  │ - status │  │          │   │  │
│  │  │ - addr   │  │ - images │  │ - price  │  │          │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  │                                                              │  │
│  │  Relationships:                                             │  │
│  │  - User (1) ──→ (N) Cars                                   │  │
│  │  - User (1) ──→ (N) Bookings                               │  │
│  │  - Car (1) ──→ (N) Bookings                                │  │
│  │  - Car (1) ──→ (N) Images                                  │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Cloudinary (Image Storage)                      │  │
│  │                                                              │  │
│  │  - Image Upload                                             │  │
│  │  - Image Storage                                            │  │
│  │  - Image Optimization                                       │  │
│  │  - CDN Delivery                                             │  │
│  │  - URL Generation                                           │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### User Registration Flow

```
┌─────────────┐
│   User      │
│  (Frontend) │
└──────┬──────┘
       │ 1. Fill Registration Form
       │
       ▼
┌──────────────────────┐
│ Register Component   │
│ (React)              │
└──────┬───────────────┘
       │ 2. POST /api/auth/register
       │
       ▼
┌──────────────────────┐
│ AuthController       │
│ (Spring Boot)        │
└──────┬───────────────┘
       │ 3. Call AuthService.register()
       │
       ▼
┌──────────────────────┐
│ AuthService          │
│ - Validate Input     │
│ - Hash Password      │
│ - Create User        │
└──────┬───────────────┘
       │ 4. Save to Database
       │
       ▼
┌──────────────────────┐
│ UserRepository       │
│ (JPA)                │
└──────┬───────────────┘
       │ 5. INSERT INTO users
       │
       ▼
┌──────────────────────┐
│ PostgreSQL Database  │
└──────┬───────────────┘
       │ 6. User Saved
       │
       ▼
┌──────────────────────┐
│ Generate JWT Token   │
└──────┬───────────────┘
       │ 7. Return AuthResponse
       │
       ▼
┌──────────────────────┐
│ Frontend             │
│ - Store Token        │
│ - Store User Info    │
│ - Redirect to Portal │
└──────────────────────┘
```

### Car Booking Flow

```
┌─────────────┐
│   Customer  │
│  (Frontend) │
└──────┬──────┘
       │ 1. Select Dates & Book
       │
       ▼
┌──────────────────────┐
│ CarDetails Component │
│ (React)              │
└──────┬───────────────┘
       │ 2. POST /api/bookings/create
       │    (with JWT Token)
       │
       ▼
┌──────────────────────┐
│ JwtAuthenticationFilter
│ - Validate Token     │
│ - Extract User ID    │
└──────┬───────────────┘
       │ 3. Call BookingController
       │
       ▼
┌──────────────────────┐
│ BookingController    │
└──────┬───────────────┘
       │ 4. Call BookingService
       │
       ▼
┌──────────────────────┐
│ BookingService       │
│ - Validate Dates     │
│ - Check Availability │
│ - Calculate Price    │
│ - Create Booking     │
└──────┬───────────────┘
       │ 5. Check Conflicts
       │
       ▼
┌──────────────────────┐
│ BookingRepository    │
│ - Query Conflicts    │
└──────┬───────────────┘
       │ 6. SELECT * FROM bookings
       │
       ▼
┌──────────────────────┐
│ PostgreSQL Database  │
└──────┬───────────────┘
       │ 7. No Conflicts
       │
       ▼
┌──────────────────────┐
│ Save Booking         │
└──────┬───────────────┘
       │ 8. INSERT INTO bookings
       │
       ▼
┌──────────────────────┐
│ PostgreSQL Database  │
└──────┬───────────────┘
       │ 9. Booking Saved
       │
       ▼
┌──────────────────────┐
│ Return BookingResponse
│ (with Booking Details)
└──────┬───────────────┘
       │ 10. Display Success
       │
       ▼
┌──────────────────────┐
│ Customer Dashboard   │
│ - Show Booking       │
│ - Confirm Details    │
└──────────────────────┘
```

### Image Upload Flow

```
┌─────────────┐
│   Host      │
│  (Frontend) │
└──────┬──────┘
       │ 1. Select Images
       │
       ▼
┌──────────────────────┐
│ AddCar Component     │
│ (React)              │
└──────┬───────────────┘
       │ 2. POST /api/cars/host/add
       │    (multipart/form-data)
       │    (with JWT Token)
       │
       ▼
┌──────────────────────┐
│ JwtAuthenticationFilter
│ - Validate Token     │
│ - Extract Host ID    │
└──────┬───────────────┘
       │ 3. Call CarController
       │
       ▼
┌──────────────────────┐
│ CarController        │
└──────┬───────────────┘
       │ 4. Call CarService
       │
       ▼
┌──────────────────────┐
│ CarService           │
│ - Validate Input     │
│ - Process Images     │
└──────┬───────────────┘
       │ 5. For Each Image
       │
       ▼
┌──────────────────────┐
│ CloudinaryService    │
│ - Upload Image       │
└──────┬───────────────┘
       │ 6. Upload to Cloudinary
       │
       ▼
┌──────────────────────┐
│ Cloudinary API       │
│ - Store Image        │
│ - Optimize           │
│ - Generate URL       │
└──────┬───────────────┘
       │ 7. Return Image URL
       │
       ▼
┌──────────────────────┐
│ CarService           │
│ - Collect URLs       │
│ - Create Car Entity  │
└──────┬───────────────┘
       │ 8. Save Car with URLs
       │
       ▼
┌──────────────────────┐
│ CarRepository        │
└──────┬───────────────┘
       │ 9. INSERT INTO cars
       │    INSERT INTO car_images
       │
       ▼
┌──────────────────────┐
│ PostgreSQL Database  │
└──────┬───────────────┘
       │ 10. Car & Images Saved
       │
       ▼
┌──────────────────────┐
│ Return CarResponse   │
│ (with Image URLs)    │
└──────┬───────────────┘
       │ 11. Display Success
       │
       ▼
┌──────────────────────┐
│ Host Dashboard       │
│ - Show New Car       │
│ - Display Images     │
└──────────────────────┘
```

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ React 18.2.0 + Vite 5.0.0                           │  │
│  │ - React Router v6 (Navigation)                       │  │
│  │ - Axios (HTTP Client)                               │  │
│  │ - CSS3 (Styling)                                     │  │
│  │ - JavaScript (Logic)                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                    HTTP/HTTPS (REST)
                           │
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Spring Boot 3.2.0 (Java 17)                         │  │
│  │ - Spring Web (REST APIs)                            │  │
│  │ - Spring Security (Authentication)                  │  │
│  │ - Spring Data JPA (ORM)                             │  │
│  │ - JJWT (JWT Tokens)                                 │  │
│  │ - Cloudinary SDK (Image Upload)                     │  │
│  │ - Maven (Build Tool)                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                    JDBC / SQL
                           │
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ PostgreSQL 12+                                       │  │
│  │ - Relational Database                               │  │
│  │ - ACID Compliance                                    │  │
│  │ - Indexes for Performance                           │  │
│  │ - Foreign Keys for Integrity                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                    REST API (HTTPS)
                           │
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Cloudinary                                           │  │
│  │ - Image Upload & Storage                            │  │
│  │ - Image Optimization                                │  │
│  │ - CDN Delivery                                       │  │
│  │ - URL Generation                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: HTTPS/TLS                                          │
│  ├─ Encrypted Communication                                  │
│  └─ Certificate-based Authentication                         │
│                                                               │
│  Layer 2: CORS                                               │
│  ├─ Origin Validation                                        │
│  └─ Request Method Validation                                │
│                                                               │
│  Layer 3: JWT Authentication                                 │
│  ├─ Token Generation (Login)                                 │
│  ├─ Token Validation (Every Request)                         │
│  └─ Token Expiration (24 hours)                              │
│                                                               │
│  Layer 4: Spring Security                                    │
│  ├─ Authentication Filter                                    │
│  ├─ Authorization Rules                                      │
│  └─ Role-Based Access Control                                │
│                                                               │
│  Layer 5: Input Validation                                   │
│  ├─ Frontend Validation                                      │
│  ├─ Backend Validation                                       │
│  └─ Database Constraints                                     │
│                                                               │
│  Layer 6: Password Security                                  │
│  ├─ BCrypt Hashing                                           │
│  ├─ Salt Generation                                          │
│  └─ Strength Requirements                                    │
│                                                               │
│  Layer 7: Data Protection                                    │
│  ├─ SQL Injection Prevention (JPA)                           │
│  ├─ XSS Prevention                                           │
│  └─ CSRF Protection                                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ CDN / Static Hosting                                 │  │
│  │ - React Frontend (Vercel/Netlify/S3)                │  │
│  │ - Static Assets                                      │  │
│  │ - Caching & Compression                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                    HTTPS (Port 443)                          │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Load Balancer / Reverse Proxy                        │  │
│  │ - SSL/TLS Termination                               │  │
│  │ - Request Routing                                    │  │
│  │ - Load Distribution                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                    HTTP (Port 8080)                          │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Application Servers (Spring Boot)                    │  │
│  │ - Multiple Instances (Horizontal Scaling)           │  │
│  │ - Health Checks                                      │  │
│  │ - Auto-restart on Failure                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                    JDBC (Port 5432)                          │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Database Server (PostgreSQL)                         │  │
│  │ - Primary Database                                   │  │
│  │ - Automated Backups                                  │  │
│  │ - Replication (Optional)                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Monitoring & Logging                                 │  │
│  │ - Application Logs                                   │  │
│  │ - Performance Metrics                                │  │
│  │ - Error Tracking                                     │  │
│  │ - Alerts & Notifications                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ External Services                                    │  │
│  │ - Cloudinary (Image Storage)                         │  │
│  │ - Email Service (Optional)                           │  │
│  │ - Payment Gateway (Optional)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: May 2026
