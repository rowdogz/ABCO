import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { productId, productName, expectedQty, countedQty, unitCost } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const line = await prisma.stockCheckLine.create({
      data: {
        stockCheckId: id,
        productId,
        productName,
        expectedQty: expectedQty || 0,
        countedQty: countedQty || 0,
        unitCostSnapshot: unitCost || 0
      }
    })

    return NextResponse.json({
      id: line.id,
      productId: line.productId,
      productName: line.productName,
      expectedQty: line.expectedQty,
      countedQty: line.countedQty,
      unitCost: line.unitCostSnapshot
    })
  } catch (error) {
    console.error('Error adding stock check line:', error)
    return NextResponse.json({ error: 'Failed to add line' }, { status: 500 })
  }
}
