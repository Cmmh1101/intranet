import { Employee } from '@/lib/airtable'
import { getInitials, formatDate, calculateTenure } from '@/lib/utils'
import Image from 'next/image'
import {
  Mail,
  Phone,
  Linkedin,
  Calendar,
  Building2,
  UserCircle2,
  Edit,
  Trash2,
} from 'lucide-react'
import clsx from 'clsx'

interface EmployeeCardProps {
  employee: Employee
  onEdit?: (employee: Employee) => void
  onDelete?: (employee: Employee) => void
  isAdmin?: boolean
}

export default function EmployeeCard({
  employee,
  onEdit,
  onDelete,
  isAdmin,
}: EmployeeCardProps) {
  const initials = getInitials(employee.name)
  const tenure = calculateTenure(employee.startDate)

  return (
    <div className="card group animate-fadeIn">
      {/* Top bar accent */}
      <div className="h-1.5 bg-gradient-to-r from-dawere-teal to-dawere-teal-light" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              {employee.photo ? (
                <Image
                  src={employee.photo}
                  alt={employee.name}
                  width={56}
                  height={56}
                  className="rounded-xl object-cover w-14 h-14"
                  onError={(e) => {
                    // Fallback to initials if image fails
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-dawere-teal flex items-center justify-center text-white font-bold text-lg">
                  {initials}
                </div>
              )}
            </div>

            {/* Name & Role */}
            <div>
              <h3 className="font-semibold text-dawere-dark text-base leading-tight">
                {employee.name}
              </h3>
              <p className="text-sm text-dawere-orange font-medium mt-0.5">
                {employee.role}
              </p>
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={() => onEdit(employee)}
                  className="p-1.5 rounded-lg hover:bg-dawere-teal-50 text-dawere-teal transition-colors"
                  title="Editar"
                >
                  <Edit size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(employee)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Department Badge */}
        {employee.department && (
          <div className="flex items-center gap-1.5 mb-3">
            <Building2 size={13} className="text-dawere-gray" />
            <span className="text-xs font-medium text-dawere-dark-light">
              {employee.department}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 my-3" />

        {/* Contact Info */}
        <div className="space-y-2">
          {employee.email && (
            <a
              href={`mailto:${employee.email}`}
              className="flex items-center gap-2 text-xs text-dawere-dark-light hover:text-dawere-teal transition-colors group/link"
            >
              <Mail size={13} className="text-dawere-gray group-hover/link:text-dawere-teal" />
              <span className="truncate">{employee.email}</span>
            </a>
          )}
          {employee.phone && (
            <a
              href={`tel:${employee.phone}`}
              className="flex items-center gap-2 text-xs text-dawere-dark-light hover:text-dawere-teal transition-colors group/link"
            >
              <Phone size={13} className="text-dawere-gray group-hover/link:text-dawere-teal" />
              <span>{employee.phone}</span>
            </a>
          )}
          {employee.linkedin && (
            <a
              href={employee.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-dawere-dark-light hover:text-blue-600 transition-colors group/link"
            >
              <Linkedin size={13} className="text-dawere-gray group-hover/link:text-blue-600" />
              <span>LinkedIn</span>
            </a>
          )}
          {employee.manager && (
            <div className="flex items-center gap-2 text-xs text-dawere-dark-light">
              <UserCircle2 size={13} className="text-dawere-gray" />
              <span>Manager: {employee.manager}</span>
            </div>
          )}
          {employee.startDate && (
            <div className="flex items-center gap-2 text-xs text-dawere-dark-light">
              <Calendar size={13} className="text-dawere-gray" />
              <span>
                {formatDate(employee.startDate)}
                {tenure && (
                  <span className="ml-1 text-dawere-teal font-medium">({tenure})</span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
