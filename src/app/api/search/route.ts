import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')

    if (!q) {
      return NextResponse.json({
        exercises: [],
        formulas: [],
        students: [],
        classes: [],
        materials: []
      })
    }

    const [exercises, formulas, students, classes, materials] = await Promise.all([
      prisma.exercise.findMany({
        where: { 
          OR: [
            { title: { contains: q, mode: 'insensitive' } }, 
            { statement: { contains: q, mode: 'insensitive' } }
          ] 
        },
        take: 5,
      }),
      prisma.formula.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      prisma.student.findMany({
        where: { 
          user: { 
            OR: [
              { firstName: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } },
            ]
          }
        },
        include: { user: true },
        take: 5,
      }),
      prisma.class.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
          teacher: { userId: session.user.id }
        },
        take: 5
      }),
      prisma.material.findMany({
        where: { title: { contains: q, mode: 'insensitive' } },
        take: 5
      })
    ])
    
    return NextResponse.json({
      exercises,
      formulas,
      students,
      classes,
      materials
    })
  } catch (error) {
    console.error('[SEARCH_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
