'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { AuditLog, AuditActionType } from '@/lib/domain/types'

const ACTION_TYPE_LABELS: Record<AuditActionType, string> = {
  PRICE_APPROVED: 'Price Approved',
  PRICE_REJECTED: 'Price Rejected',
  STOCKCHECK_CREATED: 'Stock Check Created',
  MINMAX_UPDATED: 'Min/Max Updated'
}

const ACTION_TYPE_COLORS: Record<AuditActionType, string> = {
  PRICE_APPROVED: 'bg-green-100 text-green-800',
  PRICE_REJECTED: 'bg-red-100 text-red-800',
  STOCKCHECK_CREATED: 'bg-blue-100 text-blue-800',
  MINMAX_UPDATED: 'bg-yellow-100 text-yellow-800'
}

export default function AuditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    if (session.user.role !== 'ops') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  useEffect(() => {
    if (session?.user.role !== 'ops') return
    fetchAuditLogs()
  }, [session, actionTypeFilter, startDate, endDate])

  const fetchAuditLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (actionTypeFilter) params.set('actionType', actionTypeFilter)
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      
      const url = `/api/audit-logs${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs')
      }
      
      const data = await response.json()
      setAuditLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const renderJsonDiff = (oldValue: unknown, newValue: unknown) => {
    return (
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Old Value</h4>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-48">
            {oldValue ? JSON.stringify(oldValue, null, 2) : 'null'}
          </pre>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">New Value</h4>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-48">
            {newValue ? JSON.stringify(newValue, null, 2) : 'null'}
          </pre>
        </div>
      </div>
    )
  }

  if (status === 'loading' || (session?.user.role !== 'ops')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="mt-1 text-sm text-gray-500">
            View all system actions and changes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="actionType" className="block text-sm font-medium text-gray-700 mb-1">
                Action Type
              </label>
              <select
                id="actionType"
                value={actionTypeFilter}
                onChange={(e) => setActionTypeFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Actions</option>
                <option value="PRICE_APPROVED">Price Approved</option>
                <option value="PRICE_REJECTED">Price Rejected</option>
                <option value="STOCKCHECK_CREATED">Stock Check Created</option>
                <option value="MINMAX_UPDATED">Min/Max Updated</option>
              </select>
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading audit logs...</div>
          ) : auditLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No audit logs found</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <>
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{log.actorUserId}</div>
                        <div className="text-xs text-gray-500">{log.actorRole}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ACTION_TYPE_COLORS[log.actionType]}`}>
                          {ACTION_TYPE_LABELS[log.actionType]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{log.entityType}</div>
                        <div className="text-xs text-gray-500 font-mono">{log.entityId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => toggleRow(log.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {expandedRows.has(log.id) ? 'Hide' : 'Show'} Changes
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(log.id) && (
                      <tr key={`${log.id}-details`}>
                        <td colSpan={5} className="px-6 py-4">
                          {renderJsonDiff(log.oldValue, log.newValue)}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
