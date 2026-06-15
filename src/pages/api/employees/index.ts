import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getEmployees, createEmployee, Employee } from '@/lib/airtable'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  if (req.method === 'GET') {
    try {
      const employees = await getEmployees()
      return res.status(200).json(employees)
    } catch (error) {
      console.error('[API/employees] GET error:', error)
      return res.status(500).json({ error: 'Error al obtener empleados' })
    }
  }

  if (req.method === 'POST') {
    try {
      const data: Omit<Employee, 'id'> = req.body
      const employee = await createEmployee(data)
      return res.status(201).json(employee)
    } catch (error) {
      console.error('[API/employees] POST error:', error)
      return res.status(500).json({ error: 'Error al crear empleado' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
