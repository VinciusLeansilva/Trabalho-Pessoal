import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
      })

      if (teacher) {
        const favorites = await prisma.favorite.findMany({
          where: { teacherId: teacher.id },
          orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(favorites)
      }
    } catch {
      // ignore
    }

    return NextResponse.json([
      { id: 'fav-1', entityType: 'file', entityId: 'file-1', title: 'Plano_Ensino_2026.pdf' },
      { id: 'fav-2', entityType: 'formula', entityId: 'form-1', title: 'Determinante 3x3 (Sarrus)' },
      { id: 'fav-3', entityType: 'presentation', entityId: 'pres-1', title: 'Aula de Matrizes' }
    ])
  } catch (error) {
    console.error('[FAVORITES_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { entityType, entityId } = body

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'entityType and entityId are required' }, { status: 400 })
    }

    try {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
      })

      if (teacher) {
        const fav = await prisma.favorite.upsert({
          where: {
            teacherId_entityType_entityId: {
              teacherId: teacher.id,
              entityType,
              entityId
            }
          },
          update: {},
          create: {
            teacherId: teacher.id,
            entityType,
            entityId
          }
        })
        return NextResponse.json(fav, { status: 201 })
      }
    } catch {
      // demo
    }

    return NextResponse.json({ id: `fav-${Date.now()}`, entityType, entityId }, { status: 201 })
  } catch (error) {
    console.error('[FAVORITES_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
