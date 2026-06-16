import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  LayoutDashboard,
  Link2,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/links', label: 'Enlaces', icon: Link2 },
  { href: '/employees', label: 'Equipo', icon: Users },
]

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
              <div className="flex items-center">
                
                <Link href="/dashboard" className="flex items-center">
                  <Image
                    src="/images/dawere-logo.svg"
                    alt="Dawere"
                    width={160}
                    height={40}
                />
                </Link>
              </div>
              <span className="text-xs font-medium text-dawere-teal/60 border-l border-dawere-teal/20 pl-2 hidden sm:block">
                Intranet
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = router.pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-dawere-teal-50 text-dawere-teal'
                        : 'text-dawere-dark-light hover:bg-dawere-gray-light hover:text-dawere-dark'
                    )}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {session?.user && (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-dawere-gray-light transition-all duration-200"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ''}
                        width={32}
                        height={32}
                        className="rounded-full ring-2 ring-dawere-teal/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-dawere-teal flex items-center justify-center text-white text-xs font-bold">
                        {(session.user.name || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-semibold text-dawere-dark leading-tight">
                        {session.user.name?.split(' ')[0]}
                      </p>
                      <p className="text-xs text-dawere-gray leading-tight">
                        {session.user.email}
                      </p>
                    </div>
                    <ChevronDown size={14} className="text-dawere-gray hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-modal border border-gray-100 z-20 animate-fadeIn">
                        <div className="p-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-dawere-dark">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-dawere-gray mt-0.5">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut size={15} />
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-dawere-gray-light text-dawere-dark-light"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white pb-3 animate-fadeIn">
            <div className="page-container pt-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = router.pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-dawere-teal-50 text-dawere-teal'
                        : 'text-dawere-dark-light hover:bg-dawere-gray-light'
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}
