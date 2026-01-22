'use client'

import { Navigation } from '@/components/navigation'
import { useState } from 'react'
import { Play, AlertCircle, CheckCircle, Copy, Trash2 } from 'lucide-react'

const EXAMPLE_QUERIES = [
  {
    name: 'Introspection Query',
    query: `{
  __schema {
    types {
      name
      kind
    }
  }
}`
  },
  {
    name: 'Get Products',
    query: `{
  products {
    id
    sku
    name
    currentPrice
    priceApprovalStatus
  }
}`
  },
  {
    name: 'Get Stock Levels',
    query: `{
  stockLevels {
    productId
    depoId
    quantity
    minStock
    maxStock
  }
}`
  }
]

export default function GraphQLAdminPage() {
  const [query, setQuery] = useState(EXAMPLE_QUERIES[0].query)
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const executeQuery = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setResult('')

    try {
      const res = await fetch('/api/graphql/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to execute query')
        setResult(JSON.stringify(data, null, 2))
      } else {
        setSuccess(true)
        setResult(JSON.stringify(data, null, 2))
      }
    } catch (err) {
      setError('Network error: Could not connect to GraphQL endpoint')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyResult = () => {
    navigator.clipboard.writeText(result)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">GraphQL Admin</h1>
          <p className="text-slate-600 mt-1">
            Test queries against the Profit4 GraphQL endpoint
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">GraphQL Endpoint Status</p>
              <p className="text-sm text-amber-700 mt-1">
                The Profit4 GraphQL endpoint (https://abco.profit4.co.uk/api/graphql) may require 
                VPN access or IP whitelisting. The app currently uses mock data for development.
                Configure PROFIT4_API_KEY in your environment variables if authentication is required.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-slate-900 mb-4">Example Queries</h2>
              <div className="space-y-2">
                {EXAMPLE_QUERIES.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(example.query)}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                  >
                    <p className="font-medium text-slate-900">{example.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">Query Editor</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuery('')}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Clear query"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={executeQuery}
                    disabled={loading || !query.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Play className="w-4 h-4" />
                    <span>{loading ? 'Executing...' : 'Execute'}</span>
                  </button>
                </div>
              </div>
              
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your GraphQL query here..."
                className="w-full h-64 px-4 py-3 font-mono text-sm bg-slate-900 text-green-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                spellCheck={false}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-slate-900">Result</h2>
                  {success && (
                    <span className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Success
                    </span>
                  )}
                  {error && (
                    <span className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Error
                    </span>
                  )}
                </div>
                {result && (
                  <button
                    onClick={copyResult}
                    className="flex items-center space-x-1 px-3 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <pre className="w-full h-64 px-4 py-3 font-mono text-sm bg-slate-50 text-slate-800 rounded-lg overflow-auto">
                {result || 'Execute a query to see results here...'}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
