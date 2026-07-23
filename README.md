# 🌍 Travel 360 API

RESTful backend API powering the Travel 360 platform.

Built using **Node.js**, **Express.js**, **TypeScript**, **MongoDB**, and **Socket.IO**, the backend provides secure authentication, travel management, booking services, payment processing, AI integrations, and real-time communication.

---

# ✨ Features

## Authentication

- JWT Authentication
- Google OAuth
- Passport.js
- Secure Password Hashing
- Refresh Token Support
- Role-Based Authorization

---

## User Management

- Registration
- Login
- Profile Management
- Password Reset
- Email Verification

---

## Travel Management

- CRUD Travel Packages
- Categories
- Destinations
- Tour Images
- Itinerary Management

---

## Booking System

- Create Booking
- Booking History
- Booking Status
- Cancel Booking

---

## Payment

- Stripe Integration
- Payment Verification
- Webhooks

---

## File Upload

- Multer
- Cloudinary Integration

---

## AI Features

- Google Gemini API
- Groq API
- AI Trip Recommendation
- AI Travel Assistant

---

## Realtime

- Socket.IO
- Notifications
- Live Updates

---

## Email

- Nodemailer
- HTML Email Templates

---

## Security

- Rate Limiting
- CORS
- Cookie Parser
- JWT
- Password Hashing

---

# 🛠 Tech Stack

## Runtime

- Node.js

## Framework

- Express.js

## Language

- TypeScript

## Database

- MongoDB
- Mongoose

## Authentication

- Passport
- JWT
- Google OAuth

## Validation

- Zod

## Storage

- Cloudinary

## Payments

- Stripe

## Email

- Nodemailer

## AI

- Google Gemini
- Groq

## Realtime

- Socket.IO

---

# 📁 Project Structure

```
src
│
├── app
├── config
├── controllers
├── middlewares
├── models
├── modules
├── routes
├── services
├── interfaces
├── utils
├── validations
└── server.ts
```

---

# 🚀 Getting Started

## Clone

```bash
git clone https://github.com/yourusername/travel-360-api.git

cd travel-360-api
```

---

## Install

```bash
npm install
```

---

## Environment Variables

Create

```
.env
```

Example

```env
PORT=5000

NODE_ENV=development

DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRES=

REFRESH_TOKEN_EXPIRES=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_CALLBACK_URL=

SESSION_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

STRIPE_SECRET_KEY=

GEMINI_API_KEY=

GROQ_API_KEY=

EMAIL_USER=

EMAIL_PASSWORD=
```

---

## Run Development Server

```bash
npm run dev
```

---

# Build

```bash
npm run build
```

---

# Production

```bash
node dist/server.js
```

---

# API Architecture

```
Client

↓

Express Router

↓

Authentication Middleware

↓

Controller

↓

Service Layer

↓

Database (MongoDB)

↓

Response
```

---

# Security

- JWT Authentication
- Role Authorization
- Password Hashing
- Rate Limiting
- CORS Protection
- Secure Cookies

---

# Scripts

```bash
npm run dev

npm run build
```

---

# REST API

Typical modules include:

- Authentication
- Users
- Travel Packages
- Bookings
- Payments
- Notifications
- AI Services

---

# Deployment

Supports deployment on

- Render
- Railway
- AWS EC2
- Docker
- DigitalOcean

---

# Future Roadmap

- Redis Caching
- Queue System (BullMQ)
- Kubernetes
- Microservices
- API Gateway
- OpenAPI / Swagger
- CI/CD Pipeline
- Monitoring & Logging

---

# License

MIT License

---

# Author

Travel 360 Team
