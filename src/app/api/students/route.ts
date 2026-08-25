import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')
    
    const where: Prisma.StudentWhereInput = {}
    if (classId) {
      const classData = await prisma.class.findUnique({
        where: { id: classId, teacher: { userId: session.user.id } }
      })
      if (!classData) return NextResponse.json({ error: 'Unauthorized or class not found' }, { status: 403 })
      where.classStudents = { some: { classId: classId } }
    } else {
      where.classStudents = { some: { class: { teacher: { userId: session.user.id } } } }
    }

    const students = await prisma.student.findMany({
      where,
      include: { user: true }
    })
    
    return NextResponse.json(students)
  } catch (error) {
    console.error('[STUDENTS_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { firstName, lastName, email, password, enrollmentNo, classId } = body

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'First name, last name, and email are required' }, { status: 400 })
    }

    if (classId) {
      const classData = await prisma.class.findUnique({
        where: { id: classId, teacher: { userId: session.user.id } }
      })
      if (!classData) return NextResponse.json({ error: 'Unauthorized for this class' }, { status: 403 })
    }

    const newUser = await prisma.user.create({
      data: {
        firstName, 
        lastName, 
        email,
        passwordHash: await bcrypt.hash(password || 'aluno123', 10),
        role: 'STUDENT',
        studentProfile: {
          create: { enrollmentNo: enrollmentNo || `ALU${Date.now()}` }
        }
      },
      include: { studentProfile: true }
    })

    if (classId && newUser.studentProfile) {
      await prisma.classStudent.create({
        data: {
          classId: classId,
          studentId: newUser.studentProfile.id
        }
      })
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('[STUDENTS_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
