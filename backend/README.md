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

## DynamoDB tables (CloudFormation)

Table definitions live in `cloudformation/dynamodb-tables.yml`. They are deployed as part of the Serverless stack — one CloudFormation stack (`ecap-api-{stage}`) creates both the DynamoDB tables and the Lambda/API Gateway resources.

| Logical resource | Purpose |
|------------------|---------|
| ServiceReportsTable | Public service delivery and crime reports |
| AuthoritiesTable | Councillors, SAPS, JMPD, admins |
| EmailNotificationsTable | Confirmation and status-update email log |
| UserSessionsTable | Authenticated authority sessions (TTL) |
| EcapUserPool | Cognito user pool for citizen/authority sign-in |
| EcapUserPoolClient | Public web app client (no secret) |

CloudFormation assigns each table a unique physical name per stack. Lambda functions receive the resolved names via environment variables (`!Ref`). Cognito IDs are injected as `COGNITO_USER_POOL_ID` and `COGNITO_CLIENT_ID`. Stack outputs export table names, Cognito IDs, and ARNs (see CloudFormation console or `npm run info` after deploy).

## Getting started

### Prerequisites

- Node.js 20+
- AWS credentials configured (`aws configure` or env vars / IAM role)
- Serverless Framework CLI (`npm install -g serverless` optional — use `npx`)

### Install

```bash
cd backend
npm install
cp .env.example .env   # optional — for seed/offline scripts
```

> Deprecation warnings about `aws-sdk@2`, old `glob`, `uuid@8/9`, etc. come from **Serverless Framework v3** dev tooling — not from your Lambda runtime, which uses AWS SDK v3.

### Type check

```bash
npm run build
```

### Deploy tables and API (CloudFormation + Serverless)

This runs `serverless deploy`, which creates/updates the CloudFormation stack including all four DynamoDB tables and Lambda functions:

```bash
# default stage: dev; region: custom.deploymentRegion in serverless.yml
npm run deploy:dev

# or explicitly override stage/region at deploy time
npm run deploy -- --stage dev --region eu-central-1
```

After deploy (or `npm run info`), the CLI prints stack outputs and updates `backend/.env` and `frontend/.env` with table names, Cognito pool/client IDs, and other values.

### Seed demo data (after deploy)

```bash
npm run seed
```

### Remove stack

```bash
npm run remove -- --stage dev
```

> Tables are retained on stack removal (`DeletionPolicy: Retain`). Redeploying creates **new** tables with new names; delete old retained tables in the DynamoDB console when you no longer need them.

### Troubleshooting deploy

| Error | Cause | Fix |
|-------|--------|-----|
| `ResourceExistenceCheck` | Orphaned resources from an older template (fixed names like `ecap-api-dev-*`) | Delete leftover DynamoDB tables from failed/removed stacks in the AWS console, then redeploy |
| `allow-credentials is not supported if 'allow-origin' is *` | CORS misconfiguration | Use explicit origins in `custom.corsAllowedOrigins` (not `*`) with `allowCredentials: true` |
| `AWS_REGION` reserved key | Setting `AWS_REGION` in Lambda env | Remove it — Lambda sets `AWS_REGION` automatically |

### Local development

```bash
npm run offline
```

API runs at `http://localhost:4000`.

> For local DynamoDB, point tables to [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) or deploy to a dev stage first.

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
| POST | `/auth/login` | Create authority session |
| POST | `/auth/logout` | Destroy session |
| GET | `/auth/session` | Current session user |
| POST | `/auth/cognito/login` | Cognito sign-in |
| POST | `/auth/cognito/register` | Cognito sign-up |
| POST | `/auth/cognito/forgot-password` | Send password reset code |
| POST | `/auth/cognito/confirm` | Confirm new account |
| POST | `/auth/cognito/resend-confirmation` | Resend verification code |
| GET | `/stats` | Public statistics |

## Connect the Next.js frontend

Set the API base URL in the frontend `.env` (region must match `custom.deploymentRegion` in `serverless.yml`):

```env
NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.eu-central-1.amazonaws.com
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-central-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=eu-central-1
```

`npm run deploy:dev` writes the Cognito values into `frontend/.env` automatically from stack outputs.

Then proxy or update frontend `fetch` calls from `/api/*` to `${NEXT_PUBLIC_API_URL}/*`.

## Session cookies

Login sets an `ecap_session` HTTP-only cookie containing a **session UUID** stored in `user-sessions`. This replaces the prototype’s direct authority-id cookie for production use.
