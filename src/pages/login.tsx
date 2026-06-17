import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import { signIn } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface LoginProps {
  error?: string
}

export default function LoginPage({ error }: LoginProps) {
  const router = useRouter()
  const queryError = router.query.error as string
  const [loading, setLoading] = useState(false)

  const errorMessages: Record<string, string> = {
    domain: 'Solo se permiten correos @dawere.com. Usa tu cuenta corporativa.',
    OAuthCallback: 'Error al conectar con Google. Intenta de nuevo.',
    OAuthSignin: 'Error al iniciar sesión con Google.',
    Callback: 'Error en la autenticación. Contacta a soporte.',
    default: 'Ocurrió un error. Por favor intenta de nuevo.',
  }

  const displayError =
    queryError && errorMessages[queryError]
      ? errorMessages[queryError]
      : queryError
      ? errorMessages.default
      : null

  const handleGoogleSignIn = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <>
      <Head>
        <title>Iniciar sesión — Dawere Intranet</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-dawere-teal via-dawere-teal-dark to-[#0D3B3A] flex items-center justify-center p-4">
        {/* Background decorations */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-dawere-orange/10" />
        </div> */}

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-modal overflow-hidden">
            {/* Header */}
            <div className="bg-dawere-gray-light p-8 text-center">
              {/* Logo SVG */}
              <div className="flex justify-center mb-4">
                 <Image
                                    src="/images/dawere-logo.svg"
                                    alt="Dawere"
                                    width={160}
                                    height={40}
                                />
              </div>
              <h1 className="text-darke font-bold text-xl">Portal Intranet</h1>
              <p className="text-dark/70 text-sm mt-1">Acceso exclusivo para empleados</p>
            </div>

            {/* Body */}
            <div className="p-8">
              {displayError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl mb-6">
                  <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{displayError}</p>
                </div>
              )}

              <div className="text-center mb-6">
                <p className="text-dawere-dark-light text-sm leading-relaxed">
                  Inicia sesión con tu cuenta corporativa{' '}
                  <strong className="text-dawere-dark">@dawere.com</strong> para
                  acceder al portal interno.
                </p>
              </div>

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-200 hover:border-dawere-teal hover:bg-dawere-teal-50 transition-all duration-200 font-semibold text-dawere-dark group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-dawere-teal/20 border-t-dawere-teal rounded-full animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                )}
                <span>
                  {loading ? 'Conectando...' : 'Continuar con Google Workspace'}
                </span>
              </button>

              <div className="mt-6 p-3 bg-dawere-teal-50 rounded-xl">
                <p className="text-xs text-center text-dawere-teal font-medium">
                  🔒 Solo se aceptan cuentas @dawere.com
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-white/50 text-xs mt-6">
            © {new Date().getFullYear()} Dawere — Uso interno exclusivo
          </p>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (session) {
    return { redirect: { destination: '/dashboard', permanent: false } }
  }
  return { props: {} }
}
