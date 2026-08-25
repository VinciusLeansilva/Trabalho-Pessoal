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
    const term = searchParams.get('term')
    const studentIdsStr = searchParams.get('studentIds')

    if (!classId && !studentIdsStr) {
      return NextResponse.json({ error: 'classId or studentIds is required' }, { status: 400 })
    }

    if (classId) {
      const hasAccess = await prisma.class.findUnique({
        where: { id: classId, teacher: { userId: session.user.id } }
      })
      if (!hasAccess) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    }

    let studentIds: string[] = []
    if (studentIdsStr) {
      studentIds = studentIdsStr.split(',')
    }

    const where: Prisma.GradeWhereInput = {}
    if (studentIds.length > 0) where.studentId = { in: studentIds }
    if (term) where.term = term

    const grades = await prisma.grade.findMany({
      where,
      include: { student: { include: { user: true } } }
    })
    
    return NextResponse.json(grades)
  } catch (error) {
    console.error('[GRADES_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

interface GradeInput {
  studentId: string
  term?: string
  value: number | string
  comments?: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { grades } = body as { grades: GradeInput[] }

    if (!Array.isArray(grades) || grades.length === 0) {
      return NextResponse.json({ error: 'Invalid grades payload' }, { status: 400 })
    }

    const results = await prisma.$transaction(
      grades.map((grade: GradeInput) => 
        prisma.grade.create({
          data: {
            studentId: grade.studentId,
            term: grade.term || '1º Bimestre',
            value: Number(grade.value) || 0,
            comments: grade.comments || null,
          }
        })
      )
    )

    return NextResponse.json({ success: true, count: results.length }, { status: 201 })
  } catch (error) {
    console.error('[GRADES_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
