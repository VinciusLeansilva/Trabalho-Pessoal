import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const classData = await prisma.class.findUnique({
      where: {
        id,
        teacher: { userId: session.user.id }
      },
      include: {
        classStudents: { include: { student: { include: { user: true } } } },
        lessons: { orderBy: { date: 'desc' }, take: 10 },
        assignments: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: { select: { classStudents: true } },
      }
    })

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error('[CLASS_GET]', error)
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
    const { name, academicYear } = body

    const existingClass = await prisma.class.findUnique({
      where: {
        id,
        teacher: { userId: session.user.id }
      }
    })

    if (!existingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: { name, academicYear }
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error('[CLASS_PUT]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const existingClass = await prisma.class.findUnique({
      where: {
        id,
        teacher: { userId: session.user.id }
      }
    })

    if (!existingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    await prisma.class.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[CLASS_DELETE]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
