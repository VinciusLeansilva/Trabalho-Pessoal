import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DifficultyLevel, ExerciseType } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const difficulty = searchParams.get('difficulty')
    const type = searchParams.get('type')

    const exercises = await prisma.exercise.findMany({
      where: {
        ...(difficulty && { difficulty: difficulty as DifficultyLevel }),
        ...(type && { type: type as ExerciseType }),
      },
      include: { steps: true, subtopic: { include: { topic: { include: { subject: true } } } } },
      orderBy: { id: 'desc' }, // Cannot use createdAt, it is missing in the model definition provided. Use id.
      take: 50,
    })
    
    return NextResponse.json(exercises)
  } catch (error) {
    console.error('[EXERCISES_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, statement, subtopicId, type, difficulty, options, correctAnswer } = body

    if (!title || !statement || !subtopicId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const exercise = await prisma.exercise.create({
      data: {
        subtopicId: subtopicId,
        title,
        statement,
        type: type as ExerciseType,
        difficulty: difficulty as DifficultyLevel,
        options: options ? JSON.parse(JSON.stringify(options)) : undefined,
        correctAnswer
      }
    })

    return NextResponse.json(exercise, { status: 201 })
  } catch (error) {
    console.error('[EXERCISES_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
