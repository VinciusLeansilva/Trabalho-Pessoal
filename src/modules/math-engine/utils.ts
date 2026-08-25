import { Fraction, Matrix, MatrixOperation } from './types';

export function formatNumber(n: number, decimals: number = 2): string {
  if (Number.isInteger(n)) return n.toString();
  return Number(n.toFixed(decimals)).toString();
}

export function fractionToDecimal(f: Fraction): number {
  if (f.denominator === 0) throw new Error("Denominator cannot be zero");
  return f.numerator / f.denominator;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

export function matrixToString(m: Matrix): string {
  return m.data.map(row => row.map(val => formatNumber(val)).join('\t')).join('\n');
}

export function roundMatrix(m: Matrix, decimals: number = 2): Matrix {
  const newData = m.data.map(row => row.map(val => Number(val.toFixed(decimals))));
  return { ...m, data: newData };
}

export function createIdentityMatrix(size: number): Matrix {
  const data = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
  );
  return { data, rows: size, cols: size, label: 'I' };
}

export function cloneMatrix(m: Matrix): Matrix {
  return {
    data: m.data.map(row => [...row]),
    rows: m.rows,
    cols: m.cols,
    label: m.label
  };
}

export function validateMatrix(m: Matrix): string[] {
  const errors: string[] = [];
  if (!m.data || m.data.length === 0) {
    errors.push("Matrix data is empty.");
    return errors;
  }
  const cols = m.data[0].length;
  for (let i = 0; i < m.data.length; i++) {
    if (m.data[i].length !== cols) {
      errors.push(`Row ${i} length (${m.data[i].length}) does not match expected columns (${cols}).`);
    }
  }
  if (m.rows !== m.data.length) {
    errors.push(`Matrix rows property (${m.rows}) does not match data rows (${m.data.length}).`);
  }
  if (m.cols !== cols) {
    errors.push(`Matrix cols property (${m.cols}) does not match data cols (${cols}).`);
  }
  return errors;
}

export function validateMatricesForOperation(a: Matrix, b: Matrix, op: MatrixOperation): string[] {
  const errors: string[] = [];
  const errA = validateMatrix(a);
  const errB = validateMatrix(b);
  if (errA.length) errors.push(`Matrix A errors: ${errA.join(', ')}`);
  if (errB.length) errors.push(`Matrix B errors: ${errB.join(', ')}`);

  if (op === MatrixOperation.ADD || op === MatrixOperation.SUBTRACT) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      errors.push(`Dimensions mismatch for ${op}: A is ${a.rows}x${a.cols}, B is ${b.rows}x${b.cols}.`);
    }
  } else if (op === MatrixOperation.MULTIPLY) {
    if (a.cols !== b.rows) {
      errors.push(`Dimensions mismatch for MULTIPLY: A cols (${a.cols}) must equal B rows (${b.rows}).`);
    }
  }
  return errors;
}
