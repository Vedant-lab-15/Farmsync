# FarmSync — Farm-to-Market Supply Chain Platform

FarmSync connects farmers directly with brokers, providing real-time market prices, shipment tracking, product traceability, and farm advisory — all in one platform.

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- TanStack Query (data fetching & caching)
- React Router v6
- React Hook Form + Zod

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication (bcryptjs)
- Socket.io (real-time updates)
- Express Rate Limiting + Helmet
- Twilio (SMS — configured via env)

---

## Project Structure

```
farmsync/
├── src/                          # Frontend (React)
│   ├── components/
│   │   ├── dashboard/            # Farmer dashboard tab views
│   │   ├── broker/               # Broker dashboard tab views
│   │   └── ui/                   # shadcn/ui components
│   ├── contexts/                 # AuthContext, SMSContext
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # api.ts (centralized fetch client)
│   ├── pages/                    # Route-level pages
│   └── services/                 # smsService
│
└── backend/                      # Backend (Express)
    └── src/
        ├── config/               # Database connection
        ├── controllers/          # Business logic
        ├── middleware/            # Auth, error handler
        ├── models/               # Mongoose schemas
        └── routes/               # API route definitions
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or bun

### 1. Clone the repo

```bash
git clone https://github.com/your-username/farmsync.git
cd farmsync
```

### 2. Frontend setup

```bash
npm install
cp .env.example .env
# Fill in VITE_API_URL and VITE_GOOGLE_MAPS_API_KEY
```

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, and optionally Twilio keys
```

### 4. Run locally

In two separate terminals:

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000  
Health check: http://localhost:5000/health

---

## Environment Variables

### Frontend (`.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | No (defaults to `http://localhost:5000`) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key for route optimizer | No |

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port | No (defaults to 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRE` | JWT expiry duration | No (defaults to `7d`) |
| `FRONTEND_URL` | Frontend URL for CORS | No (defaults to `http://localhost:5173`) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS | No |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | No |
| `TWILIO_PHONE_NUMBER` | Twilio sender number | No |

---

## API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register farmer or broker | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| GET | `/api/users/profile` | Get user profile | Private |
| PUT | `/api/users/profile` | Update profile | Private |
| GET | `/api/users/overview` | Dashboard stats | Private |
| GET | `/api/market/prices` | Live market prices | Private |
| GET | `/api/market/listings` | User's listings | Private |
| POST | `/api/market/listings` | Create listing | Private |
| PUT | `/api/market/listings/:id` | Update listing | Private |
| DELETE | `/api/market/listings/:id` | Delete listing | Private |
| GET | `/api/shipments` | Active shipments | Private |
| POST | `/api/shipments` | Create shipment | Private |
| GET | `/api/shipments/history` | Delivered shipments | Private |
| GET | `/api/shipments/:id` | Single shipment | Private |
| GET | `/api/traceability` | All trace records | Private |
| GET | `/api/traceability/:productId` | Product trace | Private |
| POST | `/api/traceability` | Create trace record | Private |
| GET | `/api/advisory/weather` | Weather advisory | Private |
| GET | `/api/advisory/pest` | Pest alerts | Private |
| GET | `/api/advisory/insights` | Market insights | Private |
| POST | `/api/sms/send` | Send SMS | Private |
| GET | `/api/sms/history` | SMS history | Private |

---

## Features

- **Role-based auth** — separate farmer and broker flows with JWT
- **Farmer Dashboard** — market prices, shipment tracking, traceability, advisory
- **Broker Dashboard** — listings management, farmer network, transaction history
- **Product Traceability** — full supply chain journey with quality tests and certifications
- **Farm Advisory** — weather alerts, pest warnings, market insights
- **SMS Notifications** — price alerts, OTP verification, transaction confirmations
- **OTP Phone Verification** — proper modal dialog with digit inputs and resend cooldown
- **Route Optimizer** — Google Maps integration for logistics planning
- **Real-time** — Socket.io wired for live updates

---

## Deployment

The frontend is configured for Vercel (`vercel.json` included).  
The backend can be deployed to Railway, Render, or any Node.js host.

For production, set `NODE_ENV=production` and configure all environment variables on your hosting platform.

---

## License

MIT
