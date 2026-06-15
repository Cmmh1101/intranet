import { useState, useEffect } from 'react'
import Modal from './Modal'
import { Link as LinkType, LinkCategory } from '@/lib/airtable'
import { LINK_CATEGORIES, CATEGORY_LABELS } from '@/lib/utils'
import { Save, Loader2 } from 'lucide-react'

interface LinkFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<LinkType, 'id'>) => Promise<void>
  link?: LinkType | null
}

const emptyForm = {
  name: '',
  url: '',
  description: '',
  category: 'Other' as LinkCategory,
  ownerEmployee: '',
  isActive: true,
}

export default function LinkForm({
  isOpen,
  onClose,
  onSave,
  link,
}: LinkFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (link) {
      setForm({
        name: link.name || '',
        url: link.url || '',
        description: link.description || '',
        category: link.category || 'Other',
        ownerEmployee: link.ownerEmployee || '',
        isActive: link.isActive !== false,
      })
    } else {
      setForm(emptyForm)
    }
    setError('')
  }, [link, isOpen])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.url) {
      setError('El nombre y la URL son obligatorios.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch {
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={link ? 'Editar Enlace' : 'Nuevo Enlace'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="label">Nombre del enlace *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Slack, Jira, Google Drive..."
            className="input"
            required
          />
        </div>

        {/* URL */}
        <div>
          <label className="label">URL *</label>
          <input
            type="url"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="https://..."
            className="input"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="label">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Breve descripción del enlace..."
            className="input resize-none"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Categoría */}
          <div>
            <label className="label">Categoría</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="select"
            >
              {LINK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Responsable */}
          <div>
            <label className="label">Responsable</label>
            <input
              type="text"
              name="ownerEmployee"
              value={form.ownerEmployee}
              onChange={handleChange}
              placeholder="Nombre del responsable"
              className="input"
            />
          </div>
        </div>

        {/* Activo */}
        <div className="flex items-center gap-3 p-3 bg-dawere-gray-50 rounded-lg">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="w-4 h-4 rounded accent-dawere-teal cursor-pointer"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-dawere-dark cursor-pointer">
            Enlace activo (visible para todos)
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Guardando...</>
            ) : (
              <><Save size={16} /> {link ? 'Actualizar' : 'Crear Enlace'}</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
