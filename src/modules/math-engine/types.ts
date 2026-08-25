export interface Matrix {
  data: number[][];
  rows: number;
  cols: number;
  label?: string;
}

export interface HighlightedElement {
  row: number;
  col: number;
  type: 'selected' | 'operation' | 'result' | 'formula' | 'pivot' | 'eliminated';
}

export interface Step {
  stepNumber: number;
  title: string;
  description: string;
  formula?: string;
  highlightedElements: HighlightedElement[];
  currentState: unknown;
  calculation?: string;
}

export interface SolverResult<T> {
  input: unknown;
  steps: Step[];
  result: T;
  verification?: string;
  errors: string[];
  warnings: string[];
}

export enum MatrixOperation {
  ADD = 'ADD',
  SUBTRACT = 'SUBTRACT',
  MULTIPLY = 'MULTIPLY',
  SCALAR = 'SCALAR',
  TRANSPOSE = 'TRANSPOSE',
  DETERMINANT = 'DETERMINANT',
  INVERSE = 'INVERSE',
  IDENTITY = 'IDENTITY',
  GAUSS = 'GAUSS',
  GAUSS_JORDAN = 'GAUSS_JORDAN',
  CRAMER = 'CRAMER',
  EIGENVALUES = 'EIGENVALUES'
}

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface EquationSystem {
  coefficients: Matrix;
  constants: number[];
}
