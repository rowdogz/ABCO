'use client'

import { Navigation } from '@/components/navigation'
import { useState, useEffect } from 'react'
import { ClipboardList, Plus, Calendar, MapPin, Trash2, Save, AlertCircle } from 'lucide-react'
import type { Depo, Product } from '@/lib/domain/types'
import { format } from 'date-fns'

interface StockCheckLine {
  id: string
  productId: string
  productName: string
  expectedQty: number
  countedQty: number
  unitCost: number
}

interface StockCheck {
  id: string
  depoId: string
  depoName: string
  createdAt: string
  lines: StockCheckLine[]
}

export default function StockCheckPage() {
  const [stockChecks, setStockChecks] = useState<StockCheck[]>([])
  const [depos, setDepos] = useState<Depo[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDepo, setSelectedDepo] = useState('')
  const [currentCheck, setCurrentCheck] = useState<StockCheck | null>(null)
  const [newLine, setNewLine] = useState({ productId: '', expectedQty: 0, countedQty: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [deposRes, productsRes, checksRes] = await Promise.all([
        fetch('/api/depos'),
        fetch('/api/products'),
        fetch('/api/stock-checks')
      ])
      
      const deposData = await deposRes.json()
      const productsData = await productsRes.json()
      const checksData = await checksRes.json()
      
      setDepos(deposData)
      setProducts(productsData)
      setStockChecks(checksData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createStockCheck = async () => {
    if (!selectedDepo) return
    
    try {
      const res = await fetch('/api/stock-checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depoId: selectedDepo })
      })
      
      const newCheck = await res.json()
      setStockChecks([newCheck, ...stockChecks])
      setCurrentCheck(newCheck)
      setShowCreateModal(false)
      setSelectedDepo('')
    } catch (error) {
      console.error('Failed to create stock check:', error)
    }
  }

  const addLine = async () => {
    if (!currentCheck || !newLine.productId) return
    
    const product = products.find(p => p.id === newLine.productId)
    if (!product) return
    
    try {
      const res = await fetch(`/api/stock-checks/${currentCheck.id}/lines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: newLine.productId,
          productName: product.name,
          expectedQty: newLine.expectedQty,
          countedQty: newLine.countedQty,
          unitCost: product.unitCost
        })
      })
      
      const line = await res.json()
      setCurrentCheck({
        ...currentCheck,
        lines: [...currentCheck.lines, line]
      })
      setNewLine({ productId: '', expectedQty: 0, countedQty: 0 })
    } catch (error) {
      console.error('Failed to add line:', error)
    }
  }

  const removeLine = async (lineId: string) => {
    if (!currentCheck) return
    
    try {
      await fetch(`/api/stock-checks/${currentCheck.id}/lines/${lineId}`, {
        method: 'DELETE'
      })
      
      setCurrentCheck({
        ...currentCheck,
        lines: currentCheck.lines.filter(l => l.id !== lineId)
      })
    } catch (error) {
      console.error('Failed to remove line:', error)
    }
  }

  const calculateVariance = (line: StockCheckLine) => {
    const missingQty = line.expectedQty - line.countedQty
    return {
      missingQty,
      costImpact: missingQty * line.unitCost
    }
  }

  const calculateTotalVariance = (check: StockCheck) => {
    return check.lines.reduce((total, line) => {
      const { costImpact } = calculateVariance(line)
      return total + costImpact
    }, 0)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Stock Check</h1>
            <p className="text-slate-600 mt-1">Create and manage stock check entries</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>New Stock Check</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-slate-900 mb-4">Stock Checks</h2>
              
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : stockChecks.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No stock checks yet</p>
              ) : (
                <div className="space-y-2">
                  {stockChecks.map((check) => (
                    <button
                      key={check.id}
                      onClick={() => setCurrentCheck(check)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentCheck?.id === check.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">{check.depoName}</span>
                        </div>
                        <span className="text-xs text-slate-500">{check.lines.length} items</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(check.createdAt), 'dd MMM yyyy HH:mm')}</span>
                      </div>
                      {check.lines.length > 0 && (
                        <div className="mt-2 text-sm">
                          <span className={`font-medium ${calculateTotalVariance(check) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            Variance: £{calculateTotalVariance(check).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {currentCheck ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Stock Check - {currentCheck.depoName}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Created: {format(new Date(currentCheck.createdAt), 'dd MMM yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total Variance</p>
                    <p className={`text-xl font-bold ${calculateTotalVariance(currentCheck) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      £{calculateTotalVariance(currentCheck).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-900 mb-3">Add Line Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                      value={newLine.productId}
                      onChange={(e) => setNewLine({ ...newLine, productId: e.target.value })}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Expected Qty"
                      value={newLine.expectedQty || ''}
                      onChange={(e) => setNewLine({ ...newLine, expectedQty: parseInt(e.target.value) || 0 })}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Counted Qty"
                      value={newLine.countedQty || ''}
                      onChange={(e) => setNewLine({ ...newLine, countedQty: parseInt(e.target.value) || 0 })}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={addLine}
                      disabled={!newLine.productId}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {currentCheck.lines.length === 0 ? (
                  <div className="text-center py-8">
                    <ClipboardList className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No line items yet. Add products above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Product</th>
                          <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700">Expected</th>
                          <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700">Counted</th>
                          <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700">Missing</th>
                          <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700">Unit Cost</th>
                          <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700">Cost Impact</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {currentCheck.lines.map((line) => {
                          const { missingQty, costImpact } = calculateVariance(line)
                          return (
                            <tr key={line.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3">
                                <p className="font-medium text-slate-900">{line.productName}</p>
                              </td>
                              <td className="px-4 py-3 text-right text-slate-700">{line.expectedQty}</td>
                              <td className="px-4 py-3 text-right text-slate-700">{line.countedQty}</td>
                              <td className="px-4 py-3 text-right">
                                <span className={missingQty > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                                  {missingQty > 0 ? `-${missingQty}` : missingQty}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-slate-700">£{line.unitCost.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right">
                                <span className={`font-medium ${costImpact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  £{costImpact.toFixed(2)}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => removeLine(line.id)}
                                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-right font-semibold text-slate-700">
                            Total Variance:
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`font-bold ${calculateTotalVariance(currentCheck) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              £{calculateTotalVariance(currentCheck).toFixed(2)}
                            </span>
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <ClipboardList className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Stock Check Selected</h3>
                <p className="text-slate-500 mb-4">
                  Select a stock check from the list or create a new one to get started.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Stock Check</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Stock Check</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Depot
              </label>
              <select
                value={selectedDepo}
                onChange={(e) => setSelectedDepo(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Choose a depot...</option>
                {depos.map((depo) => (
                  <option key={depo.id} value={depo.id}>
                    {depo.name} ({depo.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setSelectedDepo('')
                }}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createStockCheck}
                disabled={!selectedDepo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
