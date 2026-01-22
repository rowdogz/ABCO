'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  Package, 
  ClipboardCheck, 
  ShoppingCart, 
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  FileText
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/approvals', label: 'Price Approvals', icon: ClipboardCheck },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/stock-check', label: 'Stock Check', icon: ClipboardList },
  { href: '/audit', label: 'Audit Log', icon: FileText, opsOnly: true },
  { href: '/admin/graphql', label: 'GraphQL Admin', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
                A
              </div>
              <span className="font-semibold text-lg hidden sm:block">ABCO Product Management</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems
              .filter(item => !item.opsOnly || session?.user?.role === 'ops')
              .map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session?.user && (
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <span className="text-slate-400">Signed in as </span>
                  <span className="font-medium">{session.user.email}</span>
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 rounded text-xs uppercase">
                    {session.user.role}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems
              .filter(item => !item.opsOnly || session?.user?.role === 'ops')
              .map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
          {session?.user && (
            <div className="border-t border-slate-700 px-4 py-3">
              <div className="text-sm text-slate-400 mb-2">
                {session.user.email}
                <span className="ml-2 px-2 py-0.5 bg-blue-600 rounded text-xs uppercase text-white">
                  {session.user.role}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center space-x-2 text-slate-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
