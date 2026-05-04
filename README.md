# 🏛️ Smart Campus Resource & Event Hub

A backend-first campus resource booking system built with **NestJS**, **PostgreSQL**, and **TypeORM** — featuring cookie-based JWT authentication, a four-tier RBAC system, and a fully AI-generated frontend.

> **B.Tech Year 1 PBL Project** — School of Computer Science and Information Technology, Symbiosis Skills and Professional University, Pune (2025–26)

---

## 📌 What This Is

Colleges have shared physical spaces — auditoriums, lecture halls, computer labs, amphitheatres — and no structured way to manage who books them, who approves requests, and who can see what's happening. This project solves that with a proper role-gated booking system.

**Phase 1 (this repo):** Resource Manager — categories, resources, admin assignment, and booking foundation.

**Phase 2 (planned):** Time-slot bookings, email notifications, event publishing, student ID verification.

---

## 🏗️ Architecture

```
Browser (AI-generated React Frontend)
        │
        │  HTTP + HttpOnly Cookie (JWT)
        ▼
┌──────────────────────────────────────┐
│         NestJS Application           │
│                                      │
│  JwtAuthGuard → RolesGuard           │
│       │                              │
│  ┌────▼──────────────────────────┐   │
│  │  Controllers (route layer)    │   │
│  └────────────┬──────────────────┘   │
│  ┌────────────▼──────────────────┐   │
│  │  Services  (business logic)   │   │
│  └────────────┬──────────────────┘   │
│  ┌────────────▼──────────────────┐   │
│  │  TypeORM   (data access)      │   │
│  └────────────┬──────────────────┘   │
└───────────────┼──────────────────────┘
                │  SQL
                ▼
         PostgreSQL Database
```

---

## 👥 Role Hierarchy

| Role | Activation | Capabilities |
|------|-----------|--------------|
| **SUPERUSER** | Seeded (never registered) | Full system access, approves all accounts, manages categories and resources |
| **ADMIN** | Superuser approval | Assigned to specific resources, approves/rejects bookings for their resources |
| **ORGANIZER** | Superuser approval | Creates booking requests, views own bookings |
| **USER** | Instant on signup | Views approved public events only |

> RBAC is enforced at two layers: `RolesGuard` (role check) and service-level (data ownership check). Passing the guard is not enough — an admin can only approve bookings for resources they are explicitly assigned to.

---

## 🗃️ Data Model

```
resource_categories          resources                    bookings
──────────────────           ─────────────────────        ────────────────────
id (PK)                      id (PK)                      id (PK)
name (unique)                name                         title
description                  description                  description
                             capacity                     booking_date
                             location                     status (enum)
                             is_active                    resource_id (FK)
                             category_id (FK)  ───────►   organizer_id (FK)
                                                          approved_by_id (FK)

users                        resource_admins (join table)
──────────────────           ────────────────────────────
id (PK)                      resource_id (FK)
name                         user_id (FK)
email (unique)
password (hashed)
role (enum)
status (enum)
```

**Key design decisions:**
- `User` entity has zero relation decorators — kept clean intentionally
- Admin-resource assignment uses a `ManyToMany` join table — multiple admins per resource, any assigned admin can approve
- `unique` constraint on nothing on the join table — one admin can manage many resources, one resource can have many admins
- Booking conflict detection queries for existing `APPROVED` bookings on the same `resource_id + date` before inserting

---

## 🔐 Authentication Flow

```
POST /auth/login
      │
      ▼
LocalStrategy validates email + bcrypt.compare(password)
      │
      ▼
AuthService.login() signs JWT → { sub, email, role, status }
      │
      ▼
res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax' })
      │
      ▼
All subsequent requests → cookie sent automatically by browser
      │
      ▼
JwtStrategy extracts from req.cookies.jwt → attaches user to request
      │
      ▼
RolesGuard checks role + status === 'active'
```

JWT is delivered via **HttpOnly cookie** — never accessible to JavaScript, preventing XSS token theft. This follows OWASP session management recommendations.

---

## 📡 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Sign up — role determines activation status |
| POST | `/auth/login` | Public | Login, sets HttpOnly JWT cookie |
| POST | `/auth/logout` | Authenticated | Clears the JWT cookie |
| GET | `/auth/me` | Authenticated | Get own profile |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users/pending` | Superuser | List accounts awaiting approval |
| PATCH | `/users/:id/approve` | Superuser | Activate an account |
| PATCH | `/users/:id/reject` | Superuser | Reject an account |

### Resources
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/resources` | Superuser | Create a resource |
| GET | `/resources` | All | List all resources |
| GET | `/resources/active` | All | List active resources only |
| GET | `/resources/:id` | All | Get resource by id |
| GET | `/resources/by-category/:id` | All | Resources under a category |
| GET | `/resources/by-admin/:id` | All | Resources managed by an admin |
| GET | `/resources/:id/admins` | All | Admins assigned to a resource |
| PATCH | `/resources/:id` | Superuser | Update resource fields |
| PATCH | `/resources/:id/toggle` | Superuser | Toggle active/inactive |
| PATCH | `/resources/:id/category` | Superuser | Change resource category |
| POST | `/resources/:id/admins` | Superuser | Assign admins to a resource |
| DELETE | `/resources/:id/admin/:adminId` | Superuser | Revoke an admin from a resource |
| DELETE | `/resources/:id` | Superuser | Delete a resource |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/resources/category` | Superuser | Create a category |
| GET | `/resources/category` | All | List all categories |
| GET | `/resources/category/:id` | All | Get category with resources |
| PATCH | `/resources/category` | Superuser | Update category |
| DELETE | `/resources/category/:id` | Superuser | Delete category |

### Bookings *(Phase 1 — in progress)*
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/bookings` | Organizer | Create a booking request |
| GET | `/bookings` | Superuser, Admin | All bookings |
| GET | `/bookings/public` | Public (no auth) | Approved events only |
| GET | `/bookings/mine` | Organizer | Own booking requests |
| PATCH | `/bookings/:id/approve` | Admin, Superuser | Approve a booking |
| PATCH | `/bookings/:id/reject` | Admin, Superuser | Reject a booking |
| DELETE | `/bookings/:id` | Organizer | Cancel own pending booking |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | NestJS (v10) |
| Language | TypeScript (v5) |
| Database | PostgreSQL (v15) |
| ORM | TypeORM (v0.3) |
| Authentication | Passport.js — Local + JWT strategies |
| Session Transport | HttpOnly Cookie |
| Validation | class-validator + class-transformer |
| Serialization | Custom `SerializeInterceptor` with `plainToClass` |
| Dev Environment | Linux (Ubuntu 22.04) |
| Frontend | AI-generated — Claude (Anthropic) |

---

## 📁 Project Structure

```
src/
├── auth/
│   ├── decorators/         @Roles(), @CurrentUser()
│   ├── guards/             JwtAuthGuard, RolesGuard, LocalAuthGuard
│   ├── strategies/         jwt.strategy.ts, local.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
│
├── users/
│   ├── dto/
│   ├── entities/           user.entity.ts
│   ├── enums/              role.enum.ts, user-status.enum.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
│
├── resources/
│   ├── dto/
│   ├── entities/           resource.entity.ts, resource-category.entity.ts
│   ├── interceptors/       serializer
│   ├── resource.controller.ts
│   ├── category.controller.ts
│   ├── resource.service.ts
│   ├── category.service.ts
│   └── resources.module.ts
│
├── bookings/               (in progress)
│   ├── dto/
│   ├── entities/           booking.entity.ts
│   ├── enums/              booking-status.enum.ts
│   ├── bookings.controller.ts
│   ├── bookings.module.ts
│   └── bookings.service.ts
│
├── common/
│   └── interceptors/       serialize.interceptor.ts
│
├── seed.ts                 Standalone seeder — superuser + 7 categories
├── app.module.ts
└── main.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL v15+
- npm v9+

### Installation

```bash
git clone https://github.com/yourusername/smart-campus-hub
cd smart-campus-hub
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=smart_campus

JWT_SECRET=your_secret_key_minimum_32_chars
JWT_EXPIRY=7d

NODE_ENV=development
```

### Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE smart_campus;"

# Run the seeder (creates superuser + 7 resource categories)
ts-node src/seed.ts
```

### Run

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

Server starts at `http://localhost:3000`. All routes are prefixed with `/api`.

---

## 🌱 Seeded Data

The seeder creates:

**Superuser account** — credentials configurable via env  
**Resource Categories:**
1. Lecture Hall
2. Auditorium
3. Amphitheatre
4. Library
5. Skill Center Lab
6. Advanced Computer Lab
7. Workshop Computer Lab

---

## 🔑 Key Implementation Notes

**Cookie-based JWT over localStorage** — HttpOnly cookies cannot be accessed by JavaScript, protecting against XSS. `SameSite=Lax` provides CSRF protection. This follows OWASP session management best practices.

**Two-layer access control** — The `RolesGuard` checks the role at the route level. Individual service methods perform a second data-level check (e.g., is this admin actually assigned to this resource's join table?). Passing the guard alone is not sufficient for sensitive operations.

**Owning side persistence** — All relation changes are made from the FK-owning side. The `ManyToMany` join table is owned by `Resource` via `@JoinTable()`. User entity has zero relation decorators by design.

**Response serialization** — A custom `SerializeInterceptor` using `plainToClass` with `excludeExtraneousValues: true` controls exactly what leaves the server. TypeORM's raw output is never sent directly to the client.

**AI-generated frontend** — The entire frontend was generated using Claude (Anthropic). All backend code, system architecture, entity design, and business logic was hand-written. This is documented explicitly for academic honesty.

---

## 🗺️ Roadmap

- [x] Auth module — cookie JWT, local strategy, guards, decorators
- [x] Users module — registration, approval workflow, role management  
- [x] Resources module — categories, resources, ManyToMany admin assignment
- [ ] Bookings module — conflict detection, approval workflow, public calendar
- [ ] Time-slot booking (Phase 2)
- [ ] Email notifications (Phase 2)
- [ ] Student ID verification (Phase 2)
- [ ] TypeORM migrations replacing `synchronize: true` (pre-production)
- [ ] Docker Compose setup (Phase 2)
- [ ] Next.js / React SSR frontend (Phase 3)

---

## 📚 References & Learning Resources

- [NestJS Documentation](https://docs.nestjs.com) — especially the [Authorization / RBAC section](https://docs.nestjs.com/security/authorization) which directly informed the `RolesGuard` implementation
- [Stephen Grider — The Comprehensive Guide to NestJS](https://www.udemy.com/course/nestjs-the-complete-developers-guide/) — primary learning resource
- [TypeORM Documentation](https://typeorm.io)
- [Passport.js Documentation](https://www.passportjs.org/docs/)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [RFC 7519 — JSON Web Token](https://tools.ietf.org/html/rfc7519)
- Claude (Anthropic) — frontend generation and architectural guidance

---

## ⚠️ Academic Honesty Note

This project was submitted as a B.Tech Year 1 PBL project. The **frontend was entirely AI-generated** using Claude (Anthropic). All backend code including NestJS modules, entity design, service logic, guard implementation, and database design was written by me. This distinction is documented in the project report.

---

*Smart Campus Resource & Event Hub — SSPU CSIT, Academic Year 2025–26*
