import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { mockDepos } from '@/lib/mock-data'

export async function GET() {
  try {
    const stockChecks = await prisma.stockCheck.findMany({
      include: {
        lines: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedChecks = stockChecks.map(check => {
      const depo = mockDepos.find(d => d.id === check.depoId)
      return {
        id: check.id,
        depoId: check.depoId,
        depoName: depo?.name || check.depoId,
        createdAt: check.createdAt.toISOString(),
        lines: check.lines.map(line => ({
          id: line.id,
          productId: line.productId,
          productName: line.productName || '',
          expectedQty: line.expectedQty,
          countedQty: line.countedQty,
          unitCost: line.unitCostSnapshot
        }))
      }
    })

    return NextResponse.json(formattedChecks)
  } catch (error) {
    console.error('Error fetching stock checks:', error)
    return NextResponse.json({ error: 'Failed to fetch stock checks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { depoId } = body

    if (!depoId) {
      return NextResponse.json({ error: 'Depot ID is required' }, { status: 400 })
    }

    const stockCheck = await prisma.stockCheck.create({
      data: {
        depoId,
        createdBy: session.user.id
      },
      include: {
        lines: true
      }
    })

    const depo = mockDepos.find(d => d.id === depoId)

    return NextResponse.json({
      id: stockCheck.id,
      depoId: stockCheck.depoId,
      depoName: depo?.name || depoId,
      createdAt: stockCheck.createdAt.toISOString(),
      lines: []
    })
  } catch (error) {
    console.error('Error creating stock check:', error)
    return NextResponse.json({ error: 'Failed to create stock check' }, { status: 500 })
  }
}
