import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AttendanceStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get('lessonId')

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
    }

    const attendance = await prisma.attendance.findMany({
      where: { lessonId: lessonId },
      include: { student: { include: { user: true } } }
    })
    
    return NextResponse.json(attendance)
  } catch (error) {
    console.error('[ATTENDANCE_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

interface AttendanceRecord {
  id?: string
  studentId: string
  status: AttendanceStatus
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { lessonId, records } = body as { lessonId: string; records: AttendanceRecord[] }

    if (!lessonId || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    for (const record of records) {
      const existing = await prisma.attendance.findFirst({
        where: { lessonId, studentId: record.studentId }
      })
      if (existing) {
        await prisma.attendance.update({
          where: { id: existing.id },
          data: { status: record.status }
        })
      } else {
        await prisma.attendance.create({
          data: { lessonId, studentId: record.studentId, status: record.status }
        })
      }
    }

    return NextResponse.json({ success: true, count: records.length }, { status: 201 })
  } catch (error) {
    console.error('[ATTENDANCE_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
