export const api = {
  classes: {
    list: () => fetch('/api/classes').then(r => r.json()),
    get: (id: string) => fetch(`/api/classes/${id}`).then(r => r.json()),
    create: (data: Record<string, unknown>) => 
      fetch('/api/classes', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      }).then(r => r.json()),
    update: (id: string, data: Record<string, unknown>) => 
      fetch(`/api/classes/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      }).then(r => r.json()),
    delete: (id: string) => 
      fetch(`/api/classes/${id}`, { method: 'DELETE' }),
  },
  students: { 
    list: (classId?: string) => 
      fetch(classId ? `/api/students?classId=${classId}` : '/api/students').then(r => r.json()),
    get: (id: string) => fetch(`/api/students/${id}`).then(r => r.json()),
    create: (data: Record<string, unknown>) => 
      fetch('/api/students', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      }).then(r => r.json())
  },
  grades: { 
    list: (classId: string, assessmentId?: string) => {
      const query = new URLSearchParams({ classId })
      if (assessmentId) query.append('assessmentId', assessmentId)
      return fetch(`/api/grades?${query.toString()}`).then(r => r.json())
    },
    save: (data: Record<string, unknown>) => 
      fetch('/api/grades', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      }).then(r => r.json()) 
  },
  attendance: { 
    get: (classId: string, date: string) => 
      fetch(`/api/attendance?classId=${classId}&date=${date}`).then(r => r.json()), 
    save: (data: Record<string, unknown>) => 
      fetch('/api/attendance', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      }).then(r => r.json()) 
  },
  exercises: { 
    list: (filters?: Record<string, string>) => {
      const query = new URLSearchParams(filters || {})
      return fetch(`/api/exercises?${query.toString()}`).then(r => r.json())
    },
    create: (data: Record<string, unknown>) => 
      fetch('/api/exercises', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      }).then(r => r.json()),
    solve: (data: Record<string, unknown>) => 
      fetch('/api/exercises/solve', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      }).then(r => r.json()) 
  },
  formulas: { 
    list: (filters?: Record<string, string>) => {
      const query = new URLSearchParams(filters || {})
      return fetch(`/api/formulas?${query.toString()}`).then(r => r.json())
    }
  },
  search: { 
    global: (q: string) => fetch(`/api/search?q=${encodeURIComponent(q)}`).then(r => r.json()) 
  },
  folders: { 
    list: (parentId?: string) => 
      fetch(parentId ? `/api/folders?parentId=${parentId}` : '/api/folders').then(r => r.json()), 
    create: (data: Record<string, unknown>) => 
      fetch('/api/folders', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      }).then(r => r.json()) 
  },
  files: {
    list: (folderId?: string) => 
      fetch(folderId ? `/api/files?folderId=${folderId}` : '/api/files').then(r => r.json()),
    upload: (data: Record<string, unknown> | FormData) => 
      fetch('/api/files', { 
        method: 'POST', 
        headers: data instanceof FormData ? undefined : { 'Content-Type': 'application/json' }, 
        body: data instanceof FormData ? data : JSON.stringify(data) 
      }).then(r => r.json())
  },
  activities: { 
    list: (classId?: string) => 
      fetch(classId ? `/api/activities?classId=${classId}` : '/api/activities').then(r => r.json()), 
    create: (data: Record<string, unknown>) => 
      fetch('/api/activities', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      }).then(r => r.json()) 
  },
  presentations: {
    list: () => fetch('/api/presentations').then(r => r.json()),
    get: (id: string) => fetch(`/api/presentations/${id}`).then(r => r.json()),
    create: (data: Record<string, unknown>) =>
      fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: Record<string, unknown>) =>
      fetch(`/api/presentations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) =>
      fetch(`/api/presentations/${id}`, { method: 'DELETE' }).then(r => r.json())
  },
  questionBank: {
    list: (filters?: Record<string, string>) => {
      const query = new URLSearchParams(filters || {})
      return fetch(`/api/question-bank?${query.toString()}`).then(r => r.json())
    },
    create: (data: Record<string, unknown>) =>
      fetch('/api/question-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json())
  },
  lessonPlans: {
    list: () => fetch('/api/lesson-plans').then(r => r.json()),
    create: (data: Record<string, unknown>) =>
      fetch('/api/lesson-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json())
  },
  lessons: {
    list: (classId?: string) =>
      fetch(classId ? `/api/lessons?classId=${classId}` : '/api/lessons').then(r => r.json()),
    create: (data: Record<string, unknown>) =>
      fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json())
  },
  ai: {
    assistant: (data: { prompt: string; actionType?: string; context?: unknown }) =>
      fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json())
  },
  favorites: {
    list: () => fetch('/api/favorites').then(r => r.json()),
    toggle: (entityType: string, entityId: string) =>
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, entityId })
      }).then(r => r.json())
  },
  dashboard: { 
    stats: () => fetch('/api/dashboard/stats').then(r => r.json()) 
  }
}
