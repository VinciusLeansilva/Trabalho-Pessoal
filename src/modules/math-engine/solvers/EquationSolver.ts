import { SolverResult, Step } from '../types';
import { formatNumber } from '../utils';

export interface LinearEquationResult {
  x: number;
  equationString: string;
}

export interface QuadraticEquationResult {
  delta: number;
  roots: number[] | { real: number; imag: number }[];
  isComplex: boolean;
  vertex: { x: number; y: number };
  equationString: string;
}

export class EquationSolver {
  /**
   * Solve linear equation of form: ax + b = c
   */
  public solveLinear(a: number, b: number, c: number = 0): SolverResult<LinearEquationResult> {
    const steps: Step[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    const eqStr = `${a}x + (${b}) = ${c}`;

    if (a === 0) {
      if (b === c) {
        warnings.push('A equação possui infinitas soluções (Identidade: ' + b + ' = ' + c + ').');
      } else {
        errors.push('A equação não possui solução (Impossível: ' + b + ' ≠ ' + c + ').');
      }
      return {
        input: { a, b, c },
        steps: [
          {
            stepNumber: 1,
            title: 'Verificação do Coeficiente Linear',
            description: `O coeficiente 'a' é igual a 0.`,
            calculation: `0x + (${b}) = ${c}`,
            highlightedElements: [],
            currentState: { a, b, c }
          }
        ],
        result: { x: NaN, equationString: eqStr },
        errors,
        warnings
      };
    }

    steps.push({
      stepNumber: 1,
      title: 'Identificação dos Termos',
      description: `Equação inicial: ${a}x + (${b}) = ${c}. Isolando os termos com a incógnita.`,
      formula: 'ax + b = c',
      calculation: `${a}x + (${b}) = ${c}`,
      highlightedElements: [],
      currentState: { a, b, c }
    });

    const rightSide = c - b;
    steps.push({
      stepNumber: 2,
      title: 'Transposição de Termos Independentes',
      description: `Subtrair (${b}) de ambos os lados da igualdade.`,
      formula: 'ax = c - b',
      calculation: `${a}x = ${c} - (${b}) \\Rightarrow ${a}x = ${rightSide}`,
      highlightedElements: [],
      currentState: { a, rightSide }
    });

    const x = rightSide / a;
    steps.push({
      stepNumber: 3,
      title: 'Isolamento da Incógnita x',
      description: `Dividir ambos os membros pelo coeficiente a = ${a}.`,
      formula: 'x = \\frac{c - b}{a}',
      calculation: `x = \\frac{${rightSide}}{${a}} = ${formatNumber(x)}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { x }
    });

    // Verification
    const check = a * x + b;
    const verification = `Verificação: ${a}(${formatNumber(x)}) + (${b}) = ${formatNumber(check)} (Esperado: ${c})`;

    return {
      input: { a, b, c },
      steps,
      result: { x, equationString: eqStr },
      verification,
      errors: [],
      warnings: []
    };
  }

  /**
   * Solve quadratic equation: ax^2 + bx + c = 0
   */
  public solveQuadratic(a: number, b: number, c: number): SolverResult<QuadraticEquationResult> {
    const steps: Step[] = [];
    const errors: string[] = [];

    if (a === 0) {
      errors.push("O coeficiente 'a' não pode ser zero em uma equação de 2º grau.");
      return {
        input: { a, b, c },
        steps: [],
        result: {
          delta: 0,
          roots: [],
          isComplex: false,
          vertex: { x: 0, y: 0 },
          equationString: `${b}x + (${c}) = 0`
        },
        errors,
        warnings: []
      };
    }

    const eqStr = `${a}x² + (${b})x + (${c}) = 0`;

    // Step 1: Identify coefficients
    steps.push({
      stepNumber: 1,
      title: 'Identificação dos Coeficientes',
      description: `Equação na forma padrão ax² + bx + c = 0.`,
      formula: 'ax^2 + bx + c = 0',
      calculation: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
      highlightedElements: [],
      currentState: { a, b, c }
    });

    // Step 2: Calculate Discriminant (Delta)
    const delta = b * b - 4 * a * c;
    steps.push({
      stepNumber: 2,
      title: 'Cálculo do Discriminante (Δ)',
      description: 'Calcular o discriminante delta pela fórmula Δ = b² - 4ac.',
      formula: '\\Delta = b^2 - 4ac',
      calculation: `\\Delta = (${b})^2 - 4 \\cdot (${a}) \\cdot (${c}) = ${b * b} - (${4 * a * c}) = ${delta}`,
      highlightedElements: [{ row: 0, col: 0, type: 'operation' }],
      currentState: { delta }
    });

    // Step 3: Vertex calculation
    const xv = -b / (2 * a);
    const yv = -delta / (4 * a);
    steps.push({
      stepNumber: 3,
      title: 'Vértice da Parábola',
      description: `O vértice V(xv, yv) indica o ponto de ${a > 0 ? 'mínimo' : 'máximo'} da função.`,
      formula: 'x_v = -\\frac{b}{2a}, \\quad y_v = -\\frac{\\Delta}{4a}',
      calculation: `x_v = -\\frac{${b}}{2 \\cdot ${a}} = ${formatNumber(xv)}, \\quad y_v = -\\frac{${delta}}{4 \\cdot ${a}} = ${formatNumber(yv)}`,
      highlightedElements: [],
      currentState: { vertex: { x: xv, y: yv } }
    });

    if (delta > 0) {
      const sqrtDelta = Math.sqrt(delta);
      const x1 = (-b + sqrtDelta) / (2 * a);
      const x2 = (-b - sqrtDelta) / (2 * a);

      steps.push({
        stepNumber: 4,
        title: 'Fórmula de Bhaskara (Δ > 0)',
        description: 'Como Δ > 0, a equação possui duas raízes reais distintas.',
        formula: 'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}',
        calculation: `x = \\frac{-(${b}) \\pm \\sqrt{${delta}}}{2 \\cdot (${a})} = \\frac{${-b} \\pm ${formatNumber(sqrtDelta)}}{${2 * a}}`,
        highlightedElements: [],
        currentState: { delta, sqrtDelta }
      });

      steps.push({
        stepNumber: 5,
        title: 'Cálculo das Raízes',
        description: 'Separando as operações de adição e subtração.',
        calculation: `x_1 = \\frac{${-b} + ${formatNumber(sqrtDelta)}}{${2 * a}} = ${formatNumber(x1)}, \\quad x_2 = \\frac{${-b} - ${formatNumber(sqrtDelta)}}{${2 * a}} = ${formatNumber(x2)}`,
        highlightedElements: [
          { row: 0, col: 0, type: 'result' },
          { row: 0, col: 1, type: 'result' }
        ],
        currentState: { roots: [x1, x2] }
      });

      const verification = `Verificação: f(${formatNumber(x1)}) = 0 e f(${formatNumber(x2)}) = 0`;

      return {
        input: { a, b, c },
        steps,
        result: {
          delta,
          roots: [x1, x2],
          isComplex: false,
          vertex: { x: xv, y: yv },
          equationString: eqStr
        },
        verification,
        errors: [],
        warnings: []
      };
    } else if (delta === 0) {
      const x0 = -b / (2 * a);

      steps.push({
        stepNumber: 4,
        title: 'Fórmula de Bhaskara (Δ = 0)',
        description: 'Como Δ = 0, a equação possui uma única raiz real dupla.',
        formula: 'x = -\\frac{b}{2a}',
        calculation: `x = -\\frac{${b}}{2 \\cdot ${a}} = ${formatNumber(x0)}`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { roots: [x0] }
      });

      return {
        input: { a, b, c },
        steps,
        result: {
          delta,
          roots: [x0],
          isComplex: false,
          vertex: { x: xv, y: yv },
          equationString: eqStr
        },
        verification: `Verificação: f(${formatNumber(x0)}) = 0`,
        errors: [],
        warnings: []
      };
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-delta) / (2 * a);

      steps.push({
        stepNumber: 4,
        title: 'Raízes Complexas (Δ < 0)',
        description: 'Como Δ < 0, a equação não possui raízes reais, mas sim duas raízes complexas conjugadas.',
        formula: 'x = \\frac{-b \\pm i\\sqrt{|\\Delta|}}{2a}',
        calculation: `x = ${formatNumber(realPart)} \\pm ${formatNumber(Math.abs(imagPart))}i`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { realPart, imagPart }
      });

      return {
        input: { a, b, c },
        steps,
        result: {
          delta,
          roots: [
            { real: realPart, imag: imagPart },
            { real: realPart, imag: -imagPart }
          ],
          isComplex: true,
          vertex: { x: xv, y: yv },
          equationString: eqStr
        },
        errors: [],
        warnings: ['A equação não intercepta o eixo X no plano real.']
      };
    }
  }
}
