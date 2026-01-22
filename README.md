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

- Node.js 18+
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

For deployment platforms like Vercel (which have ephemeral filesystems), you must use a hosted PostgreSQL service:
- [Neon](https://neon.tech) - Serverless Postgres with generous free tier
- [Supabase](https://supabase.com) - Postgres with additional features
- [Railway](https://railway.app) - Simple Postgres hosting
- [PlanetScale](https://planetscale.com) - MySQL-compatible (would require schema changes)

### Vercel Deployment

1. Set up a hosted PostgreSQL database (e.g., Neon)
2. Push your code to GitHub
3. Import the repository in Vercel
4. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your hosted PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A secure random string (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your production URL
   - `DATA_BACKEND`: `mock` (or `profit4` when ready)
5. Deploy
6. Run migrations: `npx prisma migrate deploy` (or use Vercel's build command)

### Production Checklist

- [ ] Use a hosted PostgreSQL database
- [ ] Set a strong `NEXTAUTH_SECRET`
- [ ] Change demo user passwords or disable demo accounts
- [ ] Configure proper CORS and security headers
- [ ] Set up database backups

## Running Tests

```bash
npm run test
```

Tests use the mock data layer and do not require a database connection. All 33 tests should pass.

## License

See [LICENSE](LICENSE) file.
