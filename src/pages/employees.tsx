import { useState, useEffect, useCallback } from 'react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import { Employee } from '@/lib/airtable'
import Layout from '@/components/Layout'
import EmployeeCard from '@/components/EmployeeCard'
import EmployeeForm from '@/components/EmployeeForm'
import ConfirmDelete from '@/components/ConfirmDelete'
import {
  Search,
  Plus,
  Users,
  Filter,
  RefreshCw,
  Building2,
  X,
  LayoutGrid,
  List,
} from 'lucide-react'
import { DEPARTMENTS } from '@/lib/utils'
import clsx from 'clsx'

interface EmployeesPageProps {
  isAdmin: boolean
  defaultDepartment?: string
}

export default function EmployeesPage({
  isAdmin,
  defaultDepartment,
}: EmployeesPageProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState(defaultDepartment || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Modal states
  const [formOpen, setFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/employees')
      const data = await res.json()
      setEmployees(Array.isArray(data) ? data : [])
    } catch {
      console.error('Error loading employees')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // Filter logic
  const filtered = employees.filter((emp) => {
    const matchSearch =
      search === '' ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
    const matchDept = selectedDept === '' || emp.department === selectedDept
    return matchSearch && matchDept
  })

  // Group by department when not searching
  const grouped =
    search === '' && selectedDept === ''
      ? filtered.reduce((acc, emp) => {
          const dept = emp.department || 'Sin departamento'
          if (!acc[dept]) acc[dept] = []
          acc[dept].push(emp)
          return acc
        }, {} as Record<string, Employee[]>)
      : null

  const handleSave = async (data: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      await fetch(`/api/employees/${editingEmployee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } else {
      await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }
    await fetchEmployees()
    setEditingEmployee(null)
  }

  const handleDelete = async () => {
    if (!deletingEmployee) return
    await fetch(`/api/employees/${deletingEmployee.id}`, { method: 'DELETE' })
    await fetchEmployees()
    setDeletingEmployee(null)
  }

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp)
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditingEmployee(null)
    setFormOpen(true)
  }

  // Department counts
  const deptCounts = employees.reduce((acc, emp) => {
    const d = emp.department || 'Sin departamento'
    acc[d] = (acc[d] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const uniqueDepts = [...new Set(employees.map((e) => e.department).filter(Boolean))]

  const renderGrid = (emps: Employee[]) => (
    <div
      className={clsx(
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-3'
      )}
    >
      {emps.map((emp) => (
        <EmployeeCard
          key={emp.id}
          employee={emp}
          onEdit={isAdmin ? openEdit : undefined}
          onDelete={isAdmin ? setDeletingEmployee : undefined}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  )

  return (
    <Layout title="Equipo">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title text-2xl">
            <Users size={24} className="inline mr-2 text-dawere-teal" />
            Directorio de empleados
          </h1>
          <p className="section-subtitle">
            {employees.length} empleado{employees.length !== 1 ? 's' : ''} en {uniqueDepts.length} departamento{uniqueDepts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchEmployees} className="btn-ghost" title="Actualizar">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          {/* {isAdmin && (
            <button onClick={openCreate} className="btn-primary">
              <Plus size={16} />
              Nuevo empleado
            </button>
          )} */}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dawere-gray" />
            <input
              type="text"
              placeholder="Buscar por nombre, cargo o correo..."
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

          <div className="relative">
            <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dawere-gray pointer-events-none" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="select pl-8 w-full sm:w-auto"
            >
              <option value="">Todos los departamentos</option>
              {uniqueDepts.sort().map((dept) => (
                <option key={dept} value={dept}>
                  {dept} ({deptCounts[dept] || 0})
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

        <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-dawere-gray">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-dawere-teal/20 border-t-dawere-teal rounded-full animate-spin mb-4" />
          <p className="text-sm text-dawere-gray">Cargando equipo...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 card">
          <Users size={40} className="text-dawere-gray-light mx-auto mb-4" />
          <h3 className="font-semibold text-dawere-dark mb-1">Sin resultados</h3>
          <p className="text-sm text-dawere-gray">
            {search || selectedDept
              ? 'No hay empleados que coincidan con tu búsqueda.'
              : 'Aún no hay empleados registrados.'}
          </p>
          {isAdmin && (
            <button onClick={openCreate} className="btn-primary mt-4 mx-auto">
              <Plus size={16} /> Agregar empleado
            </button>
          )}
        </div>
      ) : grouped ? (
        // Grouped by department
        <div className="space-y-8">
          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dept, deptEmps]) => (
              <section key={dept}>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 size={18} className="text-dawere-teal" />
                  <h2 className="font-bold text-dawere-dark">{dept}</h2>
                  <span className="badge badge-teal">{deptEmps.length}</span>
                </div>
                {renderGrid(deptEmps)}
              </section>
            ))}
        </div>
      ) : (
        renderGrid(filtered)
      )}

      {/* Employee Form Modal */}
      <EmployeeForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingEmployee(null) }}
        onSave={handleSave}
        employee={editingEmployee}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDelete
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDelete}
        title={`¿Eliminar a "${deletingEmployee?.name}"?`}
        description="Esta acción eliminará el empleado permanentemente de Airtable. No se puede deshacer."
      />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  const isAdmin = true // All authenticated Dawere employees can manage
  const defaultDepartment = (context.query.department as string) || ''

  return { props: { isAdmin, defaultDepartment } }
}
