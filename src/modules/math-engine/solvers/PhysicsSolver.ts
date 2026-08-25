import { SolverResult, Step } from '../types';
import { formatNumber } from '../utils';

export interface PhysicsProblemResult {
  solvedVariable: string;
  value: number;
  unit: string;
  formulaLatex: string;
  explanation: string;
}

export class PhysicsSolver {
  /**
   * MRUV: v = v0 + a * t or s = s0 + v0*t + (a*t^2)/2
   */
  public solveMRUV(params: {
    s0?: number;
    v0?: number;
    a?: number;
    t?: number;
    s?: number;
    v?: number;
  }): SolverResult<PhysicsProblemResult> {
    const steps: Step[] = [];
    const { s0 = 0, v0, a, t, s, v } = params;

    // Case 1: find v given v0, a, t
    if (v === undefined && v0 !== undefined && a !== undefined && t !== undefined) {
      const resultVal = v0 + a * t;
      steps.push({
        stepNumber: 1,
        title: 'Identificação dos Dados (Cinemática / MRUV)',
        description: `Dados conhecidos: Velocidade inicial v₀ = ${v0} m/s, Aceleração a = ${a} m/s², Tempo t = ${t} s.`,
        formula: 'v = v_0 + at',
        calculation: `v_0 = ${v0}\\text{ m/s}, \\quad a = ${a}\\text{ m/s}^2, \\quad t = ${t}\\text{ s}`,
        highlightedElements: [],
        currentState: params
      });

      steps.push({
        stepNumber: 2,
        title: 'Aplicação da Função Horária da Velocidade',
        description: 'Substituição direta dos valores conhecidos na equação da velocidade.',
        formula: 'v = v_0 + at',
        calculation: `v = (${v0}) + (${a}) \\cdot (${t}) = ${v0} + ${a * t} = ${formatNumber(resultVal)}\\text{ m/s}`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { v: resultVal }
      });

      return {
        input: params,
        steps,
        result: {
          solvedVariable: 'v',
          value: resultVal,
          unit: 'm/s',
          formulaLatex: 'v = v_0 + at',
          explanation: `A velocidade final do corpo após ${t} segundos é de ${formatNumber(resultVal)} m/s.`
        },
        verification: `v_0 + at = ${v0} + (${a})(${t}) = ${formatNumber(resultVal)} m/s`,
        errors: [],
        warnings: []
      };
    }

    // Case 2: find s given s0, v0, a, t
    if (s === undefined && v0 !== undefined && a !== undefined && t !== undefined) {
      const resultVal = s0 + v0 * t + 0.5 * a * t * t;
      steps.push({
        stepNumber: 1,
        title: 'Identificação dos Dados (Função Horária da Posição)',
        description: `Posição inicial s₀ = ${s0} m, Velocidade inicial v₀ = ${v0} m/s, Aceleração a = ${a} m/s², Tempo t = ${t} s.`,
        formula: 's = s_0 + v_0 t + \\frac{1}{2}at^2',
        calculation: `s_0 = ${s0}\\text{ m}, \\quad v_0 = ${v0}\\text{ m/s}, \\quad a = ${a}\\text{ m/s}^2, \\quad t = ${t}\\text{ s}`,
        highlightedElements: [],
        currentState: params
      });

      const term1 = v0 * t;
      const term2 = 0.5 * a * t * t;

      steps.push({
        stepNumber: 2,
        title: 'Substituição e Resolução dos Termos',
        description: 'Efetuar os produtos das parcelas de velocidade e aceleração.',
        calculation: `s = ${s0} + (${v0} \\cdot ${t}) + \\frac{1}{2}(${a})(${t})^2 = ${s0} + ${term1} + ${term2} = ${formatNumber(resultVal)}\\text{ m}`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { s: resultVal }
      });

      return {
        input: params,
        steps,
        result: {
          solvedVariable: 's',
          value: resultVal,
          unit: 'm',
          formulaLatex: 's = s_0 + v_0 t + \\frac{1}{2}at^2',
          explanation: `A posição final do móvel no instante t = ${t} s é de ${formatNumber(resultVal)} metros.`
        },
        verification: `Posição calculada: ${formatNumber(resultVal)} m`,
        errors: [],
        warnings: []
      };
    }

    return {
      input: params,
      steps: [],
      result: { solvedVariable: 'unknown', value: 0, unit: '', formulaLatex: '', explanation: '' },
      errors: ['Parâmetros insuficientes para resolver o problema de MRUV.'],
      warnings: []
    };
  }

  /**
   * Torricelli equation: v^2 = v0^2 + 2*a*Δs
   */
  public solveTorricelli(params: { v0: number; a: number; deltaS: number }): SolverResult<PhysicsProblemResult> {
    const steps: Step[] = [];
    const { v0, a, deltaS } = params;

    const vSq = v0 * v0 + 2 * a * deltaS;
    if (vSq < 0) {
      return {
        input: params,
        steps: [],
        result: { solvedVariable: 'v', value: NaN, unit: 'm/s', formulaLatex: 'v^2 = v_0^2 + 2a\\Delta s', explanation: '' },
        errors: ['O valor sob o radical é negativo (impossível no domínio real).'],
        warnings: []
      };
    }

    const v = Math.sqrt(vSq);

    steps.push({
      stepNumber: 1,
      title: 'Identificação dos Dados (Equação de Torricelli)',
      description: `Velocidade inicial v₀ = ${v0} m/s, Aceleração a = ${a} m/s², Deslocamento Δs = ${deltaS} m.`,
      formula: 'v^2 = v_0^2 + 2a\\Delta s',
      calculation: `v_0 = ${v0}, \\quad a = ${a}, \\quad \\Delta s = ${deltaS}`,
      highlightedElements: [],
      currentState: params
    });

    steps.push({
      stepNumber: 2,
      title: 'Substituição na Equação de Torricelli',
      description: 'Calcular o quadrado da velocidade final.',
      calculation: `v^2 = (${v0})^2 + 2 \\cdot (${a}) \\cdot (${deltaS}) = ${v0 * v0} + (${2 * a * deltaS}) = ${vSq}`,
      highlightedElements: [{ row: 0, col: 0, type: 'operation' }],
      currentState: { vSq }
    });

    steps.push({
      stepNumber: 3,
      title: 'Extração da Raiz Quadrada',
      description: 'Extrair a raiz quadrada para encontrar o módulo da velocidade final v.',
      formula: 'v = \\sqrt{v_0^2 + 2a\\Delta s}',
      calculation: `v = \\sqrt{${vSq}} = ${formatNumber(v)}\\text{ m/s}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { v }
    });

    return {
      input: params,
      steps,
      result: {
        solvedVariable: 'v',
        value: v,
        unit: 'm/s',
        formulaLatex: 'v = \\sqrt{v_0^2 + 2a\\Delta s}',
        explanation: `A velocidade final alcançada é de ${formatNumber(v)} m/s (${formatNumber(v * 3.6)} km/h).`
      },
      verification: `v^2 = ${formatNumber(vSq)} = (${v0})^2 + 2(${a})(${deltaS})`,
      errors: [],
      warnings: []
    };
  }

  /**
   * Newton's 2nd Law: F = m * a
   */
  public solveNewtonSecondLaw(params: { m?: number; a?: number; f?: number }): SolverResult<PhysicsProblemResult> {
    const steps: Step[] = [];
    const { m, a, f } = params;

    if (f === undefined && m !== undefined && a !== undefined) {
      const force = m * a;
      steps.push({
        stepNumber: 1,
        title: 'Dados do Problema (2ª Lei de Newton)',
        description: `Massa m = ${m} kg, Aceleração a = ${a} m/s².`,
        formula: 'F_{\\text{res}} = m \\cdot a',
        calculation: `m = ${m}\\text{ kg}, \\quad a = ${a}\\text{ m/s}^2`,
        highlightedElements: [],
        currentState: params
      });

      steps.push({
        stepNumber: 2,
        title: 'Cálculo da Força Resultante',
        description: 'Multiplicar a massa pela aceleração.',
        calculation: `F = ${m} \\cdot ${a} = ${formatNumber(force)}\\text{ N}`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { f: force }
      });

      return {
        input: params,
        steps,
        result: {
          solvedVariable: 'F',
          value: force,
          unit: 'N',
          formulaLatex: 'F = m \\cdot a',
          explanation: `A força resultante atuando sobre o corpo é de ${formatNumber(force)} Newtons.`
        },
        verification: `F/m = ${formatNumber(force)}/${m} = ${a} m/s²`,
        errors: [],
        warnings: []
      };
    }

    if (a === undefined && f !== undefined && m !== undefined && m > 0) {
      const accel = f / m;
      steps.push({
        stepNumber: 1,
        title: 'Isolamento da Aceleração',
        description: `Força F = ${f} N, Massa m = ${m} kg. Isolando a aceleração na equação fundamental da dinâmica.`,
        formula: 'a = \\frac{F}{m}',
        calculation: `a = \\frac{${f}}{${m}} = ${formatNumber(accel)}\\text{ m/s}^2`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: { a: accel }
      });

      return {
        input: params,
        steps,
        result: {
          solvedVariable: 'a',
          value: accel,
          unit: 'm/s²',
          formulaLatex: 'a = \\frac{F}{m}',
          explanation: `A aceleração adquirida pelo corpo é de ${formatNumber(accel)} m/s².`
        },
        verification: `m * a = ${m} * ${formatNumber(accel)} = ${f} N`,
        errors: [],
        warnings: []
      };
    }

    return {
      input: params,
      steps: [],
      result: { solvedVariable: 'unknown', value: 0, unit: '', formulaLatex: '', explanation: '' },
      errors: ['Dados insuficientes para a 2ª Lei de Newton.'],
      warnings: []
    };
  }

  /**
   * Kinetic & Potential Energy
   */
  public solveKineticEnergy(m: number, v: number): SolverResult<PhysicsProblemResult> {
    const steps: Step[] = [];
    const ec = 0.5 * m * v * v;

    steps.push({
      stepNumber: 1,
      title: 'Identificação dos Dados (Energia Cinética)',
      description: `Massa do corpo m = ${m} kg, Velocidade v = ${v} m/s.`,
      formula: 'E_c = \\frac{m v^2}{2}',
      calculation: `m = ${m}\\text{ kg}, \\quad v = ${v}\\text{ m/s}`,
      highlightedElements: [],
      currentState: { m, v }
    });

    steps.push({
      stepNumber: 2,
      title: 'Cálculo da Energia Cinética',
      description: 'Elevar a velocidade ao quadrado, multiplicar pela massa e dividir por 2.',
      calculation: `E_c = \\frac{${m} \\cdot (${v})^2}{2} = \\frac{${m} \\cdot ${v * v}}{2} = ${formatNumber(ec)}\\text{ Joules (J)}`,
      highlightedElements: [{ row: 0, col: 0, type: 'result' }],
      currentState: { ec }
    });

    return {
      input: { m, v },
      steps,
      result: {
        solvedVariable: 'Ec',
        value: ec,
        unit: 'J',
        formulaLatex: 'E_c = \\frac{mv^2}{2}',
        explanation: `A energia cinética associada ao movimento do corpo é de ${formatNumber(ec)} Joules.`
      },
      verification: `2 * Ec / m = ${formatNumber(2 * ec / m)} = v² (${v * v})`,
      errors: [],
      warnings: []
    };
  }
}
