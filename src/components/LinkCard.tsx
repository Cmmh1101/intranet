import { Link as LinkType } from '@/lib/airtable'
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  getDomainFromUrl,
  getFaviconUrl,
} from '@/lib/utils'
import { ExternalLink, Edit, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import Image from 'next/image'

interface LinkCardProps {
  link: LinkType
  onEdit?: (link: LinkType) => void
  onDelete?: (link: LinkType) => void
  isAdmin?: boolean
}

export default function LinkCard({ link, onEdit, onDelete, isAdmin }: LinkCardProps) {
  const categoryClass = CATEGORY_COLORS[link.category] || 'cat-default'
  const categoryLabel = CATEGORY_LABELS[link.category] || link.category
  const categoryIcon = CATEGORY_ICONS[link.category] || '🔗'
  const domain = getDomainFromUrl(link.url)
  const faviconUrl = getFaviconUrl(link.url)

  return (
    <div
      className={clsx(
        'card group transition-all duration-200',
        link.isActive
          ? 'hover:shadow-card-hover hover:-translate-y-0.5'
          : 'opacity-60'
      )}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Favicon */}
            <div className="w-8 h-8 rounded-lg bg-dawere-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
              {faviconUrl ? (
                <Image
                  src={faviconUrl}
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `<span class="text-sm">${categoryIcon}</span>`
                    }
                  }}
                />
              ) : (
                <span className="text-sm">{categoryIcon}</span>
              )}
            </div>

            {/* Title */}
            <div className="min-w-0">
              <h3 className="font-semibold text-dawere-dark text-sm leading-tight truncate">
                {link.name}
              </h3>
              <p className="text-xs text-dawere-gray truncate mt-0.5">{domain}</p>
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {onEdit && (
                <button
                  onClick={(e) => { e.preventDefault(); onEdit(link) }}
                  className="p-1.5 rounded-lg hover:bg-dawere-teal-50 text-dawere-teal transition-colors"
                  title="Editar"
                >
                  <Edit size={13} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => { e.preventDefault(); onDelete(link) }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {link.description && (
          <p className="text-xs text-dawere-dark-light leading-relaxed mb-3 line-clamp-2">
            {link.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            <span className={clsx('badge text-xs', categoryClass)}>
              {categoryIcon} {categoryLabel}
            </span>
            {!link.isActive && (
              <span className="badge badge-red">Inactivo</span>
            )}
          </div>

          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200',
              link.isActive
                ? 'text-dawere-teal hover:bg-dawere-teal hover:text-white'
                : 'text-dawere-gray cursor-not-allowed pointer-events-none'
            )}
          >
            <ExternalLink size={12} />
            Abrir
          </a>
        </div>
      </div>
    </div>
  )
}
