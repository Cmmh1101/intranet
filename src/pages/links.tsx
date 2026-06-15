import { useState, useEffect, useCallback } from 'react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import { Link as LinkType, LinkCategory } from '@/lib/airtable'
import Layout from '@/components/Layout'
import LinkCard from '@/components/LinkCard'
import LinkForm from '@/components/LinkForm'
import ConfirmDelete from '@/components/ConfirmDelete'
import {
  Search,
  Plus,
  Link2,
  Filter,
  RefreshCw,
  LayoutGrid,
  List,
  X,
} from 'lucide-react'
import { LINK_CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/utils'
import clsx from 'clsx'

interface LinksPageProps {
  isAdmin: boolean
}

export default function LinksPage({ isAdmin }: LinksPageProps) {
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<LinkCategory | 'all'>('all')
  const [showInactive, setShowInactive] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Modal states
  const [formOpen, setFormOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkType | null>(null)
  const [deletingLink, setDeletingLink] = useState<LinkType | null>(null)

  const fetchLinks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/links')
      const data = await res.json()
      setLinks(Array.isArray(data) ? data : [])
    } catch {
      console.error('Error loading links')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  // Filter logic
  const filtered = links.filter((link) => {
    const matchSearch =
      search === '' ||
      link.name.toLowerCase().includes(search.toLowerCase()) ||
      link.description?.toLowerCase().includes(search.toLowerCase()) ||
      link.url.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      selectedCategory === 'all' || link.category === selectedCategory
    const matchActive = showInactive || link.isActive
    return matchSearch && matchCategory && matchActive
  })

  // Group by category
  const grouped = LINK_CATEGORIES.reduce((acc, cat) => {
    const catLinks = filtered.filter((l) => l.category === cat)
    if (catLinks.length > 0) acc[cat] = catLinks
    return acc
  }, {} as Record<string, LinkType[]>)

  const handleSave = async (data: Omit<LinkType, 'id'>) => {
    if (editingLink) {
      await fetch(`/api/links/${editingLink.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } else {
      await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }
    await fetchLinks()
    setEditingLink(null)
  }

  const handleDelete = async () => {
    if (!deletingLink) return
    await fetch(`/api/links/${deletingLink.id}`, { method: 'DELETE' })
    await fetchLinks()
    setDeletingLink(null)
  }

  const openEdit = (link: LinkType) => {
    setEditingLink(link)
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditingLink(null)
    setFormOpen(true)
  }

  // Category counts
  const catCounts = links.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <Layout title="Enlaces">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title text-2xl">
            <Link2 size={24} className="inline mr-2 text-dawere-teal" />
            Directorio de enlaces
          </h1>
          <p className="section-subtitle">
            {links.length} enlace{links.length !== 1 ? 's' : ''} registrado{links.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLinks}
            className="btn-ghost"
            title="Actualizar"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          {isAdmin && (
            <button onClick={openCreate} className="btn-primary">
              <Plus size={16} />
              Nuevo enlace
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dawere-gray" />
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dawere-gray hover:text-dawere-dark"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dawere-gray pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="select pl-8 pr-10 w-full sm:w-auto"
            >
              <option value="all">Todas las categorías</option>
              {LINK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]} ({catCounts[cat] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2.5 transition-colors',
                viewMode === 'grid'
                  ? 'bg-dawere-teal text-white'
                  : 'text-dawere-gray hover:bg-dawere-gray-50'
              )}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2.5 transition-colors',
                viewMode === 'list'
                  ? 'bg-dawere-teal text-white'
                  : 'text-dawere-gray hover:bg-dawere-gray-50'
              )}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Show inactive toggle */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <input
            type="checkbox"
            id="showInactive"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-dawere-teal cursor-pointer"
          />
          <label htmlFor="showInactive" className="text-xs text-dawere-gray cursor-pointer">
            Mostrar enlaces inactivos
          </label>
          <span className="ml-auto text-xs text-dawere-gray">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-dawere-teal/20 border-t-dawere-teal rounded-full animate-spin mb-4" />
          <p className="text-sm text-dawere-gray">Cargando enlaces...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 card">
          <Link2 size={40} className="text-dawere-gray-light mx-auto mb-4" />
          <h3 className="font-semibold text-dawere-dark mb-1">Sin resultados</h3>
          <p className="text-sm text-dawere-gray">
            {search || selectedCategory !== 'all'
              ? 'No hay enlaces que coincidan con tu búsqueda.'
              : 'Aún no hay enlaces registrados.'}
          </p>
          {isAdmin && (
            <button onClick={openCreate} className="btn-primary mt-4 mx-auto">
              <Plus size={16} /> Agregar enlace
            </button>
          )}
        </div>
      ) : selectedCategory !== 'all' ? (
        // Flat list when category selected
        <div
          className={clsx(
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'
          )}
        >
          {filtered.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={isAdmin ? openEdit : undefined}
              onDelete={isAdmin ? setDeletingLink : undefined}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        // Grouped by category
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, catLinks]) => (
            <section key={cat}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{CATEGORY_ICONS[cat as LinkCategory]}</span>
                <h2 className="font-bold text-dawere-dark">
                  {CATEGORY_LABELS[cat as LinkCategory] || cat}
                </h2>
                <span className="badge badge-gray">{catLinks.length}</span>
              </div>
              <div
                className={clsx(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-3'
                )}
              >
                {catLinks.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onEdit={isAdmin ? openEdit : undefined}
                    onDelete={isAdmin ? setDeletingLink : undefined}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Link Form Modal */}
      <LinkForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingLink(null) }}
        onSave={handleSave}
        link={editingLink}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDelete
        isOpen={!!deletingLink}
        onClose={() => setDeletingLink(null)}
        onConfirm={handleDelete}
        title={`¿Eliminar "${deletingLink?.name}"?`}
        description="Esta acción eliminará el enlace permanentemente de Airtable. No se puede deshacer."
      />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  // Admin check: Only @dawere.com emails are admitted
  // You can extend this to check a specific list or Airtable field
  const isAdmin = true // All authenticated users can manage links in this version

  return { props: { isAdmin } }
}
