import { NextRequest, NextResponse } from 'next/server'
import { fetchPendingApprovals, approveProductPrice, rejectProductPrice } from '@/lib/data-service'

export async function GET() {
  try {
    const products = await fetchPendingApprovals()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching approvals:', error)
    return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, action, approvedPrice, reason } = body

    if (!productId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (action === 'approve') {
      if (!approvedPrice) {
        return NextResponse.json({ error: 'Approved price is required' }, { status: 400 })
      }
      const product = await approveProductPrice(productId, approvedPrice)
      return NextResponse.json(product)
    } else if (action === 'reject') {
      const product = await rejectProductPrice(productId, reason)
      return NextResponse.json(product)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error processing approval:', error)
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 })
  }
}
