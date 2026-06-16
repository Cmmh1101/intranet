import { LinkCategory } from './airtable'

// ========================
//   CATEGORY HELPERS
// ========================

export const LINK_CATEGORIES: LinkCategory[] = [
  'HR Tools',
  'Dev Tools',
  'Marketing',
  'External Partners',
  'Sales Tools',
  'Search Engine',
  'Reference',
  'Email',
  'Social Media',
  'Productivity',
  'News',
  'Education',
  'Other',
]

export const CATEGORY_LABELS: Record<LinkCategory, string> = {
  'HR Tools': 'Recursos Humanos',
  'Dev Tools': 'Herramientas Dev',
  Marketing: 'Marketing',
  'External Partners': 'Socios Externos',
  'Sales Tools': 'Herramientas de Ventas',
  'Search Engine': 'Buscadores',
  Reference: 'Referencia',
  Email: 'Correo',
  'Social Media': 'Redes Sociales',
  Productivity: 'Productividad',
  News: 'Noticias',
  Education: 'Educación',
  Other: 'Otros',
}

export const CATEGORY_COLORS: Record<LinkCategory, string> = {
  'HR Tools': 'cat-hr',
  'Dev Tools': 'cat-dev',
  Marketing: 'cat-marketing',
  'External Partners': 'cat-external',
  'Sales Tools': 'cat-sales',
  'Search Engine': 'cat-search',
  Reference: 'cat-reference',
  Email: 'cat-email',
  'Social Media': 'cat-social',
  Productivity: 'cat-productivity',
  News: 'cat-news',
  Education: 'cat-education',
  Other: 'cat-default',
}

export const CATEGORY_ICONS: Record<LinkCategory, string> = {
  'HR Tools': '👥',
  'Dev Tools': '⚙️',
  Marketing: '📢',
  'External Partners': '🤝',
  'Sales Tools': '💰',
  'Search Engine': '🔍',
  Reference: '📚',
  Email: '✉️',
  'Social Media': '📱',
  Productivity: '✅',
  News: '📰',
  Education: '🎓',
  Other: '🔗',
}

// ========================
//   DEPARTMENT HELPERS
// ========================

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Administration',
]

// Optional Spanish labels for UI display
export const DEPARTMENT_LABELS: Record<string, string> = {
  Engineering: 'Ingeniería',
  Product: 'Producto',
  Design: 'Diseño',
  'Human Resources': 'Recursos Humanos',
  Finance: 'Finanzas',
  Marketing: 'Marketing',
  Sales: 'Ventas',
  Administration: 'Administración',
}

// ========================
//   DATE HELPERS
// ========================

export function formatDate(dateString?: string): string {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

export function calculateTenure(startDate?: string): string {
  if (!startDate) return ''
  try {
    const start = new Date(startDate)
    const now = new Date()
    const months = Math.floor(
      (now.getFullYear() - start.getFullYear()) * 12 +
        (now.getMonth() - start.getMonth())
    )

    if (months < 1) return 'Recién incorporado'
    if (months < 12) return `${months} mes${months === 1 ? '' : 'es'}`

    const years = Math.floor(months / 12)
    const remainMonths = months % 12

    if (remainMonths === 0) return `${years} año${years === 1 ? '' : 's'}`

    return `${years} año${years === 1 ? '' : 's'} y ${remainMonths} mes${
      remainMonths === 1 ? '' : 'es'
    }`
  } catch {
    return ''
  }
}

// ========================
//   STRING HELPERS
// ========================

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).origin
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return ''
  }
}