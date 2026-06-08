# ECAP Backend — Serverless API

Node.js + TypeScript API built with the [Serverless Framework](https://www.serverless.com/), persisting ECAP application data in AWS DynamoDB.

## Architecture

```
src/
├── config/           # Environment configuration
├── container/        # Dependency injection (ServiceContainer)
├── domain/
│   ├── entities/     # OOP domain models (ServiceReport, Authority, …)
│   └── types/        # Shared TypeScript interfaces
├── repositories/     # DynamoDB data access (extends BaseRepository)
├── services/         # Business logic layer
├── handlers/         # Thin Lambda entry points
└── common/           # HTTP helpers, errors, multipart parsing
```

### Layering (OOP)

| Layer | Responsibility |
|-------|----------------|
| **Entities** | Domain rules (`canBeViewedBy`, `toPublicLookup`, `applyUpdate`) |
| **Repositories** | DynamoDB CRUD per table |
| **Services** | Orchestrate repositories and cross-cutting concerns |
| **Handlers** | Parse HTTP events, delegate to services, return responses |

## DynamoDB tables (named by function)

| Table | Purpose |
|-------|---------|
| `ecap-api-{stage}-service-reports` | Public service delivery and crime reports |
| `ecap-api-{stage}-authorities` | Councillors, SAPS, JMPD, admins |
| `ecap-api-{stage}-email-notifications` | Confirmation and status-update email log |
| `ecap-api-{stage}-user-sessions` | Authenticated authority sessions (TTL) |

## API endpoints

Mirrors the Next.js frontend API:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/reports` | List reports (filtered by session/ward/status) |
| POST | `/reports` | Create report (JSON or multipart) |
| GET | `/reports/{id}` | Get report by id or reference |
| PATCH | `/reports/{id}` | Update status, notes, expenditure |
| GET | `/reports/lookup` | Public status lookup by reference |
| GET | `/authorities` | List authorities (admin) |
| POST | `/authorities` | Register authority (admin) |
| POST | `/auth/login` | Create session |
| POST | `/auth/logout` | Destroy session |
| GET | `/auth/session` | Current session user |
| GET | `/stats` | Public statistics |

## Getting started

### Prerequisites

- Node.js 20+
- AWS credentials configured (`aws configure`)
- Serverless Framework CLI (`npm install -g serverless` optional — use `npx`)

### Install

```bash
cd backend
npm install
```

### Type check

```bash
npm run build
```

### Deploy to AWS

```bash
npm run deploy:dev
```

### Seed demo data (after deploy)

```bash
STAGE=dev npm run seed
```

### Local development

```bash
npm run offline
```

API runs at `http://localhost:4000`.

> For local DynamoDB, point tables to [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) or deploy to a dev stage first.

## Connect the Next.js frontend

Set the API base URL in the frontend `.env`:

```env
NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.af-south-1.amazonaws.com
```

Then proxy or update frontend `fetch` calls from `/api/*` to `${NEXT_PUBLIC_API_URL}/*`.

## Session cookies

Login sets an `ecap_session` HTTP-only cookie containing a **session UUID** stored in `user-sessions`. This replaces the prototype’s direct authority-id cookie for production use.
