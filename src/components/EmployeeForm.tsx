import { useState, useEffect } from 'react'
import Modal from './Modal'
import { Employee } from '@/lib/airtable'
import { DEPARTMENTS } from '@/lib/utils'
import { Save, Loader2 } from 'lucide-react'

interface EmployeeFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Employee, 'id'>) => Promise<void>
  employee?: Employee | null
}

const emptyForm = {
  name: '',
  role: '',
  department: '',
  email: '',
  phone: '',
  photo: '',
  linkedin: '',
  manager: '',
  startDate: '',
}

export default function EmployeeForm({
  isOpen,
  onClose,
  onSave,
  employee,
}: EmployeeFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        role: employee.role || '',
        department: employee.department || '',
        email: employee.email || '',
        phone: employee.phone || '',
        photo: employee.photo || '',
        linkedin: employee.linkedin || '',
        manager: employee.manager || '',
        startDate: employee.startDate || '',
      })
    } else {
      setForm(emptyForm)
    }
    setError('')
  }, [employee, isOpen])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      setError('El nombre y el correo son obligatorios.')
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
      title={employee ? 'Editar Empleado' : 'Nuevo Empleado'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="sm:col-span-2">
            <label className="label">Nombre completo *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: María García"
              className="input"
              required
            />
          </div>

          {/* Cargo */}
          <div>
            <label className="label">Cargo *</label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Ej: Desarrollador Frontend"
              className="input"
            />
          </div>

          {/* Departamento */}
          <div>
            <label className="label">Departamento</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="select"
            >
              <option value="">Seleccionar...</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="label">Correo corporativo *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nombre@dawere.com"
              className="input"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="label">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+58 412 000 0000"
              className="input"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="label">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="input"
            />
          </div>

          {/* Manager */}
          <div>
            <label className="label">Gerente / Manager</label>
            <input
              type="text"
              name="manager"
              value={form.manager}
              onChange={handleChange}
              placeholder="Nombre del gerente"
              className="input"
            />
          </div>

          {/* Fecha de inicio */}
          <div>
            <label className="label">Fecha de inicio</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Foto URL */}
          <div className="sm:col-span-2">
            <label className="label">URL de foto (opcional)</label>
            <input
              type="url"
              name="photo"
              value={form.photo}
              onChange={handleChange}
              placeholder="https://..."
              className="input"
            />
            <p className="text-xs text-dawere-gray mt-1">
              La foto se puede cargar directamente en Airtable como adjunto.
            </p>
          </div>
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
              <><Save size={16} /> {employee ? 'Actualizar' : 'Crear Empleado'}</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
