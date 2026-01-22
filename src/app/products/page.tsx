'use client'

import { Navigation } from '@/components/navigation'
import { useState, useEffect, Suspense } from 'react'
import { Search, Package, AlertTriangle, ChevronRight } from 'lucide-react'
import { Product } from '@/types/graphql'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ProductsContent() {
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')
  
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProducts()
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to search products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Pending</span>
      case 'Approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Approved</span>
      case 'Rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Rejected</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1">
            {filter === 'low-stock' ? 'Products with low stock levels' : 'Search and manage products'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by SKU or product name..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-500 mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 font-medium">No products found</p>
              <p className="text-slate-500 mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-slate-900">{product.name}</p>
                        {getStatusBadge(product.priceApprovalStatus)}
                      </div>
                      <div className="flex items-center space-x-3 mt-1">
                        <code className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {product.sku}
                        </code>
                        <span className="text-sm text-slate-500">{product.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-medium text-slate-900">£{product.currentPrice.toFixed(2)}</p>
                      {product.proposedPrice && (
                        <p className="text-sm text-amber-600">
                          Proposed: £{product.proposedPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                    
                    {product.minStock && (
                      <div className="flex items-center space-x-1 text-sm">
                        <AlertTriangle className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-500">
                          Min: {product.minStock}
                        </span>
                      </div>
                    )}
                    
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-500 mt-4">Loading...</p>
          </div>
        </main>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
