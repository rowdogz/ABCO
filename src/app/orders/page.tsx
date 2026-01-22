'use client'

import { Navigation } from '@/components/navigation'
import { useState, useEffect } from 'react'
import { ShoppingCart, Calendar, MapPin, ChevronDown, ChevronUp, Package } from 'lucide-react'
import { Order, Depo } from '@/types/graphql'
import { format } from 'date-fns'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [depos, setDepos] = useState<Depo[]>([])
  const [selectedDepo, setSelectedDepo] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    fetchDepos()
    fetchOrders()
  }, [])

  const fetchDepos = async () => {
    try {
      const res = await fetch('/api/depos')
      const data = await res.json()
      setDepos(data)
    } catch (error) {
      console.error('Failed to fetch depos:', error)
    }
  }

  const fetchOrders = async (depoId?: string) => {
    setLoading(true)
    try {
      const url = depoId ? `/api/orders?depoId=${depoId}` : '/api/orders'
      const res = await fetch(url)
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDepoChange = (depoId: string) => {
    setSelectedDepo(depoId)
    fetchOrders(depoId || undefined)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'shipped':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const calculateOrderTotal = (order: Order) => {
    return order.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Outstanding Orders</h1>
          <p className="text-slate-600 mt-1">View and manage customer orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-slate-700">Filter by Depot:</label>
            <select
              value={selectedDepo}
              onChange={(e) => handleDepoChange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Depots</option>
              {depos.map((depo) => (
                <option key={depo.id} value={depo.id}>
                  {depo.name} ({depo.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-500 mt-4">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 font-medium">No orders found</p>
              <p className="text-slate-500 mt-1">
                {selectedDepo ? 'Try selecting a different depot' : 'No outstanding orders at this time'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {orders.map((order) => (
                <div key={order.id} className="hover:bg-slate-50 transition-colors">
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{order.customerName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="flex items-center text-sm text-slate-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            {order.depoName}
                          </div>
                          <div className="flex items-center text-sm text-slate-500 mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(new Date(order.expectedDeliveryDate), 'dd MMM yyyy')}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">
                            £{calculateOrderTotal(order).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-slate-500">{order.lineItems.length} items</p>
                        </div>
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedOrder === order.id && (
                    <div className="px-4 pb-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-3">Order Line Items</h4>
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-sm text-slate-500">
                              <th className="pb-2">Product</th>
                              <th className="pb-2">SKU</th>
                              <th className="pb-2 text-right">Qty</th>
                              <th className="pb-2 text-right">Unit Price</th>
                              <th className="pb-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {order.lineItems.map((item) => (
                              <tr key={item.id}>
                                <td className="py-2">
                                  <div className="flex items-center space-x-2">
                                    <Package className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-900">{item.productName}</span>
                                  </div>
                                </td>
                                <td className="py-2">
                                  <code className="text-sm bg-white px-2 py-0.5 rounded">{item.sku}</code>
                                </td>
                                <td className="py-2 text-right text-slate-700">{item.quantity}</td>
                                <td className="py-2 text-right text-slate-700">£{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 text-right font-medium text-slate-900">
                                  £{(item.quantity * item.unitPrice).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-slate-300">
                              <td colSpan={4} className="pt-2 text-right font-medium text-slate-700">
                                Order Total:
                              </td>
                              <td className="pt-2 text-right font-bold text-slate-900">
                                £{calculateOrderTotal(order).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
