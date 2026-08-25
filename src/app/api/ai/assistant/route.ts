import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { prompt, actionType, context } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const lower = prompt.toLowerCase()
    let responseText = ''
    let structuredData: any = null
    let suggestedAction = ''

    if (lower.includes('aula') || actionType === 'lesson_plan') {
      suggestedAction = 'insert_lesson_plan'
      structuredData = {
        title: 'Plano de Aula: ' + (lower.includes('matriz') ? 'Matrizes e Determinantes' : 'Conceitos Fundamentais'),
        subject: lower.includes('física') ? 'Física' : 'Matemática',
        duration: 100,
        objective: 'Desenvolver a compreensão teórica e capacidade de resolução prática dos alunos sobre o tema.',
        introduction: 'Contextualização no cotidiano, motivação com aplicações reais em computação gráfica e engenharia.',
        theory: 'Definição formal dos conceitos, propriedades matemáticas, notação matemática padrão e teoremas aplicáveis.',
        examples: 'Exemplo prático 1 resolvido detalhadamente no quadro com marcações de destaque.',
        exercises: '3 exercícios graduados: Fácil (fixação), Médio (compreensão), Difícil (desafio estilo ENEM).',
        resolution: 'Passo a passo minucioso com alertas de erros comuns cometidos por alunos.',
        activity: 'Lista individual para consolidação e entrega na próxima semana.',
        review: 'Síntese em 3 pontos-chave e mapa mental do conteúdo.'
      }
      responseText = `### 📋 Plano de Aula Gerado com Sucesso!\n\n**Título:** ${structuredData.title}\n**Duração:** ${structuredData.duration} minutos\n\n**1. Objetivo Pedagógico:**\n${structuredData.objective}\n\n**2. Introdução & Motivação:**\n${structuredData.introduction}\n\n**3. Teoria Principal:**\n${structuredData.theory}\n\n**4. Exemplos Guiados:**\n${structuredData.examples}\n\n**5. Exercícios em Sala:**\n${structuredData.exercises}\n\n*Clique no botão abaixo para transferir esta estrutura diretamente para o Criador de Aulas.*`
    } else if (lower.includes('exercício') || lower.includes('questões') || actionType === 'exercises') {
      suggestedAction = 'save_question_bank'
      structuredData = [
        {
          statement: 'Calcule o valor do determinante da matriz $M = \\begin{pmatrix} 2 & 3 \\\\ 1 & 4 \\end{pmatrix}$.',
          type: 'MULTIPLE_CHOICE',
          difficulty: 'EASY',
          options: ['A) 5', 'B) 8', 'C) 11', 'D) 2', 'E) -5'],
          correctAnswer: 'A',
          explanation: 'det(M) = (2 * 4) - (3 * 1) = 8 - 3 = 5.'
        },
        {
          statement: 'Um móvel em MRUV parte do repouso com $a = 3\\text{ m/s}^2$. Qual a sua velocidade após $4\\text{ s}$?',
          type: 'MULTIPLE_CHOICE',
          difficulty: 'MEDIUM',
          options: ['A) 7 m/s', 'B) 12 m/s', 'C) 18 m/s', 'D) 24 m/s', 'E) 36 m/s'],
          correctAnswer: 'B',
          explanation: 'v = v0 + at = 0 + (3)(4) = 12 m/s.'
        }
      ]
      responseText = `### 📝 Questões Geradas com Gabarito e Resolução:\n\n**Questão 1 (Fácil):**\n${structuredData[0].statement}\n- **Gabarito:** ${structuredData[0].correctAnswer}\n- **Resolução:** ${structuredData[0].explanation}\n\n**Questão 2 (Média):**\n${structuredData[1].statement}\n- **Gabarito:** ${structuredData[1].correctAnswer}\n- **Resolução:** ${structuredData[1].explanation}\n\n*Você pode adicionar estas questões diretamente ao Banco de Questões ou a uma Atividade.*`
    } else if (lower.includes('slide') || actionType === 'slides') {
      suggestedAction = 'create_presentation'
      structuredData = {
        title: 'Apresentação: ' + (prompt.slice(0, 30)),
        slides: [
          { order: 1, type: 'TITLE', content: { title: 'Matrizes e Aplicações', subtitle: 'Prof. ' + (session.user.name || 'Vinícius') } },
          { order: 2, type: 'CONTENT', content: { title: 'O que é uma Matriz?', body: 'Uma matriz é uma tabela organizada em linhas e colunas de elementos matemáticos.' } },
          { order: 3, type: 'FORMULA', content: { title: 'Determinante 2x2', latex: '\\det(A) = ad - bc', explanation: 'Produto da diagonal principal menos produto da diagonal secundária.' } },
          { order: 4, type: 'EXERCISE', content: { title: 'Exercício Prático', statement: 'Calcule o determinante de [[2, 1], [4, 5]].' } },
          { order: 5, type: 'SUMMARY', content: { title: 'Resumo da Aula', points: ['Identificação de ordem m x n', 'Cálculo de determinante', 'Aplicações práticas'] } }
        ]
      }
      responseText = `### 📽️ Slides Estruturados Gerados:\n\n1. **Slide 1:** Capa da Apresentação\n2. **Slide 2:** Conceituação Teórica\n3. **Slide 3:** Fórmula com KaTeX\n4. **Slide 4:** Exercício Interativo para Sala\n5. **Slide 5:** Resumo e Conclusão\n\n*Clique no botão abaixo para abrir no Editor de Slides ou iniciar no Modo Projetor.*`
    } else if (lower.includes('prova') || actionType === 'assessment') {
      suggestedAction = 'create_assessment'
      responseText = `### 📑 Prova Bimestral Estruturada:\n\n**Instituição:** Colégio EduMatrix\n**Disciplina:** Matemática | **Trimestre:** 2º Bimestre\n\n**Instruções aos Alunos:**\n- Duração: 90 minutos.\n- Justifique todos os cálculos.\n\n**Questão 1 (2,5 pts):** Defina matriz transposta e calcule $A^T$ para $A = [[1, 2, 3], [4, 5, 6]]$.\n**Questão 2 (2,5 pts):** Calcule o determinante pela Regra de Sarrus de uma matriz 3x3.\n**Questão 3 (2,5 pts):** Resolva o sistema linear 2x2 pela Regra de Cramer.\n**Questão 4 (2,5 pts):** Situação-problema aplicada à economia.`
    } else {
      suggestedAction = 'general_help'
      responseText = `### 💡 Assistente Pedagógico EduMatrix\n\nAnalisando sua solicitação: *"${prompt}"*\n\n**Orientações Pedagógicas:**\n1. **Abordagem sugerida:** Iniciar com exemplos concretos e visuais antes de formalizar as deduções algébricas.\n2. **Ponto de atenção:** Alunos frequentemente esquecem a regra de sinais nas diagonais secundárias e na multiplicação de fatores negativos.\n3. **Dica didática:** Utilize o **Modo Lousa / Blackboard** para desenhar esquemas passo a passo durante a explicação.\n\nComo posso ajudá-lo a avançar com este material?`
    }

    return NextResponse.json({
      text: responseText,
      structuredData,
      suggestedAction,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('[AI_ASSISTANT_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
