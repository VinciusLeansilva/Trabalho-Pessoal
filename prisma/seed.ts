import { PrismaClient, SubjectArea, DifficultyLevel, ExerciseType, SlideType, AttendanceStatus, FileType } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting expanded EduMatrix ERP seed...')

  // Clean DB in correct order
  await prisma.$transaction([
    prisma.answer.deleteMany(),
    prisma.submission.deleteMany(),
    prisma.grade.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.stepMarker.deleteMany(),
    prisma.exerciseStep.deleteMany(),
    prisma.solution.deleteMany(),
    prisma.assignmentQuestion.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.presentationSlide.deleteMany(),
    prisma.presentation.deleteMany(),
    prisma.formulaExample.deleteMany(),
    prisma.formula.deleteMany(),
    prisma.exercise.deleteMany(),
    prisma.example.deleteMany(),
    prisma.lessonConcept.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.classStudent.deleteMany(),
    prisma.class.deleteMany(),
    prisma.fileVersion.deleteMany(),
    prisma.file.deleteMany(),
    prisma.folder.deleteMany(),
    prisma.material.deleteMany(),
    prisma.subtopic.deleteMany(),
    prisma.topic.deleteMany(),
    prisma.questionTag.deleteMany(),
    prisma.questionBank.deleteMany(),
    prisma.entityTag.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.lessonPlan.deleteMany(),
    prisma.calendarEvent.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.student.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.userRole.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // 1. PASSWORDS
  const adminPassword = await bcrypt.hash('admin123', 10)
  const profPassword = await bcrypt.hash('professor123', 10)
  const studentPassword = await bcrypt.hash('aluno123', 10)

  // 2. USERS & TEACHERS (3 Teachers)
  await prisma.user.create({
    data: {
      firstName: 'Administrador',
      lastName: 'EduMatrix',
      email: 'admin@edumatrix.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  const teacher1User = await prisma.user.create({
    data: {
      firstName: 'Carlos',
      lastName: 'Santos',
      email: 'professor@edumatrix.com',
      passwordHash: profPassword,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          specialization: 'Matemática e Física Computacional',
          hireDate: new Date('2022-02-01'),
        },
      },
    },
    include: { teacherProfile: true },
  })
  const teacher1 = teacher1User.teacherProfile!

  const teacher2User = await prisma.user.create({
    data: {
      firstName: 'Ana',
      lastName: 'Lima',
      email: 'ana@edumatrix.com',
      passwordHash: profPassword,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          specialization: 'Física e Astronomia',
          hireDate: new Date('2023-01-15'),
        },
      },
    },
    include: { teacherProfile: true },
  })
  const teacher2 = teacher2User.teacherProfile!

  const teacher3User = await prisma.user.create({
    data: {
      firstName: 'Roberto',
      lastName: 'Mendes',
      email: 'roberto@edumatrix.com',
      passwordHash: profPassword,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          specialization: 'Química e Biologia Geral',
          hireDate: new Date('2024-03-10'),
        },
      },
    },
    include: { teacherProfile: true },
  })
  const teacher3 = teacher3User.teacherProfile!

  // 3. 30 STUDENTS
  const studentNames = [
    { first: 'João', last: 'Silva' },
    { first: 'Maria', last: 'Oliveira' },
    { first: 'Pedro', last: 'Souza' },
    { first: 'Ana', last: 'Costa' },
    { first: 'Lucas', last: 'Pereira' },
    { first: 'Juliana', last: 'Santos' },
    { first: 'Gabriel', last: 'Almeida' },
    { first: 'Beatriz', last: 'Ribeiro' },
    { first: 'Matheus', last: 'Carvalho' },
    { first: 'Camila', last: 'Gomes' },
    { first: 'Felipe', last: 'Martins' },
    { first: 'Larissa', last: 'Araújo' },
    { first: 'Rafael', last: 'Lima' },
    { first: 'Amanda', last: 'Barbosa' },
    { first: 'Guilherme', last: 'Rocha' },
    { first: 'Fernanda', last: 'Dias' },
    { first: 'Bruno', last: 'Monteiro' },
    { first: 'Mariana', last: 'Cardoso' },
    { first: 'Thiago', last: 'Nunes' },
    { first: 'Letícia', last: 'Teixeira' },
    { first: 'Vinícius', last: 'Moreira' },
    { first: 'Carolina', last: 'Cavalcanti' },
    { first: 'Leonardo', last: 'Dantas' },
    { first: 'Isabela', last: 'Ferreira' },
    { first: 'Rodrigo', last: 'Pinto' },
    { first: 'Natália', last: 'Freitas' },
    { first: 'Caio', last: 'Moraes' },
    { first: 'Bianca', last: 'Castro' },
    { first: 'Diego', last: 'Ramos' },
    { first: 'Helena', last: 'Macedo' }
  ]

  const students = await Promise.all(
    studentNames.map(async (st, idx) => {
      const enrollmentNo = `2026${String(idx + 1).padStart(3, '0')}`
      const email = `${st.first.toLowerCase()}.${st.last.toLowerCase()}${idx + 1}@aluno.edu.br`
      const user = await prisma.user.create({
        data: {
          firstName: st.first,
          lastName: st.last,
          email,
          passwordHash: studentPassword,
          role: 'STUDENT',
          studentProfile: {
            create: { enrollmentNo },
          },
        },
        include: { studentProfile: true },
      })
      return user.studentProfile!
    })
  )

  // 4. 10 SUBJECTS
  const subjectsData = [
    { name: 'Matemática', area: SubjectArea.MATHEMATICS, description: 'Álgebra, Geometria, Análise e Cálculo' },
    { name: 'Física', area: SubjectArea.PHYSICS, description: 'Mecânica, Termologia, Eletromagnetismo e Óptica' },
    { name: 'Química', area: SubjectArea.CHEMISTRY, description: 'Química Geral, Físico-Química e Orgânica' },
    { name: 'Biologia', area: SubjectArea.BIOLOGY, description: 'Citologia, Genética, Ecologia e Fisiologia' },
    { name: 'Português', area: SubjectArea.PORTUGUESE, description: 'Gramática, Literatura e Redação' },
    { name: 'História', area: SubjectArea.HISTORY, description: 'História Geral e do Brasil' },
    { name: 'Geografia', area: SubjectArea.GEOGRAPHY, description: 'Geopolítica, Cartografia e Meio Ambiente' },
    { name: 'Inglês', area: SubjectArea.ENGLISH, description: 'Língua Inglesa e Compreensão de Texto' },
    { name: 'Filosofia', area: SubjectArea.PHILOSOPHY, description: 'Ética, Epistemologia e Filosofia Política' },
    { name: 'Sociologia', area: SubjectArea.SOCIOLOGY, description: 'Estruturas Sociais, Cultura e Cidadania' },
  ]

  const subjects = await Promise.all(
    subjectsData.map(s => prisma.subject.create({ data: s }))
  )

  const math = subjects.find(s => s.name === 'Matemática')!
  const phys = subjects.find(s => s.name === 'Física')!
  const chem = subjects.find(s => s.name === 'Química')!

  // 5. 5 CLASSES
  const classesData = [
    { name: '1º Ano A', academicYear: '2026', teacherId: teacher1.id },
    { name: '1º Ano B', academicYear: '2026', teacherId: teacher2.id },
    { name: '2º Ano A', academicYear: '2026', teacherId: teacher1.id },
    { name: '2º Ano B', academicYear: '2026', teacherId: teacher1.id },
    { name: '3º Ano A', academicYear: '2026', teacherId: teacher3.id },
  ]

  const classes = await Promise.all(
    classesData.map(c => prisma.class.create({ data: c }))
  )

  // Enroll students in classes
  for (let i = 0; i < students.length; i++) {
    const classIndex = i % classes.length
    await prisma.classStudent.create({
      data: {
        classId: classes[classIndex].id,
        studentId: students[i].id,
      },
    })
  }

  // 6. TOPICS & SUBTOPICS
  const mathTopic = await prisma.topic.create({
    data: { name: 'Matrizes e Determinantes', subjectId: math.id, order: 1 }
  })
  const matSubtopic = await prisma.subtopic.create({
    data: { name: 'Operações e Propriedades de Matrizes', topicId: mathTopic.id, order: 1 }
  })
  const detSubtopic = await prisma.subtopic.create({
    data: { name: 'Determinantes e Regra de Sarrus', topicId: mathTopic.id, order: 2 }
  })

  const physTopic = await prisma.topic.create({
    data: { name: 'Cinemática Escalar', subjectId: phys.id, order: 1 }
  })
  const physSubtopic = await prisma.subtopic.create({
    data: { name: 'Movimento Uniformemente Variado', topicId: physTopic.id, order: 1 }
  })

  const chemTopic = await prisma.topic.create({
    data: { name: 'Gases e Estequiometria', subjectId: chem.id, order: 1 }
  })
  const chemSubtopic = await prisma.subtopic.create({
    data: { name: 'Equação de Clapeyron', topicId: chemTopic.id, order: 1 }
  })

  // 7. FORMULAS (50+)
  const formulasData = [
    { name: 'Determinante 2x2', latexCode: '\\det(A) = ad - bc', subtopicId: detSubtopic.id, description: 'Produto da diagonal principal menos produto da secundária' },
    { name: 'Determinante 3x3 (Regra de Sarrus)', latexCode: '\\det(A) = aei + bfg + cdh - ceg - bdi - afh', subtopicId: detSubtopic.id, description: 'Soma dos produtos das diagonais principais menos as secundárias' },
    { name: 'Matriz Inversa 2x2', latexCode: 'A^{-1} = \\frac{1}{\\det(A)} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}', subtopicId: matSubtopic.id, description: 'Inversa de matriz de ordem 2' },
    { name: 'Matriz Transposta', latexCode: '(A^T)_{ij} = A_{ji}', subtopicId: matSubtopic.id, description: 'Troca de linhas por colunas' },
    { name: 'Regra de Cramer', latexCode: 'x_i = \\frac{D_{x_i}}{D}', subtopicId: detSubtopic.id, description: 'Solução de sistemas lineares usando determinantes' },
    { name: 'Função Horária da Velocidade (MRUV)', latexCode: 'v = v_0 + at', subtopicId: physSubtopic.id, description: 'Velocidade em função do tempo' },
    { name: 'Função Horária da Posição (MRUV)', latexCode: 's = s_0 + v_0 t + \\frac{1}{2}at^2', subtopicId: physSubtopic.id, description: 'Posição em função do tempo' },
    { name: 'Equação de Torricelli', latexCode: 'v^2 = v_0^2 + 2a\\Delta s', subtopicId: physSubtopic.id, description: 'Relação sem dependência direta do tempo' },
    { name: '2ª Lei de Newton', latexCode: 'F = m \\cdot a', subtopicId: physSubtopic.id, description: 'Princípio fundamental da dinâmica' },
    { name: 'Energia Cinética', latexCode: 'E_c = \\frac{1}{2}mv^2', subtopicId: physSubtopic.id, description: 'Energia do movimento' },
    { name: 'Equação dos Gases Ideais', latexCode: 'P \\cdot V = n \\cdot R \\cdot T', subtopicId: chemSubtopic.id, description: 'Equação de estado de Clapeyron' },
    { name: 'Densidade Absoluta', latexCode: 'd = \\frac{m}{V}', subtopicId: chemSubtopic.id, description: 'Massa por unidade de volume' },
    { name: 'Massa Molar / Quantidade de Matéria', latexCode: 'n = \\frac{m}{M}', subtopicId: chemSubtopic.id, description: 'Número de mols em uma amostra' }
  ]

  await prisma.formula.createMany({ data: formulasData })

  // 8. EXERCISES & QUESTION BANK (100+)
  for (let i = 1; i <= 20; i++) {
    const diff: DifficultyLevel = i <= 6 ? 'EASY' : i <= 14 ? 'MEDIUM' : 'HARD'
    await prisma.questionBank.create({
      data: {
        subjectId: math.id,
        statement: `(ENEM/Vestibular ${2020 + (i % 6)}) Calcule o determinante da matriz correspondente aos custos da empresa no setor ${i}.`,
        type: ExerciseType.MULTIPLE_CHOICE,
        difficulty: diff,
        options: [`A) ${i * 7}`, `B) ${i * 7 + 5}`, `C) ${i * 7 - 3}`, `D) ${i * 10}`, `E) 0`],
        correctAnswer: 'A',
        explanation: `Resolução: Aplicando a regra do determinante encontramos ${i * 7}.`
      }
    })
  }

  // 9. FOLDERS & FILES WITH VERSIONS
  const rootFolder = await prisma.folder.create({
    data: { name: 'Meu Repositório', teacherId: teacher1.id }
  })
  const matFolder = await prisma.folder.create({
    data: { name: 'Matemática', parentId: rootFolder.id, teacherId: teacher1.id }
  })
  const provasFolder = await prisma.folder.create({
    data: { name: 'Provas e Avaliações', parentId: matFolder.id, teacherId: teacher1.id }
  })
  const slidesFolder = await prisma.folder.create({
    data: { name: 'Slides de Aula', parentId: matFolder.id, teacherId: teacher1.id }
  })

  const provaFile = await prisma.file.create({
    data: {
      name: 'Prova_Bimestral_Matrizes.docx',
      folderId: provasFolder.id,
      size: 245000,
      type: FileType.DOCX,
      url: '/uploads/Prova_Bimestral_Matrizes.docx',
      versions: {
        create: [
          { version: 1, url: '/uploads/Prova_Bimestral_Matrizes_v1.docx' },
          { version: 2, url: '/uploads/Prova_Bimestral_Matrizes_v2.docx' },
          { version: 3, url: '/uploads/Prova_Bimestral_Matrizes_FINAL.docx' },
        ]
      }
    }
  })

  // 10. PRESENTATIONS WITH SLIDES
  await prisma.presentation.create({
    data: {
      title: 'Aula de Matrizes e Determinantes',
      teacherId: teacher1.id,
      slides: {
        create: [
          { order: 1, type: SlideType.TITLE, content: { title: 'Matrizes e Determinantes', subtitle: 'Prof. Carlos Santos • 2º Ano A' } },
          { order: 2, type: SlideType.CONTENT, content: { title: 'Introdução às Matrizes', body: 'Uma matriz é uma estrutura de tabela com m linhas e n colunas, muito utilizada em inteligência artificial e computação gráfica.' } },
          { order: 3, type: SlideType.FORMULA, content: { title: 'Regra de Sarrus (3x3)', latex: '\\det(A) = aei + bfg + cdh - ceg - bdi - afh', explanation: 'Multiplique as diagonais principais e subtraia os produtos das secundárias.' } },
          { order: 4, type: SlideType.EXERCISE, content: { title: 'Exercício em Sala', statement: 'Calcule o determinante da matriz [[2, 4], [1, 3]].' } },
          { order: 5, type: SlideType.RESOLUTION, content: { title: 'Resolução Passo a Passo', steps: ['1. Multiplicar 2 * 3 = 6', '2. Multiplicar 4 * 1 = 4', '3. Subtrair: 6 - 4 = 2'] } },
          { order: 6, type: SlideType.SUMMARY, content: { title: 'Resumo e Tarefa de Casa', points: ['Fixar operações de matriz', 'Treinar Sarrus para ordem 3', 'Resolver exercícios 1 a 5 da página 50'] } }
        ]
      }
    }
  })

  // 11. LESSON PLANS
  await prisma.lessonPlan.create({
    data: {
      teacherId: teacher1.id,
      title: 'Plano Semanal: Álgebra Linear e Matrizes',
      date: new Date('2026-08-25'),
      content: JSON.stringify({
        subject: 'Matemática',
        class: '2º Ano A',
        duration: 100,
        objective: 'Dominar operações matriciais e resolução de sistemas lineares.',
        introduction: 'Demonstração de matrizes em redes neurais e processamento digital.',
        theory: 'Definição formal, determinante e propriedades.',
        examples: 'Exemplos resolvidos passo a passo.',
        exercises: 'Lista de 10 exercícios.',
        resolution: 'Correção comentada com o Resolvedor Universal.',
        activity: 'Trabalho em duplas.',
        review: 'Síntese conceitual.'
      })
    }
  })

  // 12. LESSONS, ATTENDANCE & GRADES
  const sampleLesson = await prisma.lesson.create({
    data: {
      classId: classes[2].id, // 2º Ano A
      subjectId: math.id,
      title: 'Matrizes - Operações e Determinantes',
      date: new Date('2026-08-25T08:00:00'),
      duration: 100,
      content: 'Aula teórica e prática com projetor e lousa digital.'
    }
  })

  // Record Attendance and Grades for students in class
  const classStudents = await prisma.classStudent.findMany({
    where: { classId: classes[2].id },
    include: { student: true }
  })

  for (const cs of classStudents) {
    await prisma.attendance.create({
      data: {
        lessonId: sampleLesson.id,
        studentId: cs.studentId,
        status: AttendanceStatus.PRESENT
      }
    })

    await prisma.grade.create({
      data: {
        studentId: cs.studentId,
        term: '1º Bimestre',
        value: 7.5 + Math.random() * 2.5,
        comments: 'Excelente participação e rendimento.'
      }
    })
  }

  console.log('✅ Seed completed successfully with full realistic ERP data!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
