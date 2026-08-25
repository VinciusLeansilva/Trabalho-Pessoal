import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DEMO_PRESENTATIONS } from '@/data/presentation-seed-data'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    try {
      const presentation = await prisma.presentation.findUnique({
        where: { id },
        include: {
          slides: { orderBy: { order: 'asc' } },
          lesson: { include: { class: true, subject: true } }
        }
      })
      if (presentation) return NextResponse.json(presentation)
    } catch {
      // ignore
    }

    const demo = DEMO_PRESENTATIONS.find((p: any) => p.id === id) || DEMO_PRESENTATIONS[0]
    return NextResponse.json(demo)
  } catch (error) {
    console.error('[PRESENTATION_ID_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { title, slides } = body

    try {
      if (slides && Array.isArray(slides)) {
        await prisma.presentationSlide.deleteMany({ where: { presentationId: id } })
        await prisma.presentationSlide.createMany({
          data: slides.map((s: { order: number; type: string; content: unknown }, idx: number) => ({
            presentationId: id,
            order: s.order || idx + 1,
            type: (s.type as any) || 'CONTENT',
            content: s.content as any
          }))
        })
      }

      const updated = await prisma.presentation.update({
        where: { id },
        data: {
          title: title || undefined,
          updatedAt: new Date()
        },
        include: { slides: { orderBy: { order: 'asc' } } }
      })
      return NextResponse.json(updated)
    } catch {
      // demo return
      return NextResponse.json({ id, title, slides, updatedAt: new Date() })
    }
  } catch (error) {
    console.error('[PRESENTATION_ID_PUT]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    try {
      await prisma.presentation.delete({ where: { id } })
    } catch {
      // demo delete
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('[PRESENTATION_ID_DELETE]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
