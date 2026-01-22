import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string; lineId: string }>
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { lineId } = await params

    await prisma.stockCheckLine.delete({
      where: { id: lineId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting stock check line:', error)
    return NextResponse.json({ error: 'Failed to delete line' }, { status: 500 })
  }
}
