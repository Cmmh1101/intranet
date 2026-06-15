import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Head from 'next/head'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title }: LayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dawere-gray-50">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-dawere-teal/20 border-t-dawere-teal rounded-full animate-spin mb-4" />
          <p className="text-sm text-dawere-gray">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <>
      <Head>
        <title>{title ? `${title} — Dawere Intranet` : 'Dawere Intranet'}</title>
      </Head>
      <div className="min-h-screen bg-dawere-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 page-container py-8">
          {children}
        </main>
        <footer className="border-t border-gray-100 bg-white py-4">
          <div className="page-container text-center text-xs text-dawere-gray">
            © {new Date().getFullYear()} Dawere — Portal Interno. Uso exclusivo de empleados.
          </div>
        </footer>
      </div>
    </>
  )
}
