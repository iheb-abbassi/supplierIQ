# 📘 CLAUDE.md

## Project Name
SupplierIQ – AI Supplier Matching & Risk Scoring Microservice

## Goal
SupplierIQ is a NestJS microservice that:
- Accepts purchase requests (category, description, quantity, urgency, budget, region)
- Uses historical supplier data from PostgreSQL (orders, issues, ratings)
- Computes:
  - matchScore (0–1)
  - riskScore (0–100)
  - explanation string
- Stores and returns ranked supplier recommendations.
- Uses an event-driven flow (`RequestCreated` → background processing).

## Architecture
Tech stack:
- Node.js, NestJS, TypeScript
- PostgreSQL + TypeORM
- Jest
- Simple in-memory event bus

Main modules:
- `suppliers`
- `purchase-requests`
- `matching`
- `risk`
- `orders`
- `supplier-eval`
- `suggestions`
- `common/event-bus`

## Data model (conceptual)
Tables:
- suppliers
- purchase_requests
- purchase_orders
- supplier_issues
- supplier_ratings
- supplier_suggestions

## Scoring logic (do not change unless I ask)
MatchingEngine:
- matchScore ∈ [0, 1]
- 50% category match
- 20% region match
- 30% experience score (number of past orders in category, capped)

RiskEngine:
- riskScore ∈ [0, 100]
- Based on:
  - lateDeliveryRate (40%)
  - issueFrequency (30%)
  - normalizedRating (20%)
  - priceVolatility (10%)

## Flow
1. POST /requests → save PurchaseRequest + emit RequestCreated event
2. Listener:
   - loads request + suppliers
   - calls MatchingEngineService + RiskEngineService
   - stores SupplierSuggestion rows
3. GET /requests/:id/suggestions → return top suppliers (sorted by matchScore desc, riskScore asc)

## Rules for Claude
- Respect this architecture and flow.
- Keep code simple and well commented.
- Don’t introduce message queues or extra frameworks unless I explicitly ask.
- Don’t radically restructure folders without my request.
