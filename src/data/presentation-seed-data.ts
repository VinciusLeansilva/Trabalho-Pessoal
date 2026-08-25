export type SlideType = 'TITLE' | 'CONTENT' | 'FORMULA' | 'EXERCISE' | 'RESOLUTION' | 'EXAMPLE' | 'SUMMARY';

export interface Slide {
  id: string;
  type: SlideType;
  title?: string;
  subtitle?: string;
  content?: string;
  formula?: string;
  description?: string;
  matrix?: number[][];
  problem?: string;
  steps?: string[];
  points?: string[];
  background?: string;
}

export interface Presentation {
  id: string;
  title: string;
  subject: string;
  lastModified: string;
  tags: string[];
  slides: Slide[];
}

export const SAMPLE_PRESENTATIONS: Presentation[] = [
  {
    id: '1',
    title: 'Aula de Matrizes e Determinantes',
    subject: 'Matemática',
    lastModified: '2026-08-24T10:00:00Z',
    tags: ['Álgebra Linear', 'Ensino Médio'],
    slides: [
      { id: 's1', type: 'TITLE', title: 'MATRIZES E DETERMINANTES', subtitle: 'Prof. Carlos Santos • 2º Ano A', background: '#3B82F6' },
      { id: 's2', type: 'CONTENT', title: 'O que é uma Matriz?', content: 'Uma matriz é uma tabela retangular de números dispostos em linhas e colunas, essencial em inteligência artificial e computação gráfica.' },
      { id: 's3', type: 'FORMULA', title: 'Determinante 2x2', formula: '\\det(A) = ad - bc', description: 'Produto da diagonal principal menos produto da diagonal secundária' },
      { id: 's4', type: 'EXAMPLE', title: 'Exemplo Prático', content: 'Calcule o determinante da matriz 2x2:', matrix: [[2, 3], [1, 4]] },
      { id: 's5', type: 'EXERCISE', title: 'Exercício em Sala', problem: 'Calcule o determinante de A = [[3, 5], [2, 7]]' },
      { id: 's6', type: 'RESOLUTION', title: 'Resolução Passo a Passo', steps: ['det(A) = (3 * 7) - (5 * 2)', 'det(A) = 21 - 10', 'det(A) = 11'] },
      { id: 's7', type: 'SUMMARY', title: 'Resumo da Aula', points: ['Identificação de ordem m x n', 'Cálculo de determinante 2x2 e 3x3', 'Aplicação prática em sistemas lineares'] },
    ]
  },
  {
    id: '2',
    title: 'Funções Quadráticas e Parábolas',
    subject: 'Matemática',
    lastModified: '2026-08-25T14:30:00Z',
    tags: ['Álgebra', 'Gráficos', 'Bhaskara'],
    slides: [
      { id: 's1', type: 'TITLE', title: 'FUNÇÕES QUADRÁTICAS', subtitle: 'Parábolas, Vértices e Raízes', background: '#10B981' },
      { id: 's2', type: 'FORMULA', title: 'Fórmula de Bhaskara', formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', description: 'Cálculo das raízes reais da equação' },
    ]
  },
  {
    id: '3',
    title: 'Leis de Newton e Dinâmica',
    subject: 'Física',
    lastModified: '2026-08-26T09:15:00Z',
    tags: ['Mecânica', 'Dinâmica', '1º Ano'],
    slides: [
      { id: 's1', type: 'TITLE', title: 'LEIS DE NEWTON', subtitle: 'Dinâmica Clássica', background: '#F59E0B' },
      { id: 's2', type: 'CONTENT', title: '1ª Lei: Princípio da Inércia', content: 'Todo corpo permanece em seu estado de repouso ou de movimento retilíneo uniforme a menos que seja compelido a mudar...' },
      { id: 's3', type: 'FORMULA', title: '2ª Lei: Princípio Fundamental', formula: 'F_{\\text{res}} = m \\cdot a', description: 'Força = massa × aceleração' },
    ]
  },
  {
    id: '4',
    title: 'Gases Ideais e Termodinâmica',
    subject: 'Química',
    lastModified: '2026-08-20T11:45:00Z',
    tags: ['Físico-Química', 'Clapeyron'],
    slides: [
      { id: 's1', type: 'TITLE', title: 'GASES IDEAIS', subtitle: 'Equação de Clapeyron', background: '#EF4444' },
      { id: 's2', type: 'FORMULA', title: 'Equação de Estado', formula: 'P \\cdot V = n \\cdot R \\cdot T', description: 'R = 0,082 atm·L/(mol·K)' },
    ]
  }
];

export const DEMO_PRESENTATIONS = SAMPLE_PRESENTATIONS;
