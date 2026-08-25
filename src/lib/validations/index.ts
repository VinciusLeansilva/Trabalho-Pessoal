import { z } from 'zod'

// Auth & User
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const userCreateSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  firstName: z.string().min(2, 'Nome muito curto'),
  lastName: z.string().min(2, 'Sobrenome muito curto'),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).default('STUDENT'),
})

// Classes
export const classSchema = z.object({
  name: z.string().min(2, 'Nome da turma é obrigatório'),
  academicYear: z.string().min(4, 'Ano letivo inválido'),
})

// Students
export const studentSchema = z.object({
  firstName: z.string().min(2, 'Nome obrigatório'),
  lastName: z.string().min(2, 'Sobrenome obrigatório'),
  email: z.string().email('Email inválido'),
  enrollmentNo: z.string().optional(),
  classId: z.string().optional(),
})

// Assignments
export const assignmentSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  description: z.string().optional(),
  dueDate: z.string().or(z.date()),
  classId: z.string().min(1, 'Turma obrigatória'),
})

// Grades
export const gradeSchema = z.object({
  studentId: z.string().min(1, 'Aluno obrigatório'),
  term: z.string().default('1º Bimestre'),
  value: z.number().min(0).max(10),
  comments: z.string().optional().nullable(),
})

// Attendance
export const attendanceSchema = z.object({
  lessonId: z.string().min(1, 'Aula obrigatória'),
  studentId: z.string().min(1, 'Aluno obrigatório'),
  status: z.enum(['PRESENT', 'ABSENT', 'JUSTIFIED']),
  remarks: z.string().optional().nullable(),
})

// Folders & Files
export const folderSchema = z.object({
  name: z.string().min(1, 'Nome da pasta obrigatório'),
  parentId: z.string().optional().nullable(),
})

export const fileSchema = z.object({
  name: z.string().min(1, 'Nome do arquivo obrigatório'),
  url: z.string().min(1, 'URL obrigatória'),
  size: z.number().nonnegative(),
  type: z.enum(['PDF', 'DOCX', 'PPTX', 'XLSX', 'CSV', 'PNG', 'JPG', 'SVG', 'TXT', 'OTHER']),
  folderId: z.string().optional().nullable(),
})

// Exercises
export const exerciseSchema = z.object({
  subtopicId: z.string().min(1, 'Subtópico obrigatório'),
  title: z.string().min(3, 'Título obrigatório'),
  statement: z.string().min(5, 'Enunciado obrigatório'),
  type: z.enum(['MULTIPLE_CHOICE', 'OPEN', 'TRUE_FALSE', 'FILL_BLANK']).default('MULTIPLE_CHOICE'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']).default('MEDIUM'),
  options: z.array(z.string()).optional().nullable(),
  correctAnswer: z.string().optional().nullable(),
})

// Formulas
export const formulaSchema = z.object({
  subtopicId: z.string().min(1, 'Subtópico obrigatório'),
  name: z.string().min(2, 'Nome da fórmula obrigatório'),
  latexCode: z.string().min(1, 'Código LaTeX obrigatório'),
  description: z.string().optional().nullable(),
})

// Presentations
export const presentationSchema = z.object({
  title: z.string().min(2, 'Título da apresentação obrigatório'),
  lessonId: z.string().optional().nullable(),
})

export const slideSchema = z.object({
  presentationId: z.string().min(1),
  order: z.number().int().nonnegative(),
  type: z.enum(['TITLE', 'CONTENT', 'FORMULA', 'EXERCISE', 'RESOLUTION', 'EXAMPLE', 'SUMMARY']),
  content: z.any().optional(),
})

// Lesson Plans
export const lessonPlanSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  content: z.string().min(5, 'Conteúdo obrigatório'),
  date: z.string().or(z.date()),
})

// AI Assistant
export const aiPromptSchema = z.object({
  prompt: z.string().min(3, 'Prompt obrigatório'),
  commandType: z.enum([
    'create_lesson',
    'explain_concept',
    'generate_exercises',
    'create_exam',
    'convert_to_slides',
    'solve_step_by_step',
    'adapt_level',
    'custom'
  ]).default('custom'),
  subject: z.string().optional(),
  targetGrade: z.string().optional(),
  context: z.string().optional(),
})
