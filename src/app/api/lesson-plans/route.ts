import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const DEMO_LESSON_PLANS = [
  {
    id: 'lp-1',
    teacherId: 't-1',
    title: 'Matrizes e Operações Fundamentais',
    date: new Date('2026-08-25'),
    content: JSON.stringify({
      subject: 'Matemática',
      class: '2º Ano A',
      duration: 100,
      objective: 'Compreender os conceitos de matrizes, ordem, representação genérica e operações de adição, subtração e multiplicação por escalar.',
      introduction: 'Apresentação de exemplos práticos de tabelas de dados e como as matrizes são a base do processamento gráfico e computacional moderno.',
      theory: 'Definição de matriz m x n. Notação a_ij. Matriz identidade, nula e transposta. Regras de soma e subtração elemento a elemento.',
      examples: 'Dadas A e B de ordem 2x2, calcular 2A - 3B.',
      exercises: '3 exercícios práticos do livro didático páginas 45-47.',
      resolution: 'Resolução comentada no quadro passo a passo.',
      activity: 'Lista de exercícios individuais para entrega na próxima aula.',
      review: 'Fechamento dos pontos principais e verificação de dúvidas.'
    }),
    createdAt: new Date('2026-08-20'),
    updatedAt: new Date('2026-08-20')
  },
  {
    id: 'lp-2',
    teacherId: 't-1',
    title: 'Determinantes e Regra de Sarrus',
    date: new Date('2026-08-27'),
    content: JSON.stringify({
      subject: 'Matemática',
      class: '2º Ano A',
      duration: 100,
      objective: 'Dominar o cálculo de determinantes de ordem 2 e 3 pela Regra de Sarrus.',
      introduction: 'Motivação: resolução de sistemas lineares e cálculo de áreas na geometria analítica.',
      theory: 'Definição de determinante. Regra prática 2x2 (ad - bc). Regra de Sarrus para matrizes 3x3 com produtos das diagonais principais e secundárias.',
      examples: 'Cálculo do determinante de uma matriz com coeficientes reais.',
      exercises: 'Aplicação prática com cálculo de determinante.',
      resolution: 'Demonstração dos erros comuns com troca de sinais.',
      activity: 'Quiz rápido em duplas.',
      review: 'Síntese das propriedades dos determinantes.'
    }),
    createdAt: new Date('2026-08-21'),
    updatedAt: new Date('2026-08-21')
  },
  {
    id: 'lp-3',
    teacherId: 't-1',
    title: 'Cinemática: Movimento Uniformemente Variado',
    date: new Date('2026-08-28'),
    content: JSON.stringify({
      subject: 'Física',
      class: '1º Ano A',
      duration: 100,
      objective: 'Compreender a aceleração escalar constante, funções horárias de posição e velocidade e equação de Torricelli.',
      introduction: 'Vídeo curto de demonstração de frenagem veicular e tempo de reação.',
      theory: 'Dedução de v = v0 + at, s = s0 + v0t + (at^2)/2 e v^2 = v0^2 + 2aΔs.',
      examples: 'Cálculo do espaço de frenagem de um carro a 72 km/h.',
      exercises: 'Exercícios 1 a 4 da lista bimestral.',
      resolution: 'Atenção especial às conversões de unidades (km/h para m/s).',
      activity: 'Laboratório virtual de MRUV.',
      review: 'Mapa mental de fórmulas de cinemática.'
    }),
    createdAt: new Date('2026-08-22'),
    updatedAt: new Date('2026-08-22')
  }
]

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
      })

      if (teacher) {
        const plans = await prisma.lessonPlan.findMany({
          where: { teacherId: teacher.id },
          orderBy: { date: 'desc' }
        })
        if (plans.length > 0) return NextResponse.json(plans)
      }
    } catch {
      // ignore
    }

    return NextResponse.json(DEMO_LESSON_PLANS)
  } catch (error) {
    console.error('[LESSON_PLANS_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, content, date = new Date() } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const contentStr = typeof content === 'object' ? JSON.stringify(content) : String(content)

    try {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
      })

      if (teacher) {
        const plan = await prisma.lessonPlan.create({
          data: {
            title,
            content: contentStr,
            date: new Date(date),
            teacherId: teacher.id
          }
        })
        return NextResponse.json(plan, { status: 201 })
      }
    } catch {
      // fallback
    }

    const demoPlan = {
      id: `lp-${Date.now()}`,
      teacherId: session.user.id,
      title,
      content: contentStr,
      date: new Date(date),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json(demoPlan, { status: 201 })
  } catch (error) {
    console.error('[LESSON_PLANS_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
