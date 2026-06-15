import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import { getEmployees, getLinks } from '@/lib/airtable'
import Layout from '@/components/Layout'
import Link from 'next/link'
import {
  Users,
  Link2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/utils'

interface DashboardProps {
  stats: {
    totalEmployees: number
    totalLinks: number
    activeLinks: number
    departments: string[]
  }
  recentLinks: Array<{
    id: string
    name: string
    url: string
    category: string
  }>
  userName: string
}

export default function Dashboard({ stats, recentLinks, userName }: DashboardProps) {
  const firstName = userName?.split(' ')[0] || 'compañero'

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const statCards = [
    {
      label: 'Empleados',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-dawere-teal-50 text-dawere-teal',
      href: '/employees',
    },
    {
      label: 'Departamentos',
      value: stats.departments.length,
      icon: TrendingUp,
      color: 'bg-dawere-orange-50 text-dawere-orange',
      href: '/employees',
    },
    {
      label: 'Total de enlaces',
      value: stats.totalLinks,
      icon: Link2,
      color: 'bg-blue-50 text-blue-600',
      href: '/links',
    },
    {
      label: 'Enlaces activos',
      value: stats.activeLinks,
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600',
      href: '/links',
    },
  ]

  return (
    <Layout title="Inicio">
      {/* Welcome Banner */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-dawere-teal to-dawere-teal-light text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="150" cy="50" r="80" fill="white"/>
            <circle cx="50" cy="150" r="60" fill="white"/>
          </svg>
        </div>
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium">{greeting()},</p>
          <h1 className="text-2xl font-bold mt-0.5">{firstName} 👋</h1>
          <p className="text-white/80 text-sm mt-1">
            Bienvenido al portal interno de Dawere. Aquí encontrarás todo lo que necesitas.
          </p>
          <div className="flex gap-3 mt-4">
            <Link
              href="/links"
              className="inline-flex items-center gap-2 bg-white text-dawere-teal text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-all duration-200"
            >
              <Link2 size={14} />
              Ver enlaces
            </Link>
            <Link
              href="/employees"
              className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200"
            >
              <Users size={14} />
              Ver equipo
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href} className="card-hover p-5 block group">
              <div className={`inline-flex p-2.5 rounded-xl ${stat.color} mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-dawere-dark">{stat.value}</p>
              <p className="text-sm text-dawere-gray mt-0.5">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Links */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Accesos rápidos</h2>
              <p className="section-subtitle">Los últimos enlaces disponibles</p>
            </div>
            <Link href="/links" className="btn-ghost text-xs">
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentLinks.length === 0 && (
              <p className="text-sm text-dawere-gray text-center py-6">
                No hay enlaces disponibles aún.
              </p>
            )}
            {recentLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-dawere-gray-50 transition-all duration-200 group/link"
              >
                <div className="w-9 h-9 rounded-lg bg-dawere-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-base">
                  {CATEGORY_ICONS[link.category as keyof typeof CATEGORY_ICONS] || '🔗'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dawere-dark truncate group-hover/link:text-dawere-teal">
                    {link.name}
                  </p>
                  <p className="text-xs text-dawere-gray truncate">
                    {CATEGORY_LABELS[link.category as keyof typeof CATEGORY_LABELS] || link.category}
                  </p>
                </div>
                <ArrowRight size={14} className="text-dawere-gray opacity-0 group-hover/link:opacity-100 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="section-title">Departamentos</h2>
            <p className="section-subtitle">{stats.departments.length} equipos activos</p>
          </div>
          <div className="space-y-2">
            {stats.departments.length === 0 && (
              <p className="text-sm text-dawere-gray text-center py-6">
                Sin departamentos aún.
              </p>
            )}
            {stats.departments.map((dept, index) => (
              <Link
                key={dept}
                href={`/employees?department=${encodeURIComponent(dept)}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-dawere-gray-50 transition-colors group/dept"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full bg-dawere-teal"
                    style={{ opacity: 1 - index * 0.06 }}
                  />
                  <span className="text-sm text-dawere-dark group-hover/dept:text-dawere-teal transition-colors">
                    {dept}
                  </span>
                </div>
                <ArrowRight size={13} className="text-dawere-gray opacity-0 group-hover/dept:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  try {
    const [employees, links] = await Promise.all([
      getEmployees(),
      getLinks(),
    ])

    const departments = [...new Set(employees.map((e) => e.department).filter(Boolean))]
    const activeLinks = links.filter((l) => l.isActive)

    return {
      props: {
        stats: {
          totalEmployees: employees.length,
          totalLinks: links.length,
          activeLinks: activeLinks.length,
          departments,
        },
        recentLinks: activeLinks.slice(0, 8).map((l) => ({
          id: l.id,
          name: l.name,
          url: l.url,
          category: l.category,
        })),
        userName: session.user?.name || '',
      },
    }
  } catch (error) {
    console.error('[Dashboard] Error fetching data:', error)
    return {
      props: {
        stats: { totalEmployees: 0, totalLinks: 0, activeLinks: 0, departments: [] },
        recentLinks: [],
        userName: session.user?.name || '',
      },
    }
  }
}
