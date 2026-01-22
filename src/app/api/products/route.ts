import { NextRequest, NextResponse } from 'next/server'
import { fetchProducts, searchProducts } from '@/lib/data-service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')

    if (search) {
      const products = await searchProducts(search)
      return NextResponse.json(products)
    }

    const products = await fetchProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
