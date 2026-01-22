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
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **GraphQL Client**: graphql-request

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/rowdogz/ABCO.git
cd ABCO
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: SQLite database path (default: `file:./dev.db`)
- `NEXTAUTH_SECRET`: A secure random string for session encryption
- `NEXTAUTH_URL`: Your app URL (default: `http://localhost:3000`)
- `PROFIT4_GRAPHQL_URL`: Profit4 GraphQL endpoint
- `PROFIT4_API_KEY`: API key for Profit4 (if required)

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Seed the database with demo users:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| ops@abco.com | password123 | ops |
| procurement@eurocell.com | password123 | procurement |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `PROFIT4_GRAPHQL_URL` | Profit4 GraphQL endpoint URL | Yes |
| `PROFIT4_API_KEY` | API key for Profit4 authentication | No |

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
├── lib/                    # Utilities and services
│   ├── auth.ts             # NextAuth configuration
│   ├── data-service.ts     # Data fetching layer
│   ├── graphql-client.ts   # GraphQL client setup
│   ├── mock-data.ts        # Mock data for development
│   └── prisma.ts           # Prisma client
└── types/                  # TypeScript type definitions
```

## Database Schema

The application uses SQLite with Prisma for app-owned data:

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

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

Note: For production, consider using PostgreSQL instead of SQLite.

## License

See [LICENSE](LICENSE) file.
