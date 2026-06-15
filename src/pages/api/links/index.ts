import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getLinks, createLink, Link } from '@/lib/airtable'

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
      const links = await getLinks()
      return res.status(200).json(links)
    } catch (error) {
      console.error('[API/links] GET error:', error)
      return res.status(500).json({ error: 'Error al obtener enlaces' })
    }
  }

  if (req.method === 'POST') {
    try {
      const data: Omit<Link, 'id'> = req.body
      const link = await createLink(data)
      return res.status(201).json(link)
    } catch (error) {
      console.error('[API/links] POST error:', error)
      return res.status(500).json({ error: 'Error al crear enlace' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
