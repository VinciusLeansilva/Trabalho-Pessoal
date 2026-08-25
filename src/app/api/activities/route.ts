import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')

    const where: Prisma.AssignmentWhereInput = {}
    if (classId) {
      const classAccess = await prisma.class.findUnique({
        where: { id: classId, teacher: { userId: session.user.id } }
      })
      if (!classAccess) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      where.classId = classId
    } else {
      where.class = { teacher: { userId: session.user.id } }
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: { class: true },
      orderBy: { dueDate: 'asc' }
    })
    
    return NextResponse.json(assignments)
  } catch (error) {
    console.error('[ASSIGNMENTS_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, dueDate, classId } = body

    if (!title || !classId) return NextResponse.json({ error: 'Title and classId are required' }, { status: 400 })

    const classAccess = await prisma.class.findUnique({
      where: { id: classId, teacher: { userId: session.user.id } }
    })
    if (!classAccess) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        classId,
      }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('[ASSIGNMENTS_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
