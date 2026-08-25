import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id?: string
    role?: 'ADMIN' | 'TEACHER' | 'STUDENT'
    teacherId?: string
    studentId?: string
  }
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: 'ADMIN' | 'TEACHER' | 'STUDENT'
      teacherId?: string
      studentId?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: 'ADMIN' | 'TEACHER' | 'STUDENT'
    teacherId?: string
    studentId?: string
  }
}

export type NavItem = { title: string; href: string; icon: string; badge?: number }
export type SearchResult = { type: 'file'|'exercise'|'formula'|'lesson'|'student'|'class'; id: string; title: string; subtitle: string; href: string }
export type DashboardStats = { totalClasses: number; totalStudents: number; pendingActivities: number; averageGrade: number; attendanceRate: number; recentFiles: Record<string, unknown>[]; upcomingEvents: Record<string, unknown>[] }
