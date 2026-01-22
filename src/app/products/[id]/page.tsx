import { Navigation } from '@/components/navigation'
import { fetchProductById, fetchStockForProduct, fetchOrdersForProduct } from '@/lib/data-service'
import { notFound } from 'next/navigation'
import { 
  Package, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const product = await fetchProductById(id)
  
  if (!product) {
    notFound()
  }

  const stockLevels = await fetchStockForProduct(id)
  const orders = await fetchOrdersForProduct(id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">Pending Approval</span>
      case 'Approved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Approved</span>
      case 'Rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Rejected</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/products" 
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Package className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                    <div className="flex items-center space-x-3 mt-2">
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded">{product.sku}</code>
                      <span className="text-slate-500">{product.category}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(product.priceApprovalStatus)}
              </div>

              {product.description && (
                <p className="text-slate-600 mt-4">{product.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
                <div>
                  <p className="text-sm text-slate-500">Current Price</p>
                  <p className="text-xl font-bold text-slate-900">£{product.currentPrice.toFixed(2)}</p>
                </div>
                {product.proposedPrice && (
                  <div>
                    <p className="text-sm text-slate-500">Proposed Price</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xl font-bold text-amber-600">£{product.proposedPrice.toFixed(2)}</p>
                      {product.proposedPrice > product.currentPrice ? (
                        <TrendingUp className="w-5 h-5 text-red-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">Unit Cost</p>
                  <p className="text-xl font-bold text-slate-900">£{product.unitCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Last Updated</p>
                  <div className="flex items-center text-slate-700">
                    <Clock className="w-4 h-4 mr-1" />
                    {format(new Date(product.lastUpdated), 'dd MMM yyyy')}
                  </div>
                </div>
              </div>

              {product.rejectionReason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-700">Rejection Reason:</p>
                  <p className="text-red-600 mt-1">{product.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Stock by Depot</h2>
              
              {stockLevels.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No stock data available</p>
              ) : (
                <div className="space-y-3">
                  {stockLevels.map((stock, index) => {
                    const isLowStock = stock.quantity < stock.minStock
                    const stockPercentage = Math.min((stock.quantity / stock.maxStock) * 100, 100)
                    
                    return (
                      <div key={index} className={`p-4 rounded-lg ${isLowStock ? 'bg-red-50' : 'bg-slate-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className={`w-4 h-4 ${isLowStock ? 'text-red-500' : 'text-slate-400'}`} />
                            <span className="font-medium text-slate-900">{stock.depoName}</span>
                            {isLowStock && (
                              <span className="flex items-center text-red-600 text-sm">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Low Stock
                              </span>
                            )}
                          </div>
                          <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>
                            {stock.quantity} units
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${isLowStock ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>Min: {stock.minStock}</span>
                          <span>Max: {stock.maxStock}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Product Attributes</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Min Stock Level</dt>
                  <dd className="font-medium text-slate-900">{product.minStock || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Max Stock Level</dt>
                  <dd className="font-medium text-slate-900">{product.maxStock || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Approval Status</dt>
                  <dd>{getStatusBadge(product.priceApprovalStatus)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Available Depots</dt>
                  <dd className="font-medium text-slate-900">{product.depos.length}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Outstanding Orders</h2>
                <ShoppingCart className="w-5 h-5 text-slate-400" />
              </div>
              
              {orders.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No outstanding orders</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders?id=${order.id}`}
                      className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-900">{order.orderNumber}</p>
                          <p className="text-sm text-slate-500">{order.customerName}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">
                        Delivery: {format(new Date(order.expectedDeliveryDate), 'dd MMM yyyy')}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
