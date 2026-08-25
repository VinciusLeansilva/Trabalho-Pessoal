import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 })
    }
    
    const classes = await prisma.class.findMany({
      where: { teacherId: teacher.id },
      include: { 
        _count: { select: { classStudents: true, lessons: true, assignments: true } },
        lessons: { take: 1, orderBy: { date: 'desc' } },
      },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(classes)
  } catch (error) {
    console.error('[CLASSES_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, academicYear } = body

    if (!name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 })
    }

    const newClass = await prisma.class.create({
      data: { 
        name, 
        academicYear, 
        teacherId: teacher.id 
      }
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('[CLASSES_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
