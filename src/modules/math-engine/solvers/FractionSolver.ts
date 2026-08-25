import { Fraction, SolverResult, Step } from '../types';
import { gcd, lcm, formatNumber } from '../utils';

export interface FractionOperationResult {
  raw: Fraction;
  simplified: Fraction;
  decimal: number;
  latex: string;
}

export class FractionSolver {
  public simplify(f: Fraction): SolverResult<FractionOperationResult> {
    const steps: Step[] = [];
    const errors: string[] = [];

    if (f.denominator === 0) {
      errors.push('O denominador não pode ser zero.');
      return {
        input: f,
        steps: [],
        result: { raw: f, simplified: f, decimal: NaN, latex: '\\text{Indefinido}' },
        errors,
        warnings: []
      };
    }

    const divisor = gcd(f.numerator, f.denominator);
    const simpNum = (f.denominator < 0 ? -f.numerator : f.numerator) / divisor;
    const simpDen = Math.abs(f.denominator) / divisor;

    steps.push({
      stepNumber: 1,
      title: 'Fração Original',
      description: `Fração dada: ${f.numerator}/${f.denominator}.`,
      formula: '\\frac{a}{b}',
      calculation: `\\frac{${f.numerator}}{${f.denominator}}`,
      highlightedElements: [],
      currentState: f
    });

    steps.push({
      stepNumber: 2,
      title: 'Cálculo do Máximo Divisor Comum (MDC)',
      description: `O MDC entre o numerador (${f.numerator}) e denominador (${f.denominator}) é ${divisor}.`,
      formula: '\\text{MDC}(a, b)',
      calculation: `\\text{MDC}(|${f.numerator}|, |${f.denominator}|) = ${divisor}`,
      highlightedElements: [{ row: 0, col: 0, type: 'operation' }],
      currentState: { divisor }
    });

    steps.push({
      stepNumber: 3,
      title: 'Simplificação da Fração',
      description: `Dividir o numerador e o denominador por ${divisor}.`,
      calculation: `\\frac{${f.numerator} \\div ${divisor}}{${f.denominator} \\div ${divisor}} = \\frac{${simpNum}}{${simpDen}}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { simplified: { numerator: simpNum, denominator: simpDen } }
    });

    const decimal = simpNum / simpDen;
    const latex = `\\frac{${simpNum}}{${simpDen}}`;

    return {
      input: f,
      steps,
      result: {
        raw: f,
        simplified: { numerator: simpNum, denominator: simpDen },
        decimal,
        latex
      },
      verification: `Equivalência: ${f.numerator}/${f.denominator} = ${formatNumber(decimal)}`,
      errors: [],
      warnings: []
    };
  }

  public add(a: Fraction, b: Fraction): SolverResult<FractionOperationResult> {
    return this._addSubtract(a, b, true);
  }

  public subtract(a: Fraction, b: Fraction): SolverResult<FractionOperationResult> {
    return this._addSubtract(a, b, false);
  }

  private _addSubtract(a: Fraction, b: Fraction, isAddition: boolean): SolverResult<FractionOperationResult> {
    const steps: Step[] = [];
    const errors: string[] = [];
    const opSym = isAddition ? '+' : '-';
    const opName = isAddition ? 'Soma' : 'Subtração';

    if (a.denominator === 0 || b.denominator === 0) {
      errors.push('Denominador zero detectado.');
      return {
        input: { a, b },
        steps: [],
        result: { raw: { numerator: 0, denominator: 1 }, simplified: { numerator: 0, denominator: 1 }, decimal: 0, latex: '' },
        errors,
        warnings: []
      };
    }

    steps.push({
      stepNumber: 1,
      title: 'Identificar Operação e Denominadores',
      description: `${opName} entre \\frac{${a.numerator}}{${a.denominator}} ${opSym} \\frac{${b.numerator}}{${b.denominator}}.`,
      calculation: `\\frac{${a.numerator}}{${a.denominator}} ${opSym} \\frac{${b.numerator}}{${b.denominator}}`,
      highlightedElements: [],
      currentState: { a, b }
    });

    let commonDen: number;
    let newNumA: number;
    let newNumB: number;

    if (a.denominator === b.denominator) {
      commonDen = a.denominator;
      newNumA = a.numerator;
      newNumB = b.numerator;
      steps.push({
        stepNumber: 2,
        title: 'Denominadores Iguais',
        description: 'Os denominadores já são iguais, basta operar os numeradores.',
        calculation: `\\text{Denominador Comum} = ${commonDen}`,
        highlightedElements: [],
        currentState: { commonDen }
      });
    } else {
      commonDen = lcm(a.denominator, b.denominator);
      newNumA = a.numerator * (commonDen / a.denominator);
      newNumB = b.numerator * (commonDen / b.denominator);

      steps.push({
        stepNumber: 2,
        title: 'Cálculo do Mínimo Múltiplo Comum (MMC)',
        description: `MMC dos denominadores ${a.denominator} e ${b.denominator} é ${commonDen}.`,
        formula: '\\text{MMC}(d_1, d_2)',
        calculation: `\\text{MMC}(${a.denominator}, ${b.denominator}) = ${commonDen}`,
        highlightedElements: [{ row: 0, col: 0, type: 'operation' }],
        currentState: { commonDen }
      });

      steps.push({
        stepNumber: 3,
        title: 'Equivalência de Frações',
        description: 'Multiplicar numeradores pelos fatores correspondentes.',
        calculation: `\\frac{${newNumA}}{${commonDen}} ${opSym} \\frac{${newNumB}}{${commonDen}}`,
        highlightedElements: [],
        currentState: { newNumA, newNumB, commonDen }
      });
    }

    const rawNum = isAddition ? newNumA + newNumB : newNumA - newNumB;
    const rawDen = commonDen;

    steps.push({
      stepNumber: steps.length + 1,
      title: 'Operação dos Numeradores',
      description: `Efetuar ${newNumA} ${opSym} ${newNumB}.`,
      calculation: `\\frac{${newNumA} ${opSym} ${newNumB}}{${commonDen}} = \\frac{${rawNum}}{${commonDen}}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { rawNum, rawDen }
    });

    const divisor = gcd(rawNum, rawDen);
    const simpNum = rawNum / divisor;
    const simpDen = rawDen / divisor;

    if (divisor > 1) {
      steps.push({
        stepNumber: steps.length + 1,
        title: 'Simplificação Final (MDC)',
        description: `Dividir numerador e denominador por ${divisor}.`,
        calculation: `\\frac{${rawNum} \\div ${divisor}}{${rawDen} \\div ${divisor}} = \\frac{${simpNum}}{${simpDen}}`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { simpNum, simpDen }
      });
    }

    const decimal = simpNum / simpDen;

    return {
      input: { a, b, isAddition },
      steps,
      result: {
        raw: { numerator: rawNum, denominator: rawDen },
        simplified: { numerator: simpNum, denominator: simpDen },
        decimal,
        latex: `\\frac{${simpNum}}{${simpDen}}`
      },
      verification: `Resultado decimal: ${formatNumber(decimal)}`,
      errors: [],
      warnings: []
    };
  }

  public multiply(a: Fraction, b: Fraction): SolverResult<FractionOperationResult> {
    const steps: Step[] = [];
    const errors: string[] = [];

    if (a.denominator === 0 || b.denominator === 0) {
      errors.push('Denominador zero.');
      return {
        input: { a, b },
        steps: [],
        result: { raw: { numerator: 0, denominator: 1 }, simplified: { numerator: 0, denominator: 1 }, decimal: 0, latex: '' },
        errors,
        warnings: []
      };
    }

    steps.push({
      stepNumber: 1,
      title: 'Multiplicação de Frações',
      description: 'Multiplica-se numerador por numerador e denominador por denominador.',
      formula: '\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}',
      calculation: `\\frac{${a.numerator}}{${a.denominator}} \\cdot \\frac{${b.numerator}}{${b.denominator}} = \\frac{${a.numerator} \\cdot ${b.numerator}}{${a.denominator} \\cdot ${b.denominator}}`,
      highlightedElements: [],
      currentState: { a, b }
    });

    const rawNum = a.numerator * b.numerator;
    const rawDen = a.denominator * b.denominator;

    steps.push({
      stepNumber: 2,
      title: 'Cálculo dos Produtos',
      description: `Numerador: ${a.numerator} × ${b.numerator} = ${rawNum}; Denominador: ${a.denominator} × ${b.denominator} = ${rawDen}.`,
      calculation: `\\frac{${rawNum}}{${rawDen}}`,
      highlightedElements: [],
      currentState: { rawNum, rawDen }
    });

    const divisor = gcd(rawNum, rawDen);
    const simpNum = rawNum / divisor;
    const simpDen = rawDen / divisor;

    if (divisor > 1) {
      steps.push({
        stepNumber: 3,
        title: 'Simplificação pelo MDC',
        description: `Dividir ambos por ${divisor}.`,
        calculation: `\\frac{${rawNum} \\div ${divisor}}{${rawDen} \\div ${divisor}} = \\frac{${simpNum}}{${simpDen}}`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { simpNum, simpDen }
      });
    }

    const decimal = simpNum / simpDen;

    return {
      input: { a, b },
      steps,
      result: {
        raw: { numerator: rawNum, denominator: rawDen },
        simplified: { numerator: simpNum, denominator: simpDen },
        decimal,
        latex: `\\frac{${simpNum}}{${simpDen}}`
      },
      verification: `Decimal: ${formatNumber(decimal)}`,
      errors: [],
      warnings: []
    };
  }

  public divide(a: Fraction, b: Fraction): SolverResult<FractionOperationResult> {
    const steps: Step[] = [];
    const errors: string[] = [];

    if (a.denominator === 0 || b.denominator === 0 || b.numerator === 0) {
      errors.push('Divisão por zero não permitida.');
      return {
        input: { a, b },
        steps: [],
        result: { raw: { numerator: 0, denominator: 1 }, simplified: { numerator: 0, denominator: 1 }, decimal: 0, latex: '' },
        errors,
        warnings: []
      };
    }

    steps.push({
      stepNumber: 1,
      title: 'Divisão de Frações (Inverter a Segunda)',
      description: 'A divisão de frações equivale a multiplicar a primeira pelo inverso da segunda.',
      formula: '\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}',
      calculation: `\\frac{${a.numerator}}{${a.denominator}} \\div \\frac{${b.numerator}}{${b.denominator}} = \\frac{${a.numerator}}{${a.denominator}} \\cdot \\frac{${b.denominator}}{${b.numerator}}`,
      highlightedElements: [],
      currentState: { a, b }
    });

    const inverted: Fraction = { numerator: b.denominator, denominator: b.numerator };
    return this.multiply(a, inverted);
  }
}
