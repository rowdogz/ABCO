import { NextRequest, NextResponse } from 'next/server'
import { fetchOrders } from '@/lib/data-service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const depoId = searchParams.get('depoId')

    const orders = await fetchOrders(depoId || undefined)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
