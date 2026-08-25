import { SolverResult, Step } from '../types';
import { formatNumber } from '../utils';

export interface PercentageResult {
  value: number;
  multiplier: number;
  formulaLatex: string;
}

export class PercentageSolver {
  /**
   * Calculate P% of Value V
   */
  public calculatePercentage(p: number, v: number): SolverResult<PercentageResult> {
    const steps: Step[] = [];
    const multiplier = p / 100;
    const result = multiplier * v;

    steps.push({
      stepNumber: 1,
      title: 'Conversão da Porcentagem em Fração/Decimal',
      description: `Converter a taxa de ${p}% para fração com base 100 e número decimal.`,
      formula: 'i = \\frac{P}{100}',
      calculation: `${p}\\% = \\frac{${p}}{100} = ${formatNumber(multiplier, 4)}`,
      highlightedElements: [],
      currentState: { p, multiplier }
    });

    steps.push({
      stepNumber: 2,
      title: 'Multiplicação pelo Valor Base',
      description: `Multiplicar a taxa decimal pelo valor total de ${v}.`,
      formula: 'R = i \\cdot V',
      calculation: `R = ${formatNumber(multiplier, 4)} \\cdot ${v} = ${formatNumber(result)}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { result }
    });

    return {
      input: { percentage: p, value: v },
      steps,
      result: {
        value: result,
        multiplier,
        formulaLatex: `R = \\frac{${p}}{100} \\cdot ${v} = ${formatNumber(result)}`
      },
      verification: `Regra de 3: 100% -> ${v} e ${p}% -> ${formatNumber(result)}`,
      errors: [],
      warnings: []
    };
  }

  /**
   * Percentage increase or decrease: V * (1 ± p/100)
   */
  public applyVariation(v: number, p: number, isIncrease: boolean): SolverResult<PercentageResult> {
    const steps: Step[] = [];
    const factor = isIncrease ? 1 + p / 100 : 1 - p / 100;
    const finalValue = v * factor;
    const variationAmount = (p / 100) * v;
    const typeLabel = isIncrease ? 'Aumento' : 'Desconto';
    const sign = isIncrease ? '+' : '-';

    steps.push({
      stepNumber: 1,
      title: `Identificação do Fator de ${typeLabel}`,
      description: `Para um ${typeLabel.toLowerCase()} de ${p}%, calcula-se o fator de multiplicação (1 ${sign} ${p}/100).`,
      formula: `F = 1 ${sign} \\frac{P}{100}`,
      calculation: `F = 1 ${sign} \\frac{${p}}{100} = 1 ${sign} ${p / 100} = ${formatNumber(factor, 4)}`,
      highlightedElements: [],
      currentState: { factor }
    });

    steps.push({
      stepNumber: 2,
      title: `Cálculo do Valor da Variação (${typeLabel})`,
      description: `O montante de ${typeLabel.toLowerCase()} isolado é:`,
      calculation: `\\Delta V = ${p}\\% \\cdot ${v} = ${formatNumber(variationAmount)}`,
      highlightedElements: [{ row: 0, col: 0, type: 'operation' }],
      currentState: { variationAmount }
    });

    steps.push({
      stepNumber: 3,
      title: 'Cálculo do Valor Final',
      description: `Multiplicar o valor inicial de ${v} pelo fator ${formatNumber(factor, 4)}.`,
      formula: 'V_{\\text{final}} = V \\cdot F',
      calculation: `V_{\\text{final}} = ${v} \\cdot ${formatNumber(factor, 4)} = ${formatNumber(finalValue)}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { finalValue }
    });

    return {
      input: { value: v, percentage: p, isIncrease },
      steps,
      result: {
        value: finalValue,
        multiplier: factor,
        formulaLatex: `V_{\\text{final}} = ${v} \\cdot (${formatNumber(factor, 4)}) = ${formatNumber(finalValue)}`
      },
      verification: `Verificação: ${v} ${sign} ${formatNumber(variationAmount)} = ${formatNumber(finalValue)}`,
      errors: [],
      warnings: []
    };
  }

  /**
   * Calculate percentage variation between two values: ((v2 - v1) / v1) * 100
   */
  public calculateVariationBetween(v1: number, v2: number): SolverResult<{ percentage: number; diff: number }> {
    const steps: Step[] = [];
    const errors: string[] = [];

    if (v1 === 0) {
      errors.push('O valor inicial não pode ser zero para cálculo de variação percentual.');
      return {
        input: { v1, v2 },
        steps: [],
        result: { percentage: 0, diff: 0 },
        errors,
        warnings: []
      };
    }

    const diff = v2 - v1;
    const pct = (diff / v1) * 100;

    steps.push({
      stepNumber: 1,
      title: 'Diferença Absoluta',
      description: `Subtrair o valor inicial (${v1}) do valor final (${v2}).`,
      formula: '\\Delta V = V_2 - V_1',
      calculation: `\\Delta V = ${v2} - ${v1} = ${formatNumber(diff)}`,
      highlightedElements: [],
      currentState: { diff }
    });

    steps.push({
      stepNumber: 2,
      title: 'Razão Relativa e Porcentagem',
      description: 'Dividir a variação pelo valor base inicial e multiplicar por 100%.',
      formula: 'P = \\frac{V_2 - V_1}{V_1} \\cdot 100\\%',
      calculation: `P = \\frac{${formatNumber(diff)}}{${v1}} \\cdot 100\\% = ${formatNumber(pct)}\\%`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { pct }
    });

    return {
      input: { v1, v2 },
      steps,
      result: { percentage: pct, diff },
      verification: `${v1} com variação de ${formatNumber(pct)}% resulta em ${v2}`,
      errors: [],
      warnings: []
    };
  }
}
