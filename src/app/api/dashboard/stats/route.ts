import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id },
      include: { classes: true }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 })
    }

    const classIds = teacher.classes.map(c => c.id)

    // Parallel fetch for stats
    const [
      totalClasses,
      studentsCount,
      pendingActivities,
      recentFiles,
      upcomingEvents
    ] = await Promise.all([
      prisma.class.count({ where: { teacherId: teacher.id } }),
      prisma.classStudent.count({ 
        where: { class: { teacherId: teacher.id } } 
      }),
      prisma.assignment.count({ 
        where: { 
          classId: { in: classIds }, 
          dueDate: { gte: new Date() } 
        } 
      }),
      prisma.file.findMany({
        where: { folder: { teacherId: teacher.id } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.assignment.findMany({
        where: {
          classId: { in: classIds },
          dueDate: { gte: new Date() }
        },
        orderBy: { dueDate: 'asc' },
        take: 5
      })
    ])

    // Mock calculations for attendance and grade
    const averageGrade = 8.5
    const attendanceRate = 92.4

    return NextResponse.json({
      totalClasses,
      totalStudents: studentsCount,
      pendingActivities,
      averageGrade,
      attendanceRate,
      recentFiles,
      upcomingEvents,
      lastAccessed: {
        lesson: null,
        exercise: null,
        file: recentFiles[0] || null,
        presentation: null
      }
    })
  } catch (error) {
    console.error('[DASHBOARD_STATS_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
