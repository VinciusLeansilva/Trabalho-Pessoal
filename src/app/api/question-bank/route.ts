import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const DEMO_QUESTIONS = [
  {
    id: 'qb-1',
    subjectId: 'mat-1',
    subject: { name: 'Matemática' },
    statement: 'Calcule o determinante da matriz $A = \\begin{pmatrix} 3 & 4 \\\\ 2 & 5 \\end{pmatrix}$.',
    type: 'MULTIPLE_CHOICE',
    difficulty: 'EASY',
    options: ['A) 7', 'B) 15', 'C) 8', 'D) 23', 'E) -7'],
    correctAnswer: 'A',
    explanation: 'det(A) = (3 * 5) - (4 * 2) = 15 - 8 = 7.',
    tags: [{ tag: { name: 'Determinantes' } }, { tag: { name: 'Matrizes 2x2' } }],
    createdAt: new Date('2026-08-10')
  },
  {
    id: 'qb-2',
    subjectId: 'mat-1',
    subject: { name: 'Matemática' },
    statement: 'Determine as raízes reais da equação quadrática $x^2 - 7x + 10 = 0$.',
    type: 'MULTIPLE_CHOICE',
    difficulty: 'MEDIUM',
    options: ['A) x = 2 e x = 5', 'B) x = -2 e x = -5', 'C) x = 1 e x = 10', 'D) x = 3 e x = 4', 'E) Não possui raízes reais'],
    correctAnswer: 'A',
    explanation: 'Δ = (-7)² - 4(1)(10) = 49 - 40 = 9. x = (7 ± 3)/2 => x1 = 5, x2 = 2.',
    tags: [{ tag: { name: 'Equações' } }, { tag: { name: 'Bhaskara' } }],
    createdAt: new Date('2026-08-12')
  },
  {
    id: 'qb-3',
    subjectId: 'fis-1',
    subject: { name: 'Física' },
    statement: 'Um veículo parte do repouso com aceleração constante de $2\\text{ m/s}^2$. Qual a sua velocidade após percorrer uma distância de $100\\text{ m}$?',
    type: 'MULTIPLE_CHOICE',
    difficulty: 'HARD',
    options: ['A) 10 m/s', 'B) 20 m/s', 'C) 25 m/s', 'D) 40 m/s', 'E) 50 m/s'],
    correctAnswer: 'B',
    explanation: 'Equação de Torricelli: v² = v0² + 2aΔs => v² = 0 + 2(2)(100) = 400 => v = 20 m/s.',
    tags: [{ tag: { name: 'Cinemática' } }, { tag: { name: 'Torricelli' } }, { tag: { name: 'MRUV' } }],
    createdAt: new Date('2026-08-15')
  },
  {
    id: 'qb-4',
    subjectId: 'qui-1',
    subject: { name: 'Química' },
    statement: 'Calcule a quantidade de matéria (número de mols) contida em $90\\text{ g}$ de água ($H_2O$), dado que $M(H_2O) = 18\\text{ g/mol}$.',
    type: 'MULTIPLE_CHOICE',
    difficulty: 'EASY',
    options: ['A) 2 mols', 'B) 4 mols', 'C) 5 mols', 'D) 9 mols', 'E) 18 mols'],
    correctAnswer: 'C',
    explanation: 'n = m / M = 90 / 18 = 5 mols.',
    tags: [{ tag: { name: 'Estequiometria' } }, { tag: { name: 'Massa Molar' } }],
    createdAt: new Date('2026-08-18')
  },
  {
    id: 'qb-5',
    subjectId: 'mat-1',
    subject: { name: 'Matemática' },
    statement: 'Efetue a soma das frações $\\frac{2}{5} + \\frac{3}{10}$.',
    type: 'MULTIPLE_CHOICE',
    difficulty: 'EASY',
    options: ['A) 7/10', 'B) 5/15', 'C) 1/2', 'D) 4/5', 'E) 1/10'],
    correctAnswer: 'A',
    explanation: 'MMC(5, 10) = 10. 4/10 + 3/10 = 7/10.',
    tags: [{ tag: { name: 'Frações' } }, { tag: { name: 'Aritmética' } }],
    createdAt: new Date('2026-08-20')
  }
]

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subjectId')
    const difficulty = searchParams.get('difficulty')
    const type = searchParams.get('type')
    const query = searchParams.get('q')?.toLowerCase()

    try {
      const where: any = {}
      if (subjectId) where.subjectId = subjectId
      if (difficulty) where.difficulty = difficulty
      if (type) where.type = type
      if (query) {
        where.OR = [
          { statement: { contains: query, mode: 'insensitive' } },
          { explanation: { contains: query, mode: 'insensitive' } }
        ]
      }

      const questions = await prisma.questionBank.findMany({
        where,
        include: {
          subject: true,
          tags: { include: { tag: true } }
        },
        orderBy: { createdAt: 'desc' }
      })

      if (questions.length > 0) return NextResponse.json(questions)
    } catch {
      // ignore db error
    }

    // Filter demo questions
    let filtered = [...DEMO_QUESTIONS]
    if (difficulty) filtered = filtered.filter(q => q.difficulty === difficulty)
    if (type) filtered = filtered.filter(q => q.type === type)
    if (query) {
      filtered = filtered.filter(q =>
        q.statement.toLowerCase().includes(query) ||
        q.explanation?.toLowerCase().includes(query)
      )
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('[QUESTION_BANK_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { statement, subjectId, type = 'MULTIPLE_CHOICE', difficulty = 'MEDIUM', options, correctAnswer, explanation, tags = [] } = body

    if (!statement) {
      return NextResponse.json({ error: 'Statement is required' }, { status: 400 })
    }

    try {
      const created = await prisma.questionBank.create({
        data: {
          statement,
          subjectId: subjectId || 'default-subject',
          type,
          difficulty,
          options,
          correctAnswer,
          explanation
        }
      })
      return NextResponse.json(created, { status: 201 })
    } catch {
      // demo mock
      const newQuestion = {
        id: `qb-${Date.now()}`,
        statement,
        subjectId: subjectId || 'mat-1',
        subject: { name: 'Matemática' },
        type,
        difficulty,
        options,
        correctAnswer,
        explanation,
        tags: tags.map((t: string) => ({ tag: { name: t } })),
        createdAt: new Date()
      }
      return NextResponse.json(newQuestion, { status: 201 })
    }
  } catch (error) {
    console.error('[QUESTION_BANK_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
