# SupplierIQ

AI-powered supplier matching and risk scoring microservice built with NestJS.

## Overview

SupplierIQ analyzes historical supplier performance data to automatically recommend the best suppliers for any purchase request. It computes match scores and risk scores based on category fit, regional proximity, delivery history, issue frequency, and ratings.

## Features

- **Purchase Request API** - Submit purchase requests with category, quantity, budget, urgency, and region
- **Supplier Matching** - Automatically matches suppliers based on category and region
- **Risk Scoring** - Evaluates supplier risk based on historical performance data
- **Event-Driven Processing** - Asynchronous suggestion generation via in-memory event bus
- **Ranked Recommendations** - Returns suppliers sorted by match score and risk level

## Tech Stack

- Node.js / NestJS / TypeScript
- PostgreSQL / TypeORM
- In-memory Event Bus

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Docker (optional)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials
```

### Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker run --name supplieriq-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=supplieriq -p 5432:5432 -d postgres

# Seed the database with test data
npx ts-node src/database/seed.ts
```

### Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Create Purchase Request

```bash
POST /requests
Content-Type: application/json

{
  "category": "metals",
  "description": "Need 10k aluminum casings",
  "quantity": 10000,
  "budget": 20000,
  "urgency": "high",
  "region": "DE"
}
```

### Get Purchase Request

```bash
GET /requests/:id
```

### Get Supplier Suggestions

```bash
GET /requests/:id/suggestions
```

Returns ranked supplier suggestions with match scores, risk scores, and explanations.

## Scoring Logic

### Match Score (0-1)

| Factor | Weight | Description |
|--------|--------|-------------|
| Category | 50% | 1 if supplier category matches request |
| Region | 20% | 1 if supplier region matches request |
| Experience | 30% | Based on past orders in category (max at 10 orders) |

### Risk Score (0-100)

| Factor | Weight | Description |
|--------|--------|-------------|
| Late Delivery Rate | 40% | Percentage of late deliveries |
| Issue Frequency | 30% | Issues relative to order volume |
| Rating | 20% | Inverted average rating (5 star = 0 risk) |
| Price Volatility | 10% | Price variation across orders |

## Project Structure

```
src/
├── common/
│   └── event-bus/       # In-memory pub/sub event bus
├── database/
│   └── seed.ts          # Database seeding script
├── entities/            # TypeORM entities
├── matching/            # Match score computation
├── purchase-requests/   # Purchase request API
├── risk/                # Risk score computation
└── suggestions/         # Suggestion generation & API
```

## License

MIT
