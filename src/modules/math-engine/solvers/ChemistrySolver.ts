import { SolverResult, Step } from '../types';
import { formatNumber } from '../utils';

export interface ChemistryResult {
  solvedVariable: string;
  value: number;
  unit: string;
  formulaLatex: string;
  explanation: string;
}

export class ChemistrySolver {
  /**
   * Ideal Gas Law: P * V = n * R * T
   * R default: 0.082 atm*L/(mol*K)
   */
  public solveIdealGas(params: {
    p?: number; // atm
    v?: number; // L
    n?: number; // mol
    t?: number; // K
    r?: number; // default 0.082
  }): SolverResult<ChemistryResult> {
    const steps: Step[] = [];
    const r = params.r || 0.082;
    const { p, v, n, t } = params;

    // Find Pressure P
    if (p === undefined && v !== undefined && n !== undefined && t !== undefined && v > 0) {
      const pressure = (n * r * t) / v;
      steps.push({
        stepNumber: 1,
        title: 'Dados da Equação de Clapeyron (Gases Ideais)',
        description: `Volume V = ${v} L, Quantidade de matéria n = ${n} mol, Temperatura T = ${t} K, Constante R = ${r} atm·L/(mol·K).`,
        formula: 'P \\cdot V = n \\cdot R \\cdot T',
        calculation: `V = ${v}\\text{ L}, \\quad n = ${n}\\text{ mol}, \\quad T = ${t}\\text{ K}, \\quad R = ${r}`,
        highlightedElements: [],
        currentState: params
      });

      steps.push({
        stepNumber: 2,
        title: 'Isolamento da Pressão (P)',
        description: 'Isolar P dividindo ambos os lados pelo volume V.',
        formula: 'P = \\frac{n \\cdot R \\cdot T}{V}',
        calculation: `P = \\frac{(${n}) \\cdot (${r}) \\cdot (${t})}{${v}} = \\frac{${n * r * t}}{${v}} = ${formatNumber(pressure)}\\text{ atm}`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { p: pressure }
      });

      return {
        input: params,
        steps,
        result: {
          solvedVariable: 'P',
          value: pressure,
          unit: 'atm',
          formulaLatex: 'P = \\frac{nRT}{V}',
          explanation: `A pressão exercida pelo gás nas condições ideais é de ${formatNumber(pressure)} atm.`
        },
        verification: `P * V = ${formatNumber(pressure * v)} e n * R * T = ${formatNumber(n * r * t)}`,
        errors: [],
        warnings: []
      };
    }

    // Find Volume V
    if (v === undefined && p !== undefined && n !== undefined && t !== undefined && p > 0) {
      const volume = (n * r * t) / p;
      steps.push({
        stepNumber: 1,
        title: 'Isolamento do Volume (V)',
        description: `Pressão P = ${p} atm, n = ${n} mol, T = ${t} K, R = ${r}.`,
        formula: 'V = \\frac{n \\cdot R \\cdot T}{P}',
        calculation: `V = \\frac{(${n}) \\cdot (${r}) \\cdot (${t})}{${p}} = ${formatNumber(volume)}\\text{ L}`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { v: volume }
      });

      return {
        input: params,
        steps,
        result: {
          solvedVariable: 'V',
          value: volume,
          unit: 'L',
          formulaLatex: 'V = \\frac{nRT}{P}',
          explanation: `O volume ocupado pelo gás é de ${formatNumber(volume)} Litros.`
        },
        verification: `P * V = ${formatNumber(p * volume)}`,
        errors: [],
        warnings: []
      };
    }

    return {
      input: params,
      steps: [],
      result: { solvedVariable: 'unknown', value: 0, unit: '', formulaLatex: '', explanation: '' },
      errors: ['Parâmetros insuficientes para a equação de Clapeyron.'],
      warnings: []
    };
  }

  /**
   * Density: d = m / V
   */
  public solveDensity(m: number, v: number): SolverResult<ChemistryResult> {
    const steps: Step[] = [];
    if (v <= 0) {
      return {
        input: { m, v },
        steps: [],
        result: { solvedVariable: 'd', value: NaN, unit: 'g/cm³', formulaLatex: 'd = m/V', explanation: '' },
        errors: ['O volume deve ser maior que zero.'],
        warnings: []
      };
    }

    const density = m / v;

    steps.push({
      stepNumber: 1,
      title: 'Identificação dos Dados (Densidade Absoluta)',
      description: `Massa m = ${m} g, Volume V = ${v} cm³ (ou mL).`,
      formula: 'd = \\frac{m}{V}',
      calculation: `m = ${m}\\text{ g}, \\quad V = ${v}\\text{ cm}^3`,
      highlightedElements: [],
      currentState: { m, v }
    });

    steps.push({
      stepNumber: 2,
      title: 'Cálculo da Densidade',
      description: 'Dividir a massa da amostra pelo volume ocupado.',
      calculation: `d = \\frac{${m}}{${v}} = ${formatNumber(density)}\\text{ g/cm}^3`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { density }
    });

    return {
      input: { m, v },
      steps,
      result: {
        solvedVariable: 'd',
        value: density,
        unit: 'g/cm³',
        formulaLatex: 'd = \\frac{m}{V}',
        explanation: `A densidade do material é de ${formatNumber(density)} g/cm³ (${formatNumber(density * 1000)} kg/m³).`
      },
      verification: `m = d * V = ${formatNumber(density)} * ${v} = ${m} g`,
      errors: [],
      warnings: []
    };
  }

  /**
   * Molar mass & Amount of substance: n = m / M
   */
  public solveMolarAmount(massGrams: number, molarMass: number): SolverResult<ChemistryResult> {
    const steps: Step[] = [];
    if (molarMass <= 0) {
      return {
        input: { massGrams, molarMass },
        steps: [],
        result: { solvedVariable: 'n', value: NaN, unit: 'mol', formulaLatex: 'n = m/M', explanation: '' },
        errors: ['A massa molar deve ser positiva.'],
        warnings: []
      };
    }

    const n = massGrams / molarMass;

    steps.push({
      stepNumber: 1,
      title: 'Cálculo da Quantidade de Matéria (n)',
      description: `Massa da amostra m = ${massGrams} g, Massa molar M = ${molarMass} g/mol.`,
      formula: 'n = \\frac{m}{M}',
      calculation: `n = \\frac{${massGrams}\\text{ g}}{${molarMass}\\text{ g/mol}} = ${formatNumber(n, 4)}\\text{ mol}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { n }
    });

    return {
      input: { massGrams, molarMass },
      steps,
      result: {
        solvedVariable: 'n',
        value: n,
        unit: 'mol',
        formulaLatex: 'n = \\frac{m}{M}',
        explanation: `A amostra contém ${formatNumber(n, 4)} mols de substância (${formatNumber(n * 6.022e23, 2)} moléculas/átomos).`
      },
      verification: `n * M = ${formatNumber(n, 4)} * ${molarMass} = ${massGrams} g`,
      errors: [],
      warnings: []
    };
  }
}
