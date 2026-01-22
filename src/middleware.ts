import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/approvals/:path*',
    '/products/:path*',
    '/orders/:path*',
    '/stock-check/:path*',
    '/admin/:path*'
  ]
}
