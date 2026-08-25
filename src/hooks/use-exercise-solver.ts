import { useState } from "react";
import { StepData } from "@/components/exercises/step-card";
import {
  MatrixSolver,
  EquationSolver,
  FractionSolver,
  PercentageSolver,
  StatisticsSolver,
  PhysicsSolver,
  ChemistrySolver
} from "@/modules/math-engine";
import type { Matrix, Step, SolverResult } from "@/modules/math-engine/types";
import type { MatrixHighlight } from "@/components/exercises/matrix-display";

function toMatrix(data: number[][], label = 'A'): Matrix {
  return {
    data,
    rows: data.length,
    cols: data[0]?.length || 0,
    label,
  };
}

export function useExerciseSolver() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<StepData[]>([]);
  const [result, setResult] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showFormulaOnly, setShowFormulaOnly] = useState(false);
  const [isBlackboardMode, setBlackboardMode] = useState(false);
  const [domain, setDomain] = useState<string>('matrix');

  const processSolverResult = (solveResult: SolverResult<unknown>, fallbackMatrix?: number[][]) => {
    if (solveResult && solveResult.steps && solveResult.steps.length > 0) {
      const mappedSteps: StepData[] = solveResult.steps.map((s: Step) => {
        let matrixToShow: number[][] | undefined = fallbackMatrix;
        const curr = s.currentState as Record<string, unknown> | null;
        if (curr && typeof curr === 'object') {
          if (Array.isArray(curr.data)) {
            matrixToShow = curr.data as number[][];
          } else if (curr.a && typeof curr.a === 'object' && Array.isArray((curr.a as { data?: number[][] }).data)) {
            matrixToShow = (curr.a as { data: number[][] }).data;
          } else if (Array.isArray(curr)) {
            matrixToShow = curr as number[][];
          }
        }

        const highlights: MatrixHighlight[] = (s.highlightedElements || []).map((h) => ({
          row: h.row,
          col: h.col,
          type: h.type as MatrixHighlight['type'],
        }));

        return {
          title: s.title,
          description: s.description,
          formula: s.formula,
          matrix: matrixToShow,
          highlights,
          calculation: s.calculation,
        };
      });

      setSteps(mappedSteps);
      setResult(solveResult.result);
    } else {
      setSteps([
        {
          title: "Resultado da Operação",
          description: "Cálculo processado com sucesso.",
          matrix: fallbackMatrix,
          calculation: typeof solveResult?.result === 'number' ? `Resultado = ${solveResult.result}` : undefined,
        }
      ]);
      setResult(solveResult?.result ?? null);
    }
    setCurrentStep(0);
    setShowAll(false);
  };

  const solveMatrix = (a: number[][], b?: number[][], operation: string = "determinant", scalar?: number, constants?: number[]) => {
    setIsLoading(true);
    setDomain('matrix');
    try {
      const solver = new MatrixSolver();
      const matA = toMatrix(a, 'A');
      const matB = b ? toMatrix(b, 'B') : undefined;

      let solveResult: SolverResult<unknown> | null = null;

      switch (operation) {
        case 'determinant':
          solveResult = solver.determinant(matA) as SolverResult<unknown>;
          break;
        case 'inverse':
          solveResult = solver.inverse(matA) as SolverResult<unknown>;
          break;
        case 'transpose':
          solveResult = solver.transpose(matA) as SolverResult<unknown>;
          break;
        case 'scalar':
          solveResult = solver.scalarMultiply(matA, scalar ?? 2) as SolverResult<unknown>;
          break;
        case 'add':
          if (matB) solveResult = solver.addMatrices(matA, matB) as SolverResult<unknown>;
          break;
        case 'subtract':
          if (matB) solveResult = solver.subtractMatrices(matA, matB) as SolverResult<unknown>;
          break;
        case 'multiply':
          if (matB) solveResult = solver.multiplyMatrices(matA, matB) as SolverResult<unknown>;
          break;
        case 'gauss':
          solveResult = solver.gaussianElimination(matA) as SolverResult<unknown>;
          break;
        case 'gauss-jordan':
          solveResult = solver.gaussJordan(matA) as SolverResult<unknown>;
          break;
        case 'cramer':
          if (constants) solveResult = solver.cramerRule(matA, constants) as SolverResult<unknown>;
          break;
        case 'linear-system':
          if (constants) solveResult = solver.solveLinearSystem(matA, constants) as SolverResult<unknown>;
          break;
        default:
          solveResult = solver.determinant(matA) as SolverResult<unknown>;
          break;
      }

      if (solveResult) processSolverResult(solveResult, a);
    } catch (err) {
      console.error('Error solving matrix:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const solveEquation = (a: number, b: number, c: number = 0, isQuadratic: boolean = false) => {
    setIsLoading(true);
    setDomain('equation');
    try {
      const solver = new EquationSolver();
      const res = isQuadratic ? solver.solveQuadratic(a, b, c) : solver.solveLinear(a, b, c);
      processSolverResult(res as SolverResult<unknown>);
    } finally {
      setIsLoading(false);
    }
  };

  const solveFraction = (op: 'simplify' | 'add' | 'subtract' | 'multiply' | 'divide', fracA: { numerator: number; denominator: number }, fracB?: { numerator: number; denominator: number }) => {
    setIsLoading(true);
    setDomain('fraction');
    try {
      const solver = new FractionSolver();
      let res;
      if (op === 'simplify') res = solver.simplify(fracA);
      else if (op === 'add' && fracB) res = solver.add(fracA, fracB);
      else if (op === 'subtract' && fracB) res = solver.subtract(fracA, fracB);
      else if (op === 'multiply' && fracB) res = solver.multiply(fracA, fracB);
      else if (op === 'divide' && fracB) res = solver.divide(fracA, fracB);
      if (res) processSolverResult(res as SolverResult<unknown>);
    } finally {
      setIsLoading(false);
    }
  };

  const solvePercentage = (p: number, v: number, mode: 'calculate' | 'increase' | 'discount' | 'between', v2?: number) => {
    setIsLoading(true);
    setDomain('percentage');
    try {
      const solver = new PercentageSolver();
      let res;
      if (mode === 'calculate') res = solver.calculatePercentage(p, v);
      else if (mode === 'increase') res = solver.applyVariation(v, p, true);
      else if (mode === 'discount') res = solver.applyVariation(v, p, false);
      else if (mode === 'between' && v2 !== undefined) res = solver.calculateVariationBetween(v, v2);
      if (res) processSolverResult(res as SolverResult<unknown>);
    } finally {
      setIsLoading(false);
    }
  };

  const solveStatistics = (data: number[]) => {
    setIsLoading(true);
    setDomain('statistics');
    try {
      const solver = new StatisticsSolver();
      const res = solver.analyze(data);
      processSolverResult(res as SolverResult<unknown>);
    } finally {
      setIsLoading(false);
    }
  };

  const solvePhysics = (problemType: 'mruv' | 'torricelli' | 'newton' | 'kinetic-energy', params: Record<string, number>) => {
    setIsLoading(true);
    setDomain('physics');
    try {
      const solver = new PhysicsSolver();
      let res;
      if (problemType === 'mruv') res = solver.solveMRUV(params);
      else if (problemType === 'torricelli') res = solver.solveTorricelli({ v0: params.v0 || 0, a: params.a || 0, deltaS: params.deltaS || 0 });
      else if (problemType === 'newton') res = solver.solveNewtonSecondLaw(params);
      else if (problemType === 'kinetic-energy') res = solver.solveKineticEnergy(params.m || 0, params.v || 0);
      if (res) processSolverResult(res as SolverResult<unknown>);
    } finally {
      setIsLoading(false);
    }
  };

  const solveChemistry = (problemType: 'ideal-gas' | 'density' | 'molar-amount', params: Record<string, number>) => {
    setIsLoading(true);
    setDomain('chemistry');
    try {
      const solver = new ChemistrySolver();
      let res;
      if (problemType === 'ideal-gas') res = solver.solveIdealGas(params);
      else if (problemType === 'density') res = solver.solveDensity(params.m || 0, params.v || 1);
      else if (problemType === 'molar-amount') res = solver.solveMolarAmount(params.m || 0, params.molarMass || 1);
      if (res) processSolverResult(res as SolverResult<unknown>);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const showCompleteResolution = () => {
    setShowAll(true);
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setResult(null);
    setShowAll(false);
    setShowHint(false);
    setShowFormulaOnly(false);
  };

  return {
    currentStep,
    steps,
    result,
    domain,
    isLoading,
    showAll,
    showHint,
    showFormulaOnly,
    isBlackboardMode,
    solveMatrix,
    solveEquation,
    solveFraction,
    solvePercentage,
    solveStatistics,
    solvePhysics,
    solveChemistry,
    nextStep,
    prevStep,
    goToStep,
    showCompleteResolution,
    setShowHint,
    setShowFormulaOnly,
    reset,
    setShowAll,
    setBlackboardMode
  };
}
