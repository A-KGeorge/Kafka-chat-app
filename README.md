# Kafka Chat App

A real-time chat application built with Next.js, Express, Socket.io, Kafka, Redis, and PostgreSQL. This application enables users to create group chats with real-time messaging capabilities powered by Apache Kafka for message streaming and Redis for caching.

## Architecture

```mermaid
flowchart TB
    subgraph "Client Layer"
        A[Next.js Frontend<br/>React 19 + Socket.io Client]
    end

    subgraph "Backend Layer"
        B[Express Server<br/>Node.js + TypeScript]
        C[Socket.io Server<br/>WebSocket Handler]
    end

    subgraph "Message Streaming"
        D[Apache Kafka<br/>Message Broker]
        E[Zookeeper<br/>Kafka Coordinator]
        F[Schema Registry<br/>Schema Management]
    end

    subgraph "Data Layer"
        G[(PostgreSQL<br/>Primary Database)]
        H[(Redis<br/>Cache & Session)]
    end

    subgraph "Monitoring"
        I[Kafka UI<br/>Admin Interface]
    end

    A <-->|HTTP/WebSocket| B
    A <-->|WebSocket| C
    B <-->|Prisma ORM| G
    C <-->|Pub/Sub| H
    C <-->|Produce/Consume| D
    D <-->|Coordination| E
    D <-->|Schema Validation| F
    I -.->|Monitor| D

    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style B fill:#68a063,stroke:#333,stroke-width:2px
    style C fill:#010101,stroke:#333,stroke-width:2px
    style D fill:#231f20,stroke:#333,stroke-width:2px
    style G fill:#336791,stroke:#333,stroke-width:2px
    style H fill:#dc382d,stroke:#333,stroke-width:2px
```

## Features

- 🔐 **OAuth Authentication** - Secure authentication with NextAuth.js
- 💬 **Real-time Messaging** - Instant message delivery using Socket.io
- 📊 **Message Streaming** - Apache Kafka for scalable message processing
- 👥 **Group Chats** - Create and manage group conversations
- 🔒 **Passcode Protection** - Secure group chats with passcodes
- ⚡ **Redis Caching** - Fast data access and session management
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and Shadcn/ui
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

### Frontend

- **Framework:** Next.js 15 (with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui, Radix UI
- **State Management:** React Hooks
- **Real-time:** Socket.io Client
- **Authentication:** NextAuth.js

### Backend

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **WebSocket:** Socket.io
- **Message Broker:** Apache Kafka (KafkaJS)
- **Database ORM:** Prisma
- **Cache:** Redis (ioredis)
- **Authentication:** JWT

### Infrastructure

- **Database:** PostgreSQL
- **Cache/Session Store:** Redis
- **Message Broker:** Apache Kafka
- **Service Coordination:** Apache Zookeeper
- **Schema Management:** Confluent Schema Registry
- **Monitoring:** Kafka UI
- **Containerization:** Docker & Docker Compose

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (required)
- **Git**
- **PostgreSQL** (or use a cloud provider like Neon, Supabase)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Kafka Chat app"
```

### 2. Install Docker Services

**Docker is required** for running Kafka, Zookeeper, Schema Registry, and Kafka UI.

Start the Docker services:

```bash
docker compose up -d
```

This will start:

- **Zookeeper** (port 2181)
- **Kafka** (ports 9092, 29092)
- **Schema Registry** (port 8081)
- **Kafka UI** (port 8080)

Verify services are running:

```bash
docker compose ps
```

### 3. Setup Redis

You have two options for Redis:

#### Option A: Docker (Recommended)

Run Redis using Docker:

```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

This provides:

- Redis server on port 6379
- Redis Insight UI on port 8001

#### Option B: Native Installation

Install Redis natively:

**Windows:**

```powershell
choco install redis-64
redis-server
```

**macOS:**

```bash
brew install redis
brew services start redis
```

**Linux:**

```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### 4. Setup Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-jwt-secret-key"
PORT=8000
```

Run Prisma migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:8000`

### 5. Setup Frontend

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# OAuth Provider Credentials (Google, GitHub, etc.)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)

| Variable       | Description                                   | Required           |
| -------------- | --------------------------------------------- | ------------------ |
| `DATABASE_URL` | PostgreSQL connection string                  | Yes                |
| `DIRECT_URL`   | Direct PostgreSQL connection (for migrations) | Yes                |
| `JWT_SECRET`   | Secret key for JWT tokens                     | Yes                |
| `PORT`         | Backend server port                           | No (default: 8000) |

### Frontend (.env.local)

| Variable               | Description                | Required |
| ---------------------- | -------------------------- | -------- |
| `NEXTAUTH_URL`         | Frontend URL               | Yes      |
| `NEXTAUTH_SECRET`      | NextAuth secret key        | Yes      |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID     | Yes\*    |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes\*    |
| `NEXT_PUBLIC_API_URL`  | Backend API URL            | Yes      |

\*Required if using OAuth authentication

## Development Workflow

### Start All Services

1. Start Docker services:

   ```bash
   docker compose up -d
   ```

2. Start Redis (if using Docker):

   ```bash
   docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
   ```

3. Start backend:

   ```bash
   cd backend
   npm run dev
   ```

4. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

### Access Services

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Kafka UI:** http://localhost:8080
- **Redis Insight:** http://localhost:8001
- **Schema Registry:** http://localhost:8081

### Database Management

Generate Prisma client:

```bash
cd backend
npx prisma generate
```

Create a new migration:

```bash
npx prisma migrate dev --name migration_name
```

Open Prisma Studio:

```bash
npx prisma studio
```

## Project Structure

```
.
├── backend/                    # Express backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── db.config.ts   # Prisma client
│   │   │   ├── kafka.config.ts # Kafka setup
│   │   │   └── redis.config.ts # Redis client
│   │   ├── controllers/       # Route controllers
│   │   ├── middlewares/       # Express middlewares
│   │   ├── routes/            # API routes
│   │   ├── socket.ts          # Socket.io setup
│   │   └── index.ts           # Entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/               # Next.js app router
│   │   ├── components/        # React components
│   │   ├── lib/               # Utility functions
│   │   ├── fetch/             # API functions
│   │   └── validations/       # Zod schemas
│   └── package.json
│
├── docker-compose.yml          # Docker services config
└── README.md
```

## Troubleshooting

### Kafka Connection Issues

If Kafka fails to connect:

1. Ensure Docker services are running: `docker compose ps`
2. Check Kafka logs: `docker logs kafka`
3. Restart services: `docker compose restart`

### Redis Connection Issues

If Redis fails to connect:

1. Check if Redis is running: `docker ps` or `redis-cli ping`
2. Verify port 6379 is available
3. Check Redis logs: `docker logs redis-stack`

### Database Migration Issues

If migrations fail:

1. Ensure PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Run: `npx prisma migrate reset` (⚠️ This will delete data)

### Port Conflicts

If you encounter port conflicts:

- Backend: Change `PORT` in backend/.env
- Frontend: Use `PORT=3001 npm run dev`
- Docker services: Modify port mappings in docker-compose.yml

## Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run watch` - Watch TypeScript files

### Frontend

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

---
