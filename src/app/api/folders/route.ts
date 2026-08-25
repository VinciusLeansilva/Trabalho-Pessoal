import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const parentId = searchParams.get('parentId')

    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })
    if (!teacher) return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })

    const folders = await prisma.folder.findMany({
      where: {
        teacherId: teacher.id,
        parentId: parentId || null
      },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(folders)
  } catch (error) {
    console.error('[FOLDERS_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, parentId } = body

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })
    if (!teacher) return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })

    const folder = await prisma.folder.create({
      data: {
        name,
        parentId: parentId || null,
        teacherId: teacher.id
      }
    })

    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error('[FOLDERS_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
