import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchPendingApprovals, approveProductPrice, rejectProductPrice, fetchProductById, createAuditLog } from '@/lib/data-service'

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
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, action, approvedPrice, reason } = body

    if (!productId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const oldProduct = await fetchProductById(productId)
    if (!oldProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (action === 'approve') {
      if (!approvedPrice) {
        return NextResponse.json({ error: 'Approved price is required' }, { status: 400 })
      }
      const product = await approveProductPrice(productId, approvedPrice)
      
      await createAuditLog({
        actorUserId: session.user.id,
        actorRole: session.user.role,
        actionType: 'PRICE_APPROVED',
        entityType: 'Product',
        entityId: productId,
        oldValue: {
          priceApprovalStatus: oldProduct.priceApprovalStatus,
          proposedPrice: oldProduct.proposedPrice,
          approvedPrice: oldProduct.approvedPrice
        },
        newValue: {
          priceApprovalStatus: product.priceApprovalStatus,
          approvedPrice: product.approvedPrice
        }
      })
      
      return NextResponse.json(product)
    } else if (action === 'reject') {
      const product = await rejectProductPrice(productId, reason)
      
      await createAuditLog({
        actorUserId: session.user.id,
        actorRole: session.user.role,
        actionType: 'PRICE_REJECTED',
        entityType: 'Product',
        entityId: productId,
        oldValue: {
          priceApprovalStatus: oldProduct.priceApprovalStatus,
          proposedPrice: oldProduct.proposedPrice
        },
        newValue: {
          priceApprovalStatus: product.priceApprovalStatus,
          rejectionReason: product.rejectionReason
        }
      })
      
      return NextResponse.json(product)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error processing approval:', error)
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 })
  }
}
