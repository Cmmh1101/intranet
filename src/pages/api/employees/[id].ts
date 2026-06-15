import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getEmployeeById, updateEmployee, deleteEmployee } from '@/lib/airtable'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' })
  }

  if (req.method === 'GET') {
    try {
      const employee = await getEmployeeById(id)
      if (!employee) return res.status(404).json({ error: 'Empleado no encontrado' })
      return res.status(200).json(employee)
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener empleado' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const updated = await updateEmployee(id, req.body)
      return res.status(200).json(updated)
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar empleado' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteEmployee(id)
      return res.status(204).end()
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar empleado' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
