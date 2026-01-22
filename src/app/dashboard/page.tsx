import { Navigation } from '@/components/navigation'
import { fetchDashboardMetrics, fetchLowStockAlerts, fetchPendingApprovals } from '@/lib/data-service'
import { 
  ClipboardCheck, 
  AlertTriangle, 
  ShoppingCart, 
  Calculator,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const metrics = await fetchDashboardMetrics()
  const lowStockAlerts = await fetchLowStockAlerts()
  const pendingApprovals = await fetchPendingApprovals()

  const tiles = [
    {
      title: 'Pending Price Approvals',
      value: metrics.pendingPriceApprovals,
      icon: ClipboardCheck,
      color: 'bg-amber-500',
      href: '/approvals',
      description: 'Products awaiting price approval'
    },
    {
      title: 'Low Stock Alerts',
      value: metrics.lowStockAlerts,
      icon: AlertTriangle,
      color: 'bg-red-500',
      href: '/products?filter=low-stock',
      description: 'Items below minimum stock level'
    },
    {
      title: 'Outstanding Orders',
      value: metrics.outstandingOrdersCount,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      href: '/orders',
      description: 'Orders pending delivery'
    },
    {
      title: 'Stock Check Variance',
      value: `£${metrics.stockCheckVarianceCost.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
      icon: Calculator,
      color: 'bg-purple-500',
      href: '/stock-check',
      description: 'Total variance cost impact'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Overview of your product management metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tiles.map((tile) => {
            const Icon = tile.icon
            return (
              <Link
                key={tile.title}
                href={tile.href}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 group"
              >
                <div className="flex items-start justify-between">
                  <div className={`${tile.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{tile.value}</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">{tile.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{tile.description}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Price Approvals Needed</h2>
              <Link href="/approvals" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {pendingApprovals.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 line-through">
                      £{product.currentPrice.toFixed(2)}
                    </p>
                    <p className="font-medium text-amber-600">
                      £{product.proposedPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {pendingApprovals.length === 0 && (
                <p className="text-slate-500 text-center py-4">No pending approvals</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Low Stock Alerts</h2>
              <Link href="/products?filter=low-stock" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {lowStockAlerts.slice(0, 5).map((stock, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{stock.depoName}</p>
                    <p className="text-sm text-slate-500">Product ID: {stock.productId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">{stock.quantity} units</p>
                    <p className="text-xs text-slate-500">Min: {stock.minStock}</p>
                  </div>
                </div>
              ))}
              {lowStockAlerts.length === 0 && (
                <p className="text-slate-500 text-center py-4">No low stock alerts</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
