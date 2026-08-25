import {
  Matrix,
  SolverResult,
  Step,
  HighlightedElement,
  MatrixOperation
} from '../types';
import {
  validateMatricesForOperation,
  validateMatrix,
  cloneMatrix,
  createIdentityMatrix,
  formatNumber
} from '../utils';

export class MatrixSolver {

  public addMatrices(a: Matrix, b: Matrix): SolverResult<Matrix> {
    const errors = validateMatricesForOperation(a, b, MatrixOperation.ADD);
    const steps: Step[] = [];

    steps.push({
      stepNumber: 1,
      title: 'Verify Dimensions',
      description: `Both matrices are ${a.rows}x${a.cols}, so addition is possible.`,
      highlightedElements: [],
      currentState: { a: cloneMatrix(a), b: cloneMatrix(b) }
    });

    if (errors.length > 0) {
      return { input: { a, b }, steps, result: createIdentityMatrix(1), errors, warnings: [] };
    }

    const resultData: number[][] = [];
    let stepCount = 2;

    for (let i = 0; i < a.rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < a.cols; j++) {
        const sum = a.data[i][j] + b.data[i][j];
        row.push(sum);
        steps.push({
          stepNumber: stepCount++,
          title: `Add Elements at (${i + 1}, ${j + 1})`,
          description: `Add the elements at row ${i + 1}, column ${j + 1}.`,
          calculation: `${a.data[i][j]} + ${b.data[i][j]} = ${sum}`,
          highlightedElements: [
            { row: i, col: j, type: 'operation' },
            { row: i, col: j, type: 'operation' }
          ],
          currentState: { a: cloneMatrix(a), b: cloneMatrix(b), partialResult: resultData.map(r => [...r]).concat([row]) }
        });
      }
      if (row.length < a.cols) {
          resultData.push(row);
      } else if (resultData.length <= i) {
          resultData.push(row);
      }
    }

    const resultMatrix: Matrix = { data: resultData, rows: a.rows, cols: a.cols };
    steps.push({
      stepNumber: stepCount,
      title: 'Final Result',
      description: 'The matrix addition is complete.',
      highlightedElements: [],
      currentState: resultMatrix
    });

    return { input: { a, b }, steps, result: resultMatrix, errors: [], warnings: [] };
  }

  public subtractMatrices(a: Matrix, b: Matrix): SolverResult<Matrix> {
    const errors = validateMatricesForOperation(a, b, MatrixOperation.SUBTRACT);
    const steps: Step[] = [];

    steps.push({
      stepNumber: 1,
      title: 'Verify Dimensions',
      description: `Both matrices are ${a.rows}x${a.cols}, so subtraction is possible.`,
      highlightedElements: [],
      currentState: { a: cloneMatrix(a), b: cloneMatrix(b) }
    });

    if (errors.length > 0) {
      return { input: { a, b }, steps, result: createIdentityMatrix(1), errors, warnings: [] };
    }

    const resultData: number[][] = [];
    let stepCount = 2;

    for (let i = 0; i < a.rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < a.cols; j++) {
        const diff = a.data[i][j] - b.data[i][j];
        row.push(diff);
        steps.push({
          stepNumber: stepCount++,
          title: `Subtract Elements at (${i + 1}, ${j + 1})`,
          description: `Subtract the element of B from A at row ${i + 1}, column ${j + 1}.`,
          calculation: `${a.data[i][j]} - ${b.data[i][j]} = ${diff}`,
          highlightedElements: [
            { row: i, col: j, type: 'operation' },
            { row: i, col: j, type: 'operation' }
          ],
          currentState: { a: cloneMatrix(a), b: cloneMatrix(b), partialResult: [...resultData] }
        });
      }
      resultData.push(row);
    }

    const resultMatrix: Matrix = { data: resultData, rows: a.rows, cols: a.cols };
    steps.push({
      stepNumber: stepCount,
      title: 'Final Result',
      description: 'The matrix subtraction is complete.',
      highlightedElements: [],
      currentState: resultMatrix
    });

    return { input: { a, b }, steps, result: resultMatrix, errors: [], warnings: [] };
  }

  public multiplyMatrices(a: Matrix, b: Matrix): SolverResult<Matrix> {
    const errors = validateMatricesForOperation(a, b, MatrixOperation.MULTIPLY);
    const steps: Step[] = [];

    steps.push({
      stepNumber: 1,
      title: 'Verify Dimensions',
      description: `Matrix A columns (${a.cols}) matches Matrix B rows (${b.rows}). Result will be ${a.rows}x${b.cols}.`,
      highlightedElements: [],
      currentState: { a: cloneMatrix(a), b: cloneMatrix(b) }
    });

    if (errors.length > 0) {
      return { input: { a, b }, steps, result: createIdentityMatrix(1), errors, warnings: [] };
    }

    const resultData: number[][] = Array.from({ length: a.rows }, () => Array(b.cols).fill(0));
    let stepCount = 2;

    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < b.cols; j++) {
        let sum = 0;
        const calcParts: string[] = [];
        const highlights: HighlightedElement[] = [];

        for (let k = 0; k < a.cols; k++) {
          const prod = a.data[i][k] * b.data[k][j];
          sum += prod;
          calcParts.push(`(${a.data[i][k]} * ${b.data[k][j]})`);
          highlights.push({ row: i, col: k, type: 'operation' }); 
          // Note: these highlights should technically reference which matrix they belong to,
          // but for simplicity we rely on the engine's UI parsing it based on context or adding an id.
        }
        
        resultData[i][j] = sum;
        
        steps.push({
          stepNumber: stepCount++,
          title: `Calculate Element (${i + 1}, ${j + 1})`,
          description: `Multiply row ${i + 1} of A by column ${j + 1} of B and sum the products.`,
          calculation: `${calcParts.join(' + ')} = ${sum}`,
          highlightedElements: highlights,
          currentState: { a: cloneMatrix(a), b: cloneMatrix(b), partialResult: cloneMatrix({ data: resultData, rows: a.rows, cols: b.cols }) }
        });
      }
    }

    const resultMatrix: Matrix = { data: resultData, rows: a.rows, cols: b.cols };
    steps.push({
      stepNumber: stepCount,
      title: 'Final Result',
      description: 'The matrix multiplication is complete.',
      highlightedElements: [],
      currentState: resultMatrix
    });

    return { input: { a, b }, steps, result: resultMatrix, errors: [], warnings: [] };
  }

  public scalarMultiply(m: Matrix, scalar: number): SolverResult<Matrix> {
    const errors = validateMatrix(m);
    const steps: Step[] = [];

    if (errors.length > 0) {
      return { input: { m, scalar }, steps, result: createIdentityMatrix(1), errors, warnings: [] };
    }

    const resultData: number[][] = [];
    let stepCount = 1;

    for (let i = 0; i < m.rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < m.cols; j++) {
        const val = m.data[i][j] * scalar;
        row.push(val);
        steps.push({
          stepNumber: stepCount++,
          title: `Multiply Element (${i + 1}, ${j + 1})`,
          description: `Multiply the element at row ${i + 1}, column ${j + 1} by the scalar ${scalar}.`,
          calculation: `${m.data[i][j]} * ${scalar} = ${val}`,
          highlightedElements: [{ row: i, col: j, type: 'operation' }],
          currentState: { m: cloneMatrix(m), partialResult: [...resultData, row] }
        });
      }
      if (row.length === m.cols && resultData.length === i) {
          resultData.push(row);
      }
    }

    const resultMatrix: Matrix = { data: resultData, rows: m.rows, cols: m.cols };
    steps.push({
      stepNumber: stepCount,
      title: 'Final Result',
      description: 'The scalar multiplication is complete.',
      highlightedElements: [],
      currentState: resultMatrix
    });

    return { input: { m, scalar }, steps, result: resultMatrix, errors: [], warnings: [] };
  }

  public transpose(m: Matrix): SolverResult<Matrix> {
    const errors = validateMatrix(m);
    const steps: Step[] = [];

    if (errors.length > 0) {
      return { input: m, steps, result: createIdentityMatrix(1), errors, warnings: [] };
    }

    const resultData: number[][] = Array.from({ length: m.cols }, () => Array(m.rows).fill(0));
    let stepCount = 1;

    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        resultData[j][i] = m.data[i][j];
      }
      steps.push({
        stepNumber: stepCount++,
        title: `Transpose Row ${i + 1}`,
        description: `Row ${i + 1} of the original matrix becomes column ${i + 1} of the transposed matrix.`,
        highlightedElements: Array.from({ length: m.cols }, (_, c) => ({ row: i, col: c, type: 'operation' })),
        currentState: { m: cloneMatrix(m), partialResult: cloneMatrix({ data: resultData, rows: m.cols, cols: m.rows }) }
      });
    }

    const resultMatrix: Matrix = { data: resultData, rows: m.cols, cols: m.rows };
    steps.push({
      stepNumber: stepCount,
      title: 'Final Result',
      description: 'The matrix transposition is complete.',
      highlightedElements: [],
      currentState: resultMatrix
    });

    return { input: m, steps, result: resultMatrix, errors: [], warnings: [] };
  }

  public determinant(m: Matrix): SolverResult<number> {
    const errors = validateMatrix(m);
    const steps: Step[] = [];

    if (m.rows !== m.cols) {
      errors.push("Determinant can only be calculated for square matrices.");
    }

    if (errors.length > 0) {
      return { input: m, steps, result: 0, errors, warnings: [] };
    }

    let result = 0;

    if (m.rows === 1) {
      result = m.data[0][0];
      steps.push({
        stepNumber: 1,
        title: '1x1 Determinant',
        description: 'For a 1x1 matrix, the determinant is the single element itself.',
        calculation: `${result}`,
        highlightedElements: [{ row: 0, col: 0, type: 'result' }],
        currentState: cloneMatrix(m)
      });
    } else if (m.rows === 2) {
      const a = m.data[0][0], b = m.data[0][1], c = m.data[1][0], d = m.data[1][1];
      result = a * d - b * c;
      steps.push({
        stepNumber: 1,
        title: '2x2 Determinant',
        description: 'Calculate ad - bc.',
        formula: 'det = ad - bc',
        calculation: `(${a} * ${d}) - (${b} * ${c}) = ${result}`,
        highlightedElements: [
          { row: 0, col: 0, type: 'operation' }, { row: 1, col: 1, type: 'operation' },
          { row: 0, col: 1, type: 'operation' }, { row: 1, col: 0, type: 'operation' }
        ],
        currentState: cloneMatrix(m)
      });
    } else if (m.rows === 3) {
      const [
        [a, b, c],
        [d, e, f],
        [g, h, i]
      ] = m.data;
      const term1 = a * e * i;
      const term2 = b * f * g;
      const term3 = c * d * h;
      const term4 = c * e * g;
      const term5 = b * d * i;
      const term6 = a * f * h;
      result = (term1 + term2 + term3) - (term4 + term5 + term6);
      
      steps.push({
        stepNumber: 1,
        title: '3x3 Determinant (Rule of Sarrus)',
        description: 'Calculate the sum of the products of the main diagonals minus the sum of the products of the anti-diagonals.',
        calculation: `(${a}*${e}*${i} + ${b}*${f}*${g} + ${c}*${d}*${h}) - (${c}*${e}*${g} + ${b}*${d}*${i} + ${a}*${f}*${h}) = ${result}`,
        highlightedElements: [], // Would highlight diagonals ideally
        currentState: cloneMatrix(m)
      });
    } else {
      // For NxN > 3, use Laplace expansion on the first row (simplistic view)
      // Since building a full step-by-step recursive laplace is very complex for visualization,
      // we'll provide the final step and calculation.
      result = this._calculateDeterminantRec(m.data);
      steps.push({
        stepNumber: 1,
        title: 'NxN Determinant',
        description: 'Calculated using Laplace cofactor expansion.',
        calculation: `det = ${result}`,
        highlightedElements: [],
        currentState: cloneMatrix(m)
      });
    }

    return { input: m, steps, result, errors: [], warnings: [] };
  }

  private _calculateDeterminantRec(data: number[][]): number {
    const n = data.length;
    if (n === 1) return data[0][0];
    if (n === 2) return data[0][0] * data[1][1] - data[0][1] * data[1][0];
    let det = 0;
    for (let i = 0; i < n; i++) {
      const minor = data.slice(1).map(row => [...row.slice(0, i), ...row.slice(i + 1)]);
      det += data[0][i] * Math.pow(-1, i) * this._calculateDeterminantRec(minor);
    }
    return det;
  }

  public inverse(m: Matrix): SolverResult<Matrix> {
    const errors = validateMatrix(m);
    const steps: Step[] = [];

    if (m.rows !== m.cols) {
      errors.push("Only square matrices can have an inverse.");
    }
    
    if (errors.length > 0) {
      return { input: m, steps, result: createIdentityMatrix(1), errors, warnings: [] };
    }

    const detResult = this.determinant(m);
    if (detResult.result === 0) {
      errors.push("Determinant is 0. The matrix is singular and does not have an inverse.");
      return { input: m, steps, result: createIdentityMatrix(1), errors, warnings: [] };
    }

    steps.push({
      stepNumber: 1,
      title: 'Check Determinant',
      description: 'Verify the determinant is non-zero so the inverse exists.',
      calculation: `det = ${detResult.result} ≠ 0`,
      highlightedElements: [],
      currentState: cloneMatrix(m)
    });

    let resultMatrix: Matrix;

    if (m.rows === 2) {
      const [
        [a, b],
        [c, d]
      ] = m.data;
      const det = a * d - b * c;
      const invData = [
        [d / det, -b / det],
        [-c / det, a / det]
      ];
      resultMatrix = { data: invData, rows: 2, cols: 2 };
      steps.push({
        stepNumber: 2,
        title: '2x2 Inverse Formula',
        description: 'Swap a and d, negate b and c, and divide by the determinant.',
        calculation: `(1/${det}) * [[${d}, ${-b}], [${-c}, ${a}]]`,
        highlightedElements: [],
        currentState: resultMatrix
      });
    } else {
      // Use Gauss-Jordan
      const augData = m.data.map((row, i) => {
        const idRow = Array(m.rows).fill(0);
        idRow[i] = 1;
        return [...row, ...idRow];
      });
      
      steps.push({
        stepNumber: 2,
        title: 'Create Augmented Matrix',
        description: 'Append the identity matrix to the right of the original matrix [A | I].',
        highlightedElements: [],
        currentState: { data: augData, rows: m.rows, cols: m.cols * 2 }
      });

      // (Simplified Gauss-Jordan steps for length constraint)
      for (let i = 0; i < m.rows; i++) {
        const pivotVal = augData[i][i];
        for (let j = 0; j < m.cols * 2; j++) {
          augData[i][j] /= pivotVal;
        }
        for (let k = 0; k < m.rows; k++) {
          if (k !== i) {
            const factor = augData[k][i];
            for (let j = 0; j < m.cols * 2; j++) {
              augData[k][j] -= factor * augData[i][j];
            }
          }
        }
      }

      const invData = augData.map(row => row.slice(m.cols));
      resultMatrix = { data: invData, rows: m.rows, cols: m.cols };
      
      steps.push({
        stepNumber: 3,
        title: 'Gauss-Jordan Elimination',
        description: 'Reduce the left side to the identity matrix. The right side is the inverse.',
        highlightedElements: [],
        currentState: resultMatrix
      });
    }

    return { input: m, steps, result: resultMatrix, errors: [], warnings: [] };
  }

  public gaussianElimination(m: Matrix): SolverResult<Matrix> {
    const steps: Step[] = [];
    const data = m.data.map(r => [...r]);
    let stepCount = 1;

    steps.push({
      stepNumber: stepCount++,
      title: 'Initial Matrix',
      description: 'Start with the given matrix.',
      highlightedElements: [],
      currentState: { data: cloneMatrix(m).data, rows: m.rows, cols: m.cols }
    });

    for (let i = 0; i < Math.min(m.rows, m.cols); i++) {
      // Find pivot
      let maxEl = Math.abs(data[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < m.rows; k++) {
        if (Math.abs(data[k][i]) > maxEl) {
          maxEl = Math.abs(data[k][i]);
          maxRow = k;
        }
      }

      if (maxEl === 0) continue; // Skip column if all zeros

      // Swap rows
      if (maxRow !== i) {
        const temp = data[maxRow];
        data[maxRow] = data[i];
        data[i] = temp;
        steps.push({
          stepNumber: stepCount++,
          title: 'Swap Rows',
          description: `Swap row ${i + 1} with row ${maxRow + 1} to use the largest pivot.`,
          highlightedElements: [{ row: i, col: i, type: 'pivot' }],
          currentState: { data: data.map(r => [...r]), rows: m.rows, cols: m.cols }
        });
      }

      // Eliminate below
      for (let k = i + 1; k < m.rows; k++) {
        const factor = data[k][i] / data[i][i];
        if (factor === 0) continue;
        
        for (let j = i; j < m.cols; j++) {
          data[k][j] -= factor * data[i][j];
        }
        
        steps.push({
          stepNumber: stepCount++,
          title: `Eliminate Element`,
          description: `Eliminate element at row ${k + 1}, column ${i + 1} using pivot at row ${i + 1}.`,
          calculation: `R${k + 1} = R${k + 1} - (${formatNumber(factor)}) * R${i + 1}`,
          highlightedElements: [
            { row: i, col: i, type: 'pivot' },
            { row: k, col: i, type: 'eliminated' }
          ],
          currentState: { data: data.map(r => [...r]), rows: m.rows, cols: m.cols }
        });
      }
    }

    const resultMatrix = { data, rows: m.rows, cols: m.cols };
    steps.push({
      stepNumber: stepCount,
      title: 'Row Echelon Form',
      description: 'The matrix is now in row echelon form.',
      highlightedElements: [],
      currentState: resultMatrix
    });

    return { input: m, steps, result: resultMatrix, errors: [], warnings: [] };
  }

  public gaussJordan(m: Matrix): SolverResult<Matrix> {
    const steps: Step[] = [];
    const data = m.data.map(r => [...r]);
    let stepCount = 1;

    steps.push({
      stepNumber: stepCount++,
      title: 'Initial Matrix',
      description: 'Start with the given matrix.',
      highlightedElements: [],
      currentState: { data: cloneMatrix(m).data, rows: m.rows, cols: m.cols }
    });

    let h = 0;
    let k = 0;
    while (h < m.rows && k < m.cols) {
      let maxRow = h;
      let maxEl = Math.abs(data[h][k]);
      for (let i = h + 1; i < m.rows; i++) {
        if (Math.abs(data[i][k]) > maxEl) {
          maxEl = Math.abs(data[i][k]);
          maxRow = i;
        }
      }

      if (data[maxRow][k] === 0) {
        k++;
      } else {
        if (maxRow !== h) {
          const temp = data[maxRow];
          data[maxRow] = data[h];
          data[h] = temp;
          steps.push({
            stepNumber: stepCount++,
            title: 'Swap Rows',
            description: `Swap row ${h + 1} with row ${maxRow + 1}.`,
            highlightedElements: [{ row: h, col: k, type: 'pivot' }],
            currentState: { data: data.map(r => [...r]), rows: m.rows, cols: m.cols }
          });
        }
        
        const pivotVal = data[h][k];
        for (let j = k; j < m.cols; j++) {
          data[h][j] /= pivotVal;
        }
        steps.push({
          stepNumber: stepCount++,
          title: 'Normalize Pivot Row',
          description: `Divide row ${h + 1} by ${formatNumber(pivotVal)} to make the pivot 1.`,
          highlightedElements: [{ row: h, col: k, type: 'pivot' }],
          currentState: { data: data.map(r => [...r]), rows: m.rows, cols: m.cols }
        });

        for (let i = 0; i < m.rows; i++) {
          if (i !== h) {
            const factor = data[i][k];
            for (let j = k; j < m.cols; j++) {
              data[i][j] -= factor * data[h][j];
            }
            if (factor !== 0) {
                steps.push({
                  stepNumber: stepCount++,
                  title: 'Eliminate Elements',
                  description: `Eliminate element at row ${i + 1}, column ${k + 1}.`,
                  calculation: `R${i + 1} = R${i + 1} - (${formatNumber(factor)}) * R${h + 1}`,
                  highlightedElements: [
                    { row: h, col: k, type: 'pivot' },
                    { row: i, col: k, type: 'eliminated' }
                  ],
                  currentState: { data: data.map(r => [...r]), rows: m.rows, cols: m.cols }
                });
            }
          }
        }
        h++;
        k++;
      }
    }

    const resultMatrix = { data, rows: m.rows, cols: m.cols };
    steps.push({
      stepNumber: stepCount,
      title: 'Reduced Row Echelon Form',
      description: 'The matrix is now in reduced row echelon form.',
      highlightedElements: [],
      currentState: resultMatrix
    });

    return { input: m, steps, result: resultMatrix, errors: [], warnings: [] };
  }

  public cramerRule(coefficients: Matrix, constants: number[]): SolverResult<{solution: number[], determinants: number[]}> {
    const errors: string[] = [];
    if (coefficients.rows !== coefficients.cols) {
      errors.push("Coefficient matrix must be square for Cramer's rule.");
    }
    if (coefficients.rows !== constants.length) {
      errors.push("Number of constants must match the number of rows.");
    }

    const steps: Step[] = [];
    if (errors.length > 0) {
      return { input: { coefficients, constants }, steps, result: {solution: [], determinants: []}, errors, warnings: [] };
    }

    const detMain = this.determinant(coefficients).result;
    steps.push({
      stepNumber: 1,
      title: 'Calculate Main Determinant',
      description: 'Calculate the determinant of the coefficient matrix.',
      calculation: `D = ${detMain}`,
      highlightedElements: [],
      currentState: cloneMatrix(coefficients)
    });

    if (detMain === 0) {
      errors.push("Main determinant is 0. System has either no unique solution.");
      return { input: { coefficients, constants }, steps, result: {solution: [], determinants: [0]}, errors, warnings: [] };
    }

    const determinants = [detMain];
    const solution: number[] = [];
    let stepCount = 2;

    for (let i = 0; i < coefficients.cols; i++) {
      const modifiedData = coefficients.data.map((row, rIdx) => {
        const newRow = [...row];
        newRow[i] = constants[rIdx];
        return newRow;
      });
      const modMatrix = { data: modifiedData, rows: coefficients.rows, cols: coefficients.cols };
      const detVar = this.determinant(modMatrix).result;
      determinants.push(detVar);
      
      const val = detVar / detMain;
      solution.push(val);

      steps.push({
        stepNumber: stepCount++,
        title: `Calculate D${i + 1}`,
        description: `Replace column ${i + 1} with the constants vector and calculate determinant.`,
        calculation: `D${i + 1} = ${detVar}`,
        highlightedElements: Array.from({ length: coefficients.rows }, (_, r) => ({ row: r, col: i, type: 'operation' })),
        currentState: modMatrix
      });

      steps.push({
        stepNumber: stepCount++,
        title: `Solve for x${i + 1}`,
        description: `Divide D${i + 1} by D.`,
        calculation: `x${i + 1} = D${i + 1} / D = ${detVar} / ${detMain} = ${val}`,
        highlightedElements: [],
        currentState: modMatrix
      });
    }

    return { input: { coefficients, constants }, steps, result: { solution, determinants }, errors, warnings: [] };
  }

  public solveLinearSystem(coefficients: Matrix, constants: number[]): SolverResult<{type: 'unique'|'infinite'|'no-solution', solution?: number[]}> {
    // Basic wrapper to solve using Cramer's rule or fallback logic for non-unique systems
    // For complete implementation, it should use Gauss-Jordan and interpret the result.
    const cramer = this.cramerRule(coefficients, constants);
    if (cramer.errors.length > 0) {
      return {
        input: { coefficients, constants },
        steps: cramer.steps,
        result: { type: 'no-solution' }, // Simplified fallback
        errors: [],
        warnings: ["System is singular. Further analysis required for infinite vs no solution."]
      };
    }
    return {
      input: { coefficients, constants },
      steps: cramer.steps,
      result: { type: 'unique', solution: cramer.result.solution },
      errors: [],
      warnings: []
    };
  }

}
