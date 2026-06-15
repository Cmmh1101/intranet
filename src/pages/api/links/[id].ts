import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { updateLink, deleteLink } from '@/lib/airtable'

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

  if (req.method === 'PATCH') {
    try {
      const updated = await updateLink(id, req.body)
      return res.status(200).json(updated)
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar enlace' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteLink(id)
      return res.status(204).end()
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar enlace' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
