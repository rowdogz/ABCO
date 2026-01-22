import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchAuditLogs } from '@/lib/data-service'
import type { AuditActionType } from '@/lib/domain/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ops') {
      return NextResponse.json({ error: 'Forbidden - ops role required' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const actionType = searchParams.get('actionType') as AuditActionType | null
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const filters: {
      actionType?: AuditActionType
      startDate?: Date
      endDate?: Date
    } = {}

    if (actionType) {
      filters.actionType = actionType
    }
    if (startDate) {
      filters.startDate = new Date(startDate)
    }
    if (endDate) {
      filters.endDate = new Date(endDate)
    }

    const auditLogs = await fetchAuditLogs(Object.keys(filters).length > 0 ? filters : undefined)
    return NextResponse.json(auditLogs)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}
