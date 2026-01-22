import { NextRequest, NextResponse } from 'next/server'

const PROFIT4_URL = process.env.PROFIT4_GRAPHQL_URL || 'https://abco.profit4.co.uk/api/graphql'
const API_KEY = process.env.PROFIT4_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(PROFIT4_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY && { Authorization: `Bearer ${API_KEY}` })
        },
        body: JSON.stringify({ query }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = await response.json()
      return NextResponse.json(data)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json({
          error: 'Request timeout',
          message: 'The GraphQL endpoint did not respond within 10 seconds. This may indicate network restrictions or the endpoint being unavailable.',
          endpoint: PROFIT4_URL
        }, { status: 504 })
      }

      return NextResponse.json({
        error: 'Connection failed',
        message: 'Could not connect to the GraphQL endpoint. The endpoint may require VPN access or IP whitelisting.',
        endpoint: PROFIT4_URL,
        details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
      }, { status: 502 })
    }
  } catch (error) {
    console.error('Error executing GraphQL query:', error)
    return NextResponse.json({ 
      error: 'Failed to execute query',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
