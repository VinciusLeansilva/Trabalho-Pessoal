import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FileType } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const folderId = searchParams.get('folderId')

    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })
    if (!teacher) return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })

    const files = await prisma.file.findMany({
      where: { 
        folderId: folderId || undefined,
        folder: { teacherId: teacher.id }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(files)
  } catch (error) {
    console.error('[FILES_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, url, size, type, folderId } = body

    if (!name || !url) return NextResponse.json({ error: 'Name and url are required' }, { status: 400 })

    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })
    if (!teacher) return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })

    const validFileType = (Object.values(FileType) as string[]).includes(type)
      ? (type as FileType)
      : FileType.OTHER

    const file = await prisma.file.create({
      data: {
        name,
        url,
        size: size || 0,
        type: validFileType,
        folderId: folderId || undefined,
      }
    })

    return NextResponse.json(file, { status: 201 })
  } catch (error) {
    console.error('[FILES_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
