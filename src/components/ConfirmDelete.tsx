import Modal from './Modal'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ConfirmDeleteProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title: string
  description: string
}

export default function ConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: ConfirmDeleteProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar eliminación" size="sm">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="font-semibold text-dawere-dark text-base mb-2">{title}</h3>
        <p className="text-sm text-dawere-gray mb-6 leading-relaxed">{description}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="btn-danger flex-1"
          >
            <Trash2 size={15} />
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
