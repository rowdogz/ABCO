import { NextResponse } from 'next/server'
import { fetchDepos } from '@/lib/data-service'

export async function GET() {
  try {
    const depos = await fetchDepos()
    return NextResponse.json(depos)
  } catch (error) {
    console.error('Error fetching depos:', error)
    return NextResponse.json({ error: 'Failed to fetch depos' }, { status: 500 })
  }
}
