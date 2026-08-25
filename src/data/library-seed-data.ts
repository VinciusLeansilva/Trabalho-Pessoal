export const SUBJECTS = [
  { id: 'matematica', name: 'Matemática', color: 'blue', icon: 'Sigma', topics: 45, exercises: 1250 },
  { id: 'fisica', name: 'Física', color: 'purple', icon: 'Atom', topics: 38, exercises: 980 },
  { id: 'quimica', name: 'Química', color: 'green', icon: 'FlaskConical', topics: 42, exercises: 1050 },
  { id: 'portugues', name: 'Português', color: 'red', icon: 'BookOpen', topics: 50, exercises: 1500 },
  { id: 'historia', name: 'História', color: 'amber', icon: 'Landmark', topics: 30, exercises: 800 },
  { id: 'geografia', name: 'Geografia', color: 'teal', icon: 'Globe', topics: 28, exercises: 750 },
  { id: 'biologia', name: 'Biologia', color: 'emerald', icon: 'Leaf', topics: 35, exercises: 900 },
  { id: 'ingles', name: 'Inglês', color: 'blue', icon: 'Languages', topics: 25, exercises: 600 },
];

export const TOPICS_BY_SUBJECT = {
  matematica: [
    { id: 'matrizes', name: 'Matrizes', subtopics: ['Definição', 'Operações', 'Determinantes', 'Sistemas Lineares'], formulas: 12, exercises: 85 },
    { id: 'funcoes', name: 'Funções', subtopics: ['1º Grau', '2º Grau', 'Exponencial', 'Logarítmica'], formulas: 8, exercises: 120 },
    { id: 'geometria', name: 'Geometria Plana', subtopics: ['Áreas', 'Polígonos', 'Círculos'], formulas: 25, exercises: 150 },
  ]
};

export const MATRIZES_CONTENT = {
  theory: [
    "Matriz é uma tabela organizada em linhas e colunas no formato m x n, onde m representa o número de linhas (horizontal) e n o número de colunas (vertical).",
    "A função das matrizes é facilitar a resolução de problemas complexos, operando como uma estrutura matemática simplificada.",
    "Os elementos de uma matriz são geralmente representados por uma letra minúscula seguida de dois índices i e j que indicam a linha e a coluna, respectivamente: a_ij."
  ],
  formulas: [
    { id: 'f1', name: 'Adição de Matrizes', latex: 'A + B = [a_{ij} + b_{ij}]', variables: [{ name: 'A, B', desc: 'Matrizes de mesma ordem' }, { name: 'a_{ij}, b_{ij}', desc: 'Elementos correspondentes' }] },
    { id: 'f2', name: 'Multiplicação por Escalar', latex: 'k \\cdot A = [k \\cdot a_{ij}]', variables: [{ name: 'k', desc: 'Número real escalar' }, { name: 'A', desc: 'Matriz' }] },
    { id: 'f3', name: 'Matriz Transposta', latex: 'A^T = [a_{ji}]', variables: [{ name: 'A^T', desc: 'Matriz transposta' }, { name: 'a_{ji}', desc: 'Elementos com índices invertidos' }] },
    { id: 'f4', name: 'Determinante (2x2)', latex: '\\det(A) = a_{11}a_{22} - a_{12}a_{21}', variables: [{ name: 'a_{ij}', desc: 'Elementos da matriz' }] },
    { id: 'f5', name: 'Matriz Inversa', latex: 'A \\cdot A^{-1} = I', variables: [{ name: 'A^{-1}', desc: 'Matriz inversa' }, { name: 'I', desc: 'Matriz identidade' }] }
  ],
  examples: [
    { id: 'ex1', title: 'Soma de Matrizes 2x2', content: 'Dadas as matrizes A e B, encontre A+B.' },
    { id: 'ex2', title: 'Produto de Matrizes', content: 'Calcule o produto de A (2x3) por B (3x2).' },
    { id: 'ex3', title: 'Cálculo de Determinante', content: 'Encontre o determinante da matriz C 3x3 usando a Regra de Sarrus.' },
    { id: 'ex4', title: 'Matriz Inversa', content: 'Determine a inversa da matriz D.' },
    { id: 'ex5', title: 'Sistema Linear', content: 'Resolva o sistema linear associado à matriz.' }
  ],
  exercises: [
    { id: 'q1', difficulty: 'Fácil', text: 'Calcule a soma das matrizes A e B.' },
    { id: 'q2', difficulty: 'Fácil', text: 'Encontre a transposta da matriz C.' },
    { id: 'q3', difficulty: 'Médio', text: 'Multiplique as matrizes D e E.' },
    { id: 'q4', difficulty: 'Médio', text: 'Calcule o determinante da matriz 3x3.' },
    { id: 'q5', difficulty: 'Médio', text: 'Verifique se as matrizes são inversas.' },
    { id: 'q6', difficulty: 'Difícil', text: 'Resolva o sistema usando a regra de Cramer.' },
    { id: 'q7', difficulty: 'Difícil', text: 'Mostre que det(A*B) = det(A)*det(B).' },
    { id: 'q8', difficulty: 'Fácil', text: 'Qual o valor do elemento a_23?' },
    { id: 'q9', difficulty: 'Médio', text: 'Determine x para que o determinante seja 0.' },
    { id: 'q10', difficulty: 'Difícil', text: 'Calcule a matriz inversa de F.' }
  ]
};
