# ABCO Product Management

A web application for ABCO and customer procurement users (e.g., Eurocell) to manage store stock and approvals. Built with Next.js 14+, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Dashboard**: Overview tiles showing pending price approvals, low stock alerts, outstanding orders count, and stock check variance cost
- **Price Approval Queue**: Review and approve/reject pending price changes with optional rejection reasons
- **Product Search & Detail**: Search products by SKU/name, view detailed product information including stock levels by depot
- **Outstanding Orders**: View customer orders with expected delivery dates, filter by depot, expandable line items
- **Stock Check**: Create stock check entries, add line items with expected vs counted quantities, automatic variance calculation
- **GraphQL Admin**: Test queries against the Profit4 GraphQL endpoint

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **GraphQL Client**: graphql-request

## Local Development

### Prerequisites

- Node.js 20+ (required by Next.js 16)
- npm
- Docker and Docker Compose (for PostgreSQL)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/rowdogz/ABCO.git
cd ABCO
```

2. Create a `.env` file with your database credentials:
```bash
cp .env.example .env
```

Edit `.env` and set the PostgreSQL credentials (replace with your own values):
```
POSTGRES_USER=abco
POSTGRES_PASSWORD=<your-local-dev-password>
POSTGRES_DB=abco_dev
DATABASE_URL="postgresql://abco:<your-local-dev-password>@localhost:5432/abco_dev"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
```

3. Start PostgreSQL with Docker Compose:
```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on `localhost:5432`.

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
```

The default `.env` is pre-configured for the Docker Compose PostgreSQL instance. Edit if needed:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: A secure random string for session encryption (change in production!)
- `NEXTAUTH_URL`: Your app URL (default: `http://localhost:3000`)
- `DATA_BACKEND`: Data backend to use (`mock` or `profit4`, default: `mock`)

5. Run database migrations:
```bash
npm run db:migrate
```

6. Seed the database with demo users:
```bash
npm run db:seed
```

7. Start the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Run Prisma migrations (development) |
| `npm run db:migrate:deploy` | Deploy migrations (production) |
| `npm run db:seed` | Seed database with demo users |
| `npm run db:reset` | Reset database and re-run migrations |
| `npm run db:studio` | Open Prisma Studio GUI |

### Stopping the Database

```bash
docker compose down
```

To also remove the data volume:
```bash
docker compose down -v
```

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| ops@abco.com | password123 | ops |
| procurement@eurocell.com | password123 | procurement |

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | See `.env.example` |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption | Yes | - |
| `NEXTAUTH_URL` | Application URL | Yes | `http://localhost:3000` |
| `DATA_BACKEND` | Data backend to use (`mock` or `profit4`) | No | `mock` |
| `SEED_TOKEN` | Secret token for `/api/admin/seed` endpoint | Yes (for seeding) | - |
| `PROFIT4_GRAPHQL_URL` | Profit4 GraphQL endpoint URL | Yes | - |
| `PROFIT4_API_KEY` | API key for Profit4 authentication | No | - |

## Data Backend Configuration

The application uses a repository pattern with swappable backends controlled by the `DATA_BACKEND` environment variable:

**`DATA_BACKEND=mock`** (default): Uses mock data for development. All product, stock, and order data comes from in-memory mock data. This is useful for local development and testing without requiring access to the Profit4 GraphQL endpoint.

**`DATA_BACKEND=profit4`**: Uses the real Profit4 GraphQL endpoint. Requires `PROFIT4_GRAPHQL_URL` and optionally `PROFIT4_API_KEY` to be configured. Currently throws "not configured" errors as the GraphQL queries need to be implemented once endpoint access is available.

The repository boundary is enforced by ESLint rules that prevent direct imports from `@/lib/data/mock` or `@/lib/data/profit4` in application code. All data access must go through the repository factory (`@/lib/data`) or domain types (`@/lib/domain/types`).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/graphql/      # GraphQL admin explorer
│   ├── api/                # API routes
│   ├── approvals/          # Price approval queue
│   ├── dashboard/          # Main dashboard
│   ├── login/              # Authentication
│   ├── orders/             # Outstanding orders
│   ├── products/           # Product search & detail
│   └── stock-check/        # Stock check management
├── components/             # React components
├── lib/
│   ├── data/               # Repository implementations
│   │   ├── mock/           # Mock data implementations
│   │   ├── profit4/        # Profit4 GraphQL implementations
│   │   └── index.ts        # Repository factory
│   ├── domain/             # Domain types and interfaces
│   │   ├── types.ts        # Zod schemas and types
│   │   └── repository.ts   # Repository interfaces
│   ├── auth.ts             # NextAuth configuration
│   ├── data-service.ts     # Data fetching layer (uses repositories)
│   ├── graphql-client.ts   # GraphQL client setup
│   └── prisma.ts           # Prisma client
└── types/                  # TypeScript type definitions
```

## Database Schema

The application uses PostgreSQL with Prisma for app-owned data:

- **User**: Authentication and role management
- **StockCheck**: Stock check entries by depot
- **StockCheckLine**: Individual line items with expected/counted quantities

## GraphQL Integration

The app is designed to integrate with the Profit4 GraphQL endpoint. Currently uses mock data for development as the endpoint may require VPN access or IP whitelisting.

To test GraphQL connectivity:
1. Navigate to `/admin/graphql`
2. Enter a query and click Execute
3. View the response or error details

## Known Limitations

- GraphQL endpoint connectivity depends on network access to Profit4
- Currently uses mock data for product, stock, and order information
- Stock check data is stored locally and not synced back to Profit4

## Next Steps

- Implement real GraphQL queries once endpoint access is confirmed
- Add role-based access control for specific features
- Implement real-time stock level updates
- Add export functionality for stock check reports
- Integrate with Profit4 mutations for price approval updates

## Deployment

### Database Requirements

**Important**: This application requires PostgreSQL. SQLite is not supported.

For deployment platforms like Vercel (which have ephemeral filesystems), you must use a hosted PostgreSQL service. We recommend **Neon** for its serverless architecture and Vercel integration.

### Vercel + Neon Deployment (Recommended)

#### Step 1: Create a Neon Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project (e.g., "abco-staging")
3. Copy the connection string from the dashboard (looks like `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)

#### Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Configure environment variables in Vercel dashboard:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://...@neon.tech/...?sslmode=require` | From Neon dashboard |
| `NEXTAUTH_SECRET` | `<random-32-char-string>` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `DATA_BACKEND` | `mock` | Use `mock` for staging, `profit4` when ready |

4. Deploy the application

#### Step 3: Run Database Migrations

After the first deploy, you need to run migrations and seed the database. You can do this locally:

```bash
# Set DATABASE_URL to your Neon connection string
export DATABASE_URL="postgresql://...@neon.tech/...?sslmode=require"

# Run migrations
npx prisma migrate deploy

# Seed demo users (idempotent - safe to run multiple times)
npm run db:seed
```

Or use Vercel CLI:
```bash
vercel env pull .env.local
npx prisma migrate deploy
npm run db:seed
```

#### Step 4: Verify Deployment

1. Visit your deployed URL
2. Check `/health` page to verify:
   - Database connectivity shows "OK"
   - DATA_BACKEND shows "mock"
   - Git SHA is displayed
3. Login with demo accounts to verify authentication works

### Health Check Endpoint

The app includes a health check page and API:

- **Page**: `/health` - Visual health status (public)
- **API**: `/api/health` - JSON health status for monitoring

Returns:
- App version (Git SHA)
- Database connectivity (ok/fail)
- DATA_BACKEND value
- Environment (development/production)

### Deploy to Railway (Free Tier)

Railway offers a simple deployment experience with built-in PostgreSQL. Follow these steps:

#### Step 1: Create a Railway Project

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click **"New Project"** from the dashboard
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account if not already connected
5. Select the **rowdogz/ABCO** repository
6. Railway will detect the Next.js app and start building

#### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"** in the top right
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will provision a PostgreSQL instance
4. Click on the PostgreSQL service to view connection details
5. The `DATABASE_URL` is automatically available to your app

#### Step 3: Configure Environment Variables

1. Click on your app service (not the database)
2. Go to the **"Variables"** tab
3. Add the following variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (Railway reference variable) |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.up.railway.app` (get from Deployments tab) |
| `DATA_BACKEND` | `mock` |
| `SEED_TOKEN` | Generate with `openssl rand -base64 32` |

4. Click **"Deploy"** to redeploy with new variables

#### Step 4: Seed the Database

After the first successful deployment, seed the demo users using the `/api/admin/seed` endpoint. This endpoint requires the `SEED_TOKEN` for security:

```bash
# Seed the database (requires SEED_TOKEN header)
curl -X POST https://your-app.up.railway.app/api/admin/seed \
  -H "x-seed-token: YOUR_SEED_TOKEN_VALUE"
```

This creates the demo users:
- `ops@abco.com` (password: `password123`)
- `procurement@eurocell.com` (password: `password123`)

The seed endpoint is idempotent and safe to run multiple times. It returns a JSON response indicating how many users were created.

#### Step 5: Verify Deployment

1. Visit `https://your-app.up.railway.app/health` to check:
   - Database connectivity shows **"OK"**
   - DATA_BACKEND shows **"mock"**
   - Git SHA is displayed
2. Visit the login page and sign in with demo credentials
3. Verify dashboard loads with mock data

#### Railway Configuration

The app includes a `railway.json` configuration file that:
- Uses Nixpacks builder (auto-detected)
- Runs `prisma migrate deploy` before starting the app
- Configures health check at `/api/health`
- Sets restart policy on failure

#### Troubleshooting Railway

**Database connection fails:**
- Ensure `DATABASE_URL` references the Railway Postgres service
- Check that the PostgreSQL service is running (green status)
- View logs in Railway dashboard for connection errors

**Seed endpoint returns 401:**
- Verify `SEED_TOKEN` env var is set in Railway
- Ensure the `x-seed-token` header matches the `SEED_TOKEN` value exactly
- Or use Railway's shell to run `npm run db:seed` directly

**Build fails:**
- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (18+)

### Alternative Hosted PostgreSQL Providers

If Railway doesn't suit your needs:
- [Neon](https://neon.tech) - Serverless Postgres with Vercel integration
- [Supabase](https://supabase.com) - Postgres with additional features
- [Render](https://render.com) - Managed Postgres

### Production Checklist

- [ ] Use a hosted PostgreSQL database (Neon recommended)
- [ ] Set a strong `NEXTAUTH_SECRET`
- [ ] Run `npx prisma migrate deploy` after first deploy
- [ ] Run `npm run db:seed` to create demo users
- [ ] Verify `/health` shows database connectivity OK
- [ ] Change demo user passwords or disable demo accounts for production
- [ ] Configure proper CORS and security headers
- [ ] Set up database backups (Neon has automatic backups)

## Running Tests

```bash
npm run test
```

Tests use the mock data layer and do not require a database connection. All 35 tests should pass.

## License

See [LICENSE](LICENSE) file.
