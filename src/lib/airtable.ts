/**
 * Airtable Service Layer
 * All Airtable interactions go through this module
 */

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!
const AIRTABLE_PAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN!
const EMPLOYEES_TABLE = process.env.AIRTABLE_EMPLOYEES_TABLE || 'Empleados'
const LINKS_TABLE = process.env.AIRTABLE_LINKS_TABLE || 'Enlaces'

// ========================
//   TYPES
// ========================

export interface Employee {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone?: string
  photo?: string
  linkedin?: string
  manager?: string
  startDate?: string
}

export interface Link {
  id: string
  name: string
  url: string
  description?: string
  category: LinkCategory
  ownerEmployee?: string
  isActive: boolean
}

export type LinkCategory =
  | 'HR Tools'
  | 'Dev Tools'
  | 'Marketing'
  | 'External Partners'
  | 'Sales Tools'
  | 'Search Engine'
  | 'Reference'
  | 'Email'
  | 'Social Media'
  | 'Other'

export interface AirtableRecord<T> {
  id: string
  fields: T
  createdTime: string
}

// ========================
//   AIRTABLE FETCH HELPER
// ========================

async function airtableFetch(
  endpoint: string,
  options?: RequestInit
): Promise<any> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${endpoint}`

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error(`[Airtable] Error ${res.status}: ${errorText}`)
    throw new Error(`Airtable API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

// ========================
//   EMPLOYEES
// ========================

export async function getEmployees(): Promise<Employee[]> {
  const tableName = encodeURIComponent(EMPLOYEES_TABLE)
  const data = await airtableFetch(
    `${tableName}?sort%5B0%5D%5Bfield%5D=Nombre&sort%5B0%5D%5Bdirection%5D=asc`
  )

  return (data.records || []).map((record: AirtableRecord<any>) => ({
    id: record.id,
    name: record.fields['Nombre'] || '',
    role: record.fields['Cargo'] || '',
    department: record.fields['Departamento'] || '',
    email: record.fields['Email'] || '',
    phone: record.fields['Telefono'] || '',
    photo: record.fields['Foto']?.[0]?.url || '',
    linkedin: record.fields['LinkedIn'] || '',
    manager: record.fields['Gerente'] || '',
    startDate: record.fields['Fecha de Inicio'] || '',
  }))
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    const tableName = encodeURIComponent(EMPLOYEES_TABLE)
    const record = await airtableFetch(`${tableName}/${id}`)
    return {
      id: record.id,
      name: record.fields['Nombre'] || '',
      role: record.fields['Cargo'] || '',
      department: record.fields['Departamento'] || '',
      email: record.fields['Email'] || '',
      phone: record.fields['Telefono'] || '',
      photo: record.fields['Foto']?.[0]?.url || '',
      linkedin: record.fields['LinkedIn'] || '',
      manager: record.fields['Gerente'] || '',
      startDate: record.fields['Fecha de Inicio'] || '',
    }
  } catch {
    return null
  }
}

export async function createEmployee(data: Omit<Employee, 'id'>): Promise<Employee> {
  const tableName = encodeURIComponent(EMPLOYEES_TABLE)
  const record = await airtableFetch(tableName, {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        Nombre: data.name,
        Cargo: data.role,
        Departamento: data.department,
        Email: data.email,
        Telefono: data.phone,
        LinkedIn: data.linkedin,
        Gerente: data.manager,
        'Fecha de Inicio': data.startDate,
      },
    }),
  })

  return {
    id: record.id,
    name: record.fields['Nombre'] || '',
    role: record.fields['Cargo'] || '',
    department: record.fields['Departamento'] || '',
    email: record.fields['Email'] || '',
    phone: record.fields['Telefono'] || '',
    photo: record.fields['Foto']?.[0]?.url || '',
    linkedin: record.fields['LinkedIn'] || '',
    manager: record.fields['Gerente'] || '',
    startDate: record.fields['Fecha de Inicio'] || '',
  }
}

export async function updateEmployee(id: string, data: Partial<Omit<Employee, 'id'>>): Promise<Employee> {
  const tableName = encodeURIComponent(EMPLOYEES_TABLE)
  const fields: Record<string, any> = {}
  if (data.name !== undefined) fields['Nombre'] = data.name
  if (data.role !== undefined) fields['Cargo'] = data.role
  if (data.department !== undefined) fields['Departamento'] = data.department
  if (data.email !== undefined) fields['Email'] = data.email
  if (data.phone !== undefined) fields['Telefono'] = data.phone
  if (data.linkedin !== undefined) fields['LinkedIn'] = data.linkedin
  if (data.manager !== undefined) fields['Gerente'] = data.manager
  if (data.startDate !== undefined) fields['Fecha de Inicio'] = data.startDate

  const record = await airtableFetch(`${tableName}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  })

  return {
    id: record.id,
    name: record.fields['Nombre'] || '',
    role: record.fields['Cargo'] || '',
    department: record.fields['Departamento'] || '',
    email: record.fields['Email'] || '',
    phone: record.fields['Telefono'] || '',
    photo: record.fields['Foto']?.[0]?.url || '',
    linkedin: record.fields['LinkedIn'] || '',
    manager: record.fields['Gerente'] || '',
    startDate: record.fields['Fecha de Inicio'] || '',
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  const tableName = encodeURIComponent(EMPLOYEES_TABLE)
  await airtableFetch(`${tableName}/${id}`, { method: 'DELETE' })
}

// ========================
//   LINKS
// ========================

export async function getLinks(): Promise<Link[]> {
  const tableName = encodeURIComponent(LINKS_TABLE)
  const data = await airtableFetch(
    `${tableName}?sort%5B0%5D%5Bfield%5D=Nombre&sort%5B0%5D%5Bdirection%5D=asc`
  )

  return (data.records || []).map((record: AirtableRecord<any>) => ({
    id: record.id,
    name: record.fields['Nombre'] || '',
    url: record.fields['URL'] || '',
    description: record.fields['Descripcion'] || '',
    category: record.fields['Categoria'] || 'Other',
    ownerEmployee: record.fields['Responsable'] || '',
    isActive: record.fields['Activo'] !== false,
  }))
}

export async function createLink(data: Omit<Link, 'id'>): Promise<Link> {
  const tableName = encodeURIComponent(LINKS_TABLE)
  const record = await airtableFetch(tableName, {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        Nombre: data.name,
        URL: data.url,
        Descripcion: data.description,
        Categoria: data.category,
        Responsable: data.ownerEmployee,
        Activo: data.isActive,
      },
    }),
  })

  return {
    id: record.id,
    name: record.fields['Nombre'] || '',
    url: record.fields['URL'] || '',
    description: record.fields['Descripcion'] || '',
    category: record.fields['Categoria'] || 'Other',
    ownerEmployee: record.fields['Responsable'] || '',
    isActive: record.fields['Activo'] !== false,
  }
}

export async function updateLink(id: string, data: Partial<Omit<Link, 'id'>>): Promise<Link> {
  const tableName = encodeURIComponent(LINKS_TABLE)
  const fields: Record<string, any> = {}
  if (data.name !== undefined) fields['Nombre'] = data.name
  if (data.url !== undefined) fields['URL'] = data.url
  if (data.description !== undefined) fields['Descripcion'] = data.description
  if (data.category !== undefined) fields['Categoria'] = data.category
  if (data.ownerEmployee !== undefined) fields['Responsable'] = data.ownerEmployee
  if (data.isActive !== undefined) fields['Activo'] = data.isActive

  const record = await airtableFetch(`${tableName}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  })

  return {
    id: record.id,
    name: record.fields['Nombre'] || '',
    url: record.fields['URL'] || '',
    description: record.fields['Descripcion'] || '',
    category: record.fields['Categoria'] || 'Other',
    ownerEmployee: record.fields['Responsable'] || '',
    isActive: record.fields['Activo'] !== false,
  }
}

export async function deleteLink(id: string): Promise<void> {
  const tableName = encodeURIComponent(LINKS_TABLE)
  await airtableFetch(`${tableName}/${id}`, { method: 'DELETE' })
}
