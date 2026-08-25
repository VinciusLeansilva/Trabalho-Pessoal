import { SolverResult, Step } from '../types';
import { formatNumber } from '../utils';

export interface StatisticsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[] | 'amodal';
  variance: number;
  standardDeviation: number;
  min: number;
  max: number;
  range: number;
  sortedData: number[];
}

export class StatisticsSolver {
  public analyze(data: number[]): SolverResult<StatisticsResult> {
    const steps: Step[] = [];
    const errors: string[] = [];

    if (!data || data.length === 0) {
      errors.push('O conjunto de dados não pode estar vazio.');
      return {
        input: data,
        steps: [],
        result: {
          count: 0,
          sum: 0,
          mean: 0,
          median: 0,
          mode: 'amodal',
          variance: 0,
          standardDeviation: 0,
          min: 0,
          max: 0,
          range: 0,
          sortedData: []
        },
        errors,
        warnings: []
      };
    }

    const n = data.length;
    const sorted = [...data].sort((a, b) => a - b);
    const sum = data.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // Step 1: Ordenação (Rol)
    steps.push({
      stepNumber: 1,
      title: 'Construção do Rol (Dados Ordenados)',
      description: `Organizar os ${n} elementos em ordem crescente.`,
      calculation: `\\text{Rol} = [${sorted.join(', ')}]`,
      highlightedElements: [],
      currentState: { sorted, n }
    });

    // Step 2: Média Aritmética
    steps.push({
      stepNumber: 2,
      title: 'Cálculo da Média Aritmética (x̄)',
      description: 'Somar todos os elementos e dividir pelo número total de observações (n).',
      formula: '\\bar{x} = \\frac{\\sum_{i=1}^n x_i}{n}',
      calculation: `\\bar{x} = \\frac{${sum}}{${n}} = ${formatNumber(mean)}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { mean, sum, n }
    });

    // Step 3: Mediana
    let median: number;
    let medianDesc = '';
    if (n % 2 !== 0) {
      const midIdx = Math.floor(n / 2);
      median = sorted[midIdx];
      medianDesc = `Como n = ${n} é ímpar, a mediana é o elemento central na posição ${(n + 1) / 2}º: ${median}.`;
    } else {
      const mid1 = sorted[n / 2 - 1];
      const mid2 = sorted[n / 2];
      median = (mid1 + mid2) / 2;
      medianDesc = `Como n = ${n} é par, a mediana é a média dos dois termos centrais (${mid1} e ${mid2}): (${mid1} + ${mid2}) / 2 = ${formatNumber(median)}.`;
    }

    steps.push({
      stepNumber: 3,
      title: 'Cálculo da Mediana (Md)',
      description: medianDesc,
      formula: 'M_d = \\text{Elemento central do Rol}',
      calculation: `M_d = ${formatNumber(median)}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { median }
    });

    // Step 4: Moda
    const freqMap = new Map<number, number>();
    sorted.forEach(val => freqMap.set(val, (freqMap.get(val) || 0) + 1));
    let maxFreq = 0;
    freqMap.forEach(f => {
      if (f > maxFreq) maxFreq = f;
    });

    let mode: number[] | 'amodal' = [];
    if (maxFreq === 1 || freqMap.size === 1) {
      mode = 'amodal';
      steps.push({
        stepNumber: 4,
        title: 'Cálculo da Moda (Mo)',
        description: 'Todos os valores aparecem com a mesma frequência. O conjunto é amodal.',
        calculation: '\\text{Mo} = \\text{Amodal}',
        highlightedElements: [],
        currentState: { mode }
      });
    } else {
      const modes: number[] = [];
      freqMap.forEach((f, v) => {
        if (f === maxFreq) modes.push(v);
      });
      mode = modes;
      steps.push({
        stepNumber: 4,
        title: 'Cálculo da Moda (Mo)',
        description: `O(s) valor(es) mais frequente(s) com frequência de ${maxFreq} repetições:`,
        calculation: `\\text{Mo} = \\{${modes.join(', ')}\\}`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { mode }
      });
    }

    // Step 5: Variância e Desvio Padrão
    const deviationsSquared = data.map(x => Math.pow(x - mean, 2));
    const sumDevSq = deviationsSquared.reduce((a, b) => a + b, 0);
    const variance = sumDevSq / n;
    const stdDev = Math.sqrt(variance);

    steps.push({
      stepNumber: 5,
      title: 'Cálculo da Variância Populacional (σ²)',
      description: 'Média das diferenças quadráticas de cada valor em relação à média.',
      formula: '\\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n}',
      calculation: `\\sigma^2 = \\frac{${formatNumber(sumDevSq)}}{${n}} = ${formatNumber(variance)}`,
      highlightedElements: [{ row: 0, col: 0, type: 'operation' }],
      currentState: { variance }
    });

    steps.push({
      stepNumber: 6,
      title: 'Cálculo do Desvio Padrão (σ)',
      description: 'Raiz quadrada da variância. Mede a dispersão dos dados na mesma unidade.',
      formula: '\\sigma = \\sqrt{\\sigma^2}',
      calculation: `\\sigma = \\sqrt{${formatNumber(variance)}} = ${formatNumber(stdDev)}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { stdDev }
    });

    return {
      input: data,
      steps,
      result: {
        count: n,
        sum,
        mean,
        median,
        mode,
        variance,
        standardDeviation: stdDev,
        min,
        max,
        range,
        sortedData: sorted
      },
      verification: `Amplitude total: ${max} - ${min} = ${range}; Média: ${formatNumber(mean)}`,
      errors: [],
      warnings: []
    };
  }
}
