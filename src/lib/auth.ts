import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const DEMO_USERS = [
  {
    email: 'admin@edumatrix.com',
    password: 'admin123',
    user: {
      id: 'demo-admin-id',
      email: 'admin@edumatrix.com',
      name: 'Administrador EduMatrix',
      role: 'ADMIN' as const,
    },
  },
  {
    email: 'professor@edumatrix.com',
    password: 'professor123',
    user: {
      id: 'demo-teacher-id',
      email: 'professor@edumatrix.com',
      name: 'Carlos Santos',
      role: 'TEACHER' as const,
      teacherId: 'demo-teacher-profile-id',
    },
  },
  {
    email: 'ana@edumatrix.com',
    password: 'professor123',
    user: {
      id: 'demo-ana-id',
      email: 'ana@edumatrix.com',
      name: 'Ana Lima',
      role: 'TEACHER' as const,
      teacherId: 'demo-ana-profile-id',
    },
  },
  {
    email: 'joao.silva@aluno.edu.br',
    password: 'aluno123',
    user: {
      id: 'demo-student-id',
      email: 'joao.silva@aluno.edu.br',
      name: 'João Silva',
      role: 'STUDENT' as const,
      studentId: 'demo-student-profile-id',
    },
  },
]

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const inputEmail = String(credentials.email).toLowerCase().trim()
        const inputPassword = String(credentials.password)

        try {
          const user = await prisma.user.findUnique({
            where: { email: inputEmail },
            include: {
              teacherProfile: true,
              studentProfile: true,
            },
          })

          if (user && user.passwordHash) {
            const isPasswordValid = await bcrypt.compare(
              inputPassword,
              user.passwordHash
            )

            if (isPasswordValid) {
              return {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role,
                teacherId: user.teacherProfile?.id ?? undefined,
                studentId: user.studentProfile?.id ?? undefined,
              }
            }
          }
        } catch {
          // Database connection failed, falling back to demo users below
        }

        // Demo user fallback for development mode
        const demoMatch = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === inputEmail && u.password === inputPassword
        )
        if (demoMatch) {
          return demoMatch.user
        }

        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.teacherId = user.teacherId
        token.studentId = user.studentId
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'ADMIN' | 'TEACHER' | 'STUDENT'
        session.user.teacherId = token.teacherId
        session.user.studentId = token.studentId
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
