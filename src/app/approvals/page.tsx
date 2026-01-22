'use client'

import { Navigation } from '@/components/navigation'
import { useState, useEffect } from 'react'
import { Check, X, Clock, AlertCircle } from 'lucide-react'
import type { Product } from '@/lib/domain/types'
import { format } from 'date-fns'

export default function ApprovalsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ open: boolean; productId: string | null }>({
    open: false,
    productId: null
  })
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    fetchPendingApprovals()
  }, [])

  const fetchPendingApprovals = async () => {
    try {
      const res = await fetch('/api/approvals')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch approvals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (productId: string, proposedPrice: number) => {
    setActionLoading(productId)
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action: 'approve', approvedPrice: proposedPrice })
      })
      
      if (res.ok) {
        setProducts(products.filter(p => p.id !== productId))
      }
    } catch (error) {
      console.error('Failed to approve:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectModal.productId) return
    
    setActionLoading(rejectModal.productId)
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: rejectModal.productId, 
          action: 'reject', 
          reason: rejectReason 
        })
      })
      
      if (res.ok) {
        setProducts(products.filter(p => p.id !== rejectModal.productId))
        setRejectModal({ open: false, productId: null })
        setRejectReason('')
      }
    } catch (error) {
      console.error('Failed to reject:', error)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Price Approval Queue</h1>
          <p className="text-slate-600 mt-1">Review and approve pending price changes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-500 mt-4">Loading approvals...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-slate-700 font-medium">All caught up!</p>
              <p className="text-slate-500 mt-1">No pending price approvals</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Product</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">SKU</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Current Price</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Proposed Price</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Depos</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Last Updated</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map((product) => {
                    const priceChange = product.proposedPrice 
                      ? ((product.proposedPrice - product.currentPrice) / product.currentPrice * 100).toFixed(1)
                      : '0'
                    const isIncrease = Number(priceChange) > 0
                    
                    return (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">{product.category}</p>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm bg-slate-100 px-2 py-1 rounded">{product.sku}</code>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-slate-700">£{product.currentPrice.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div>
                            <span className="font-medium text-slate-900">
                              £{product.proposedPrice?.toFixed(2)}
                            </span>
                            <span className={`ml-2 text-sm ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                              {isIncrease ? '+' : ''}{priceChange}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {product.depos.map((depo) => (
                              <span key={depo} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {depo}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-slate-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {format(new Date(product.lastUpdated), 'dd MMM yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleApprove(product.id, product.proposedPrice!)}
                              disabled={actionLoading === product.id}
                              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => setRejectModal({ open: true, productId: product.id })}
                              disabled={actionLoading === product.id}
                              className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Reject Price Change</h3>
            </div>
            
            <p className="text-slate-600 mb-4">
              Please provide a reason for rejecting this price change (optional).
            </p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              rows={3}
            />
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setRejectModal({ open: false, productId: null })
                  setRejectReason('')
                }}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading !== null}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
