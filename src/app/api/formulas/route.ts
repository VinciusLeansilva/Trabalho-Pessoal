import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const subtopicId = searchParams.get('subtopicId')

    const formulas = await prisma.formula.findMany({
      where: {
        ...(subtopicId && { subtopicId }),
      },
      include: { subtopic: { include: { topic: { include: { subject: true } } } } },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(formulas)
  } catch (error) {
    console.error('[FORMULAS_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
