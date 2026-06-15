import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'dawere.com'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Force account selection even if already logged in
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
          // Request Google Workspace domain hint
          hd: ALLOWED_DOMAIN,
        },
      },
    }),
  ],

  callbacks: {
    /**
     * signIn callback — SECURITY GATE
     * Only allows @dawere.com emails to authenticate
     */
    async signIn({ user, account, profile }) {
      const email = user.email

      if (!email) {
        console.warn('[Auth] Sign-in rejected: no email provided')
        return false
      }

      const emailDomain = email.split('@')[1]

      if (emailDomain !== ALLOWED_DOMAIN) {
        console.warn(`[Auth] Sign-in rejected: email domain "${emailDomain}" is not allowed`)
        return `/login?error=domain`
      }

      // Optional: verify it's a Google Workspace account (not personal Gmail)
      // hd (hosted domain) in the profile means it's a Workspace account
      if (profile && 'hd' in profile) {
        const hd = (profile as any).hd
        if (hd && hd !== ALLOWED_DOMAIN) {
          console.warn(`[Auth] Sign-in rejected: hosted domain "${hd}" is not allowed`)
          return `/login?error=domain`
        }
      }

      return true
    },

    /**
     * JWT callback — enrich token with user info
     */
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },

    /**
     * Session callback — expose safe user info to client
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours (work day)
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)
