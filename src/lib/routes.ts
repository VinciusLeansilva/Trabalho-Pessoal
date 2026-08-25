/**
 * Centralized Type-Safe Route Builder for EduMatrix ERP
 */
export const routes = {
  // Main
  dashboard: () => '/dashboard',
  login: () => '/login',

  // Classes & Students
  classes: () => '/classes',
  classDetail: (id: string) => `/classes/${id}`,
  students: () => '/students',
  studentDetail: (id: string) => `/students/${id}`,

  // Teaching & Planning
  planning: () => '/planning',
  lessons: () => '/lessons',
  lessonDetail: (id: string) => `/lessons/${id}`,
  presentations: () => '/presentations',
  presentationEdit: (id: string) => `/presentations/${id}/edit`,
  presentationPresent: (id: string) => `/presentations/${id}/present`,

  // Content & Solvers
  repository: (folderId?: string) => folderId ? `/repository?folderId=${folderId}` : '/repository',
  library: () => '/library',
  questionBank: (filters?: Record<string, string>) => {
    if (!filters) return '/question-bank'
    const query = new URLSearchParams(filters)
    return `/question-bank?${query.toString()}`
  },
  solver: (operation?: string) => operation ? `/exercises/solver?operation=${operation}` : '/exercises/solver',
  formulas: () => '/formulas',

  // Evaluation & Assessment
  activities: () => '/activities',
  activityDetail: (id: string) => `/activities/${id}`,
  grades: (classId?: string) => classId ? `/grades?classId=${classId}` : '/grades',
  attendance: (classId?: string) => classId ? `/attendance?classId=${classId}` : '/attendance',
  reports: () => '/reports',

  // Settings & Calendar
  calendar: () => '/calendar',
  settings: () => '/settings',
}
