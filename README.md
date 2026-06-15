# 🏢 Dawere Intranet

Portal interno corporativo para el equipo de **Dawere**. Centraliza todos los enlaces importantes y el directorio de empleados en un solo lugar seguro, con acceso exclusivo para cuentas `@dawere.com`.

---

## 📋 Tabla de contenidos

- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Configuración inicial](#configuración-inicial)
  - [1. Clonar e instalar dependencias](#1-clonar-e-instalar-dependencias)
  - [2. Configurar Google OAuth](#2-configurar-google-oauth)
  - [3. Configurar Airtable](#3-configurar-airtable)
  - [4. Variables de entorno](#4-variables-de-entorno)
  - [5. Ejecutar en desarrollo](#5-ejecutar-en-desarrollo)
- [Estructura de Airtable](#estructura-de-airtable)
- [Despliegue en Netlify](#despliegue-en-netlify)
- [Seguridad](#seguridad)
- [Páginas y rutas](#páginas-y-rutas)

---

## ✨ Características

### Implementadas ✅
- **🔐 Autenticación segura** con Google Workspace OAuth — solo `@dawere.com`
- **📂 Directorio de enlaces** con búsqueda, filtros por categoría y vista grid/lista
- **👥 Directorio de empleados** agrupados por departamento con búsqueda
- **➕ CRUD completo** — crear, editar y eliminar tanto enlaces como empleados
- **📱 Diseño responsive** y totalmente adaptado a mobile
- **🎨 Branding Dawere** — colores corporativos teal `#1D6B69` y naranja `#E8821E`
- **⚡ Integración Airtable** en tiempo real como base de datos
- **🔒 Rutas protegidas** — todas las páginas requieren sesión activa
- **💅 UI moderna** con animaciones suaves y componentes accesibles
- **🚀 Listo para Netlify** con `@netlify/plugin-nextjs`

### Funcionalidades por módulo

| Módulo | Descripción |
|--------|-------------|
| **Login** | Pantalla de bienvenida con OAuth Google, validación de dominio |
| **Dashboard** | Estadísticas rápidas, accesos directos y lista de departamentos |
| **Enlaces** | Directorio con categorías, búsqueda, favicon automático, CRUD |
| **Empleados** | Tarjetas con foto, cargo, contacto, LinkedIn, antigüedad, CRUD |

---

## 🛠 Stack tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 14.2.5 | Framework React con SSR/SSG |
| **TypeScript** | 5.x | Tipado estático |
| **NextAuth.js** | 4.x | Autenticación OAuth |
| **Tailwind CSS** | 3.x | Estilos utilitarios |
| **Airtable API** | REST | Base de datos |
| **Lucide React** | 0.4x | Iconografía |

---

## 📁 Estructura del proyecto

```
dawere-intranet/
├── src/
│   ├── pages/
│   │   ├── _app.tsx              # App root con SessionProvider
│   │   ├── _document.tsx         # HTML document
│   │   ├── index.tsx             # Redirect a dashboard o login
│   │   ├── login.tsx             # Pantalla de inicio de sesión
│   │   ├── dashboard.tsx         # Página principal con estadísticas
│   │   ├── links.tsx             # Directorio de enlaces
│   │   ├── employees.tsx         # Directorio de empleados
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth].ts   # Google OAuth handler
│   │       ├── employees/
│   │       │   ├── index.ts      # GET todos / POST crear
│   │       │   └── [id].ts       # GET uno / PATCH / DELETE
│   │       └── links/
│   │           ├── index.ts      # GET todos / POST crear
│   │           └── [id].ts       # PATCH / DELETE
│   ├── components/
│   │   ├── Layout.tsx            # Layout principal con navbar
│   │   ├── Navbar.tsx            # Barra de navegación
│   │   ├── EmployeeCard.tsx      # Tarjeta de empleado
│   │   ├── LinkCard.tsx          # Tarjeta de enlace
│   │   ├── EmployeeForm.tsx      # Modal formulario empleado
│   │   ├── LinkForm.tsx          # Modal formulario enlace
│   │   ├── Modal.tsx             # Componente modal base
│   │   └── ConfirmDelete.tsx     # Modal confirmación eliminación
│   ├── lib/
│   │   ├── airtable.ts           # Servicio Airtable (CRUD)
│   │   └── utils.ts              # Helpers: fechas, categorías, etc.
│   ├── types/
│   │   └── next-auth.d.ts        # Tipos extendidos de NextAuth
│   └── styles/
│       └── globals.css           # Estilos globales + Tailwind
├── netlify.toml                  # Configuración Netlify
├── next.config.js                # Configuración Next.js
├── tailwind.config.js            # Configuración Tailwind
├── tsconfig.json                 # Configuración TypeScript
├── .env.example                  # Plantilla de variables de entorno
└── package.json
```

---

## ⚙️ Configuración inicial

### 1. Clonar e instalar dependencias

```bash
# Clonar el repositorio
git clone <tu-repo-url>
cd dawere-intranet

# Instalar dependencias
npm install
```

### 2. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo (o usa uno existente)
3. En **APIs & Services → OAuth consent screen**:
   - User Type: **Internal** (solo para tu organización Google Workspace)
   - Completa la información de la app
4. En **APIs & Services → Credentials → Create Credentials → OAuth Client ID**:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://tu-dominio.netlify.app`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://tu-dominio.netlify.app/api/auth/callback/google`
5. Copia el **Client ID** y **Client Secret**

### 3. Configurar Airtable

#### Base ID
Tu Base ID ya está configurado: `cVPstScheuVwJd`

#### Personal Access Token
1. Ve a [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Crea un token con los siguientes scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
3. Agrega el acceso a tu base `cVPstScheuVwJd`

#### Crear las tablas en Airtable

**Tabla: `Empleados`**

| Campo | Tipo Airtable | Notas |
|-------|---------------|-------|
| `Nombre` | Single line text | Nombre completo |
| `Cargo` | Single line text | Título del puesto |
| `Departamento` | Single select | Tecnología, RR.HH., etc. |
| `Email` | Email | Correo corporativo |
| `Telefono` | Phone number | Con código de país |
| `Foto` | Attachment | Foto de perfil |
| `LinkedIn` | URL | Perfil de LinkedIn |
| `Gerente` | Single line text | Nombre del gerente |
| `Fecha de Inicio` | Date | Fecha de incorporación |

**Tabla: `Enlaces`**

| Campo | Tipo Airtable | Notas |
|-------|---------------|-------|
| `Nombre` | Single line text | Nombre descriptivo |
| `URL` | URL | Enlace completo |
| `Descripcion` | Long text | Descripción breve |
| `Categoria` | Single select | HR Tools, Dev Tools, etc. |
| `Responsable` | Single line text | Nombre del responsable |
| `Activo` | Checkbox | Visible para empleados |

**Opciones para el campo `Categoria`:**
- HR Tools
- Dev Tools
- Marketing
- External Partners
- Sales Tools
- Search Engine
- Reference
- Email
- Social Media
- Other

### 4. Variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
# NextAuth
NEXTAUTH_SECRET=genera-con-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu-client-secret

# Dominio permitido
ALLOWED_EMAIL_DOMAIN=dawere.com

# Airtable
AIRTABLE_PERSONAL_ACCESS_TOKEN=pat_xxxxxx.yyyyyy
AIRTABLE_BASE_ID=cVPstScheuVwJd
AIRTABLE_EMPLOYEES_TABLE=Empleados
AIRTABLE_LINKS_TABLE=Enlaces
```

Para generar `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🚀 Despliegue en Netlify

### Opción A: Desde la interfaz de Netlify (Recomendado)

1. Push tu código a GitHub/GitLab
2. Ve a [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**
3. Conecta tu repositorio
4. Configuración de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. **Variables de entorno** — en Netlify → Site settings → Environment variables, agrega:

```
NEXTAUTH_SECRET          = <genera con openssl rand -base64 32>
NEXTAUTH_URL             = https://tu-sitio.netlify.app
GOOGLE_CLIENT_ID         = <tu google client id>
GOOGLE_CLIENT_SECRET     = <tu google client secret>
ALLOWED_EMAIL_DOMAIN     = dawere.com
AIRTABLE_PERSONAL_ACCESS_TOKEN = <tu PAT de airtable>
AIRTABLE_BASE_ID         = cVPstScheuVwJd
AIRTABLE_EMPLOYEES_TABLE = Empleados
AIRTABLE_LINKS_TABLE     = Enlaces
```

6. Instala el plugin de Netlify para Next.js:
   - En **Plugins** busca `@netlify/plugin-nextjs` e instálalo
   - O déjalo en `netlify.toml` (ya está configurado)

7. Click **Deploy site** 🎉

### Opción B: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar proyecto
netlify init

# Deploy
netlify deploy --prod
```

### Post-deploy

Una vez desplegado:
1. Actualiza las **Authorized redirect URIs** en Google Cloud Console con tu URL de Netlify
2. Actualiza `NEXTAUTH_URL` en Netlify con tu URL final

---

## 🔒 Seguridad

- **Autenticación**: Solo cuentas `@dawere.com` del Google Workspace corporativo pueden iniciar sesión
- **Validación de dominio**: Doble verificación en el callback OAuth (email domain + hosted domain)
- **Sesiones JWT**: Sesiones de 8 horas (jornada laboral), nunca persisten en base de datos
- **Rutas protegidas**: Todas las páginas verifican sesión tanto en cliente como servidor (`getServerSideProps`)
- **API protegida**: Todos los endpoints `/api/*` verifican sesión con `getServerSession`
- **Headers HTTP**: `X-Frame-Options`, `X-Content-Type-Options`, `CSP` configurados en Netlify
- **Secrets en env**: Nunca se incluyen credenciales en el código

---

## 📌 Páginas y rutas

| Ruta | Descripción | Auth |
|------|-------------|------|
| `/` | Redirección automática | — |
| `/login` | Pantalla de inicio de sesión | Pública |
| `/dashboard` | Panel principal con estadísticas | ✅ Requerida |
| `/links` | Directorio de enlaces | ✅ Requerida |
| `/employees` | Directorio de empleados | ✅ Requerida |
| `/api/auth/*` | Endpoints de NextAuth | — |
| `/api/employees` | GET lista, POST crear | ✅ Requerida |
| `/api/employees/[id]` | GET, PATCH, DELETE | ✅ Requerida |
| `/api/links` | GET lista, POST crear | ✅ Requerida |
| `/api/links/[id]` | PATCH, DELETE | ✅ Requerida |

---

## 🔮 Próximas mejoras sugeridas

- [ ] Sistema de roles (Admin, Editor, Viewer)
- [ ] Perfil personal editable por el empleado
- [ ] Notificaciones al agregar nuevos enlaces/empleados
- [ ] Búsqueda global unificada (links + empleados)
- [ ] Página de cumpleaños y aniversarios del equipo
- [ ] Export del directorio a PDF/Excel
- [ ] Organigrama interactivo

---

## 📞 Soporte

Para problemas técnicos, contacta al equipo de Tecnología en Slack o por correo interno.

---

*Construido con ❤️ para el equipo de Dawere*
