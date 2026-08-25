import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DEMO_PRESENTATIONS } from '@/data/presentation-seed-data'

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let teacher = null
    try {
      teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
      })
    } catch {
      // ignore db error in demo mode
    }

    if (teacher) {
      const presentations = await prisma.presentation.findMany({
        where: { teacherId: teacher.id },
        include: {
          slides: { orderBy: { order: 'asc' } },
          lesson: { include: { class: true } }
        },
        orderBy: { updatedAt: 'desc' }
      })
      if (presentations.length > 0) return NextResponse.json(presentations)
    }

    // Fallback to demo presentations
    return NextResponse.json(DEMO_PRESENTATIONS)
  } catch (error) {
    console.error('[PRESENTATIONS_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, slides = [], lessonId } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    try {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
      })

      if (teacher) {
        const presentation = await prisma.presentation.create({
          data: {
            title,
            teacherId: teacher.id,
            lessonId: lessonId || null,
            slides: {
              create: slides.map((s: { order: number; type: string; content: unknown }, idx: number) => ({
                order: s.order || idx + 1,
                type: (s.type as any) || 'CONTENT',
                content: s.content as any
              }))
            }
          },
          include: { slides: true }
        })
        return NextResponse.json(presentation, { status: 201 })
      }
    } catch (e) {
      console.warn('[PRESENTATIONS_POST] DB unavailable, creating mock presentation', e)
    }

    // Demo fallback creation
    const newDemo = {
      id: `pres-${Date.now()}`,
      title,
      teacherId: session.user.id,
      lessonId: lessonId || null,
      slides: slides.length > 0 ? slides : [
        { id: 's1', presentationId: `pres-${Date.now()}`, order: 1, type: 'TITLE', content: { title, subtitle: 'Criado no EduMatrix' } }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json(newDemo, { status: 201 })
  } catch (error) {
    console.error('[PRESENTATIONS_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
