import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  MatrixSolver,
  EquationSolver,
  FractionSolver,
  PercentageSolver,
  StatisticsSolver,
  PhysicsSolver,
  ChemistrySolver
} from '@/modules/math-engine'
import type { Matrix } from '@/modules/math-engine/types'

function toMatrix(data: number[][], label = 'A'): Matrix {
  return {
    data,
    rows: data.length,
    cols: data[0]?.length ?? 0,
    label,
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type = 'matrix', operation, matrixA: rawA, matrixB: rawB, scalar, ...rest } = body

    // 1. Matrix Solver
    if (type === 'matrix') {
      if (!rawA || !Array.isArray(rawA)) {
        return NextResponse.json({ error: 'Invalid matrixA' }, { status: 400 })
      }

      const solver = new MatrixSolver()
      const matrixA = toMatrix(rawA, 'A')
      const matrixB = rawB ? toMatrix(rawB, 'B') : null

      let result

      switch (operation) {
        case 'add':
          if (!matrixB) return NextResponse.json({ error: 'matrixB required' }, { status: 400 })
          result = solver.addMatrices(matrixA, matrixB)
          break
        case 'subtract':
          if (!matrixB) return NextResponse.json({ error: 'matrixB required' }, { status: 400 })
          result = solver.subtractMatrices(matrixA, matrixB)
          break
        case 'multiply':
          if (!matrixB) return NextResponse.json({ error: 'matrixB required' }, { status: 400 })
          result = solver.multiplyMatrices(matrixA, matrixB)
          break
        case 'determinant':
          result = solver.determinant(matrixA)
          break
        case 'inverse':
          result = solver.inverse(matrixA)
          break
        case 'transpose':
          result = solver.transpose(matrixA)
          break
        case 'scalar':
          if (scalar === undefined) {
            return NextResponse.json({ error: 'scalar required' }, { status: 400 })
          }
          result = solver.scalarMultiply(matrixA, Number(scalar))
          break
        case 'gauss':
          result = solver.gaussianElimination(matrixA)
          break
        case 'gauss-jordan':
          result = solver.gaussJordan(matrixA)
          break
        case 'cramer':
          if (!rest.constants || !Array.isArray(rest.constants)) {
            return NextResponse.json({ error: 'constants required for Cramer' }, { status: 400 })
          }
          result = solver.cramerRule(matrixA, rest.constants)
          break
        case 'linear-system':
          if (!rest.constants || !Array.isArray(rest.constants)) {
            return NextResponse.json({ error: 'constants required for Linear System' }, { status: 400 })
          }
          result = solver.solveLinearSystem(matrixA, rest.constants)
          break
        default:
          return NextResponse.json({ error: 'Unsupported matrix operation' }, { status: 400 })
      }

      return NextResponse.json(result)
    }

    // 2. Equation Solver
    if (type === 'equation') {
      const solver = new EquationSolver()
      if (operation === 'linear') {
        const { a = 1, b = 0, c = 0 } = rest
        const result = solver.solveLinear(Number(a), Number(b), Number(c))
        return NextResponse.json(result)
      } else if (operation === 'quadratic') {
        const { a = 1, b = 0, c = 0 } = rest
        const result = solver.solveQuadratic(Number(a), Number(b), Number(c))
        return NextResponse.json(result)
      }
      return NextResponse.json({ error: 'Unsupported equation operation' }, { status: 400 })
    }

    // 3. Fraction Solver
    if (type === 'fraction') {
      const solver = new FractionSolver()
      const { fractionA, fractionB } = rest
      if (!fractionA) return NextResponse.json({ error: 'fractionA required' }, { status: 400 })

      let result
      switch (operation) {
        case 'simplify':
          result = solver.simplify(fractionA)
          break
        case 'add':
          if (!fractionB) return NextResponse.json({ error: 'fractionB required' }, { status: 400 })
          result = solver.add(fractionA, fractionB)
          break
        case 'subtract':
          if (!fractionB) return NextResponse.json({ error: 'fractionB required' }, { status: 400 })
          result = solver.subtract(fractionA, fractionB)
          break
        case 'multiply':
          if (!fractionB) return NextResponse.json({ error: 'fractionB required' }, { status: 400 })
          result = solver.multiply(fractionA, fractionB)
          break
        case 'divide':
          if (!fractionB) return NextResponse.json({ error: 'fractionB required' }, { status: 400 })
          result = solver.divide(fractionA, fractionB)
          break
        default:
          return NextResponse.json({ error: 'Unsupported fraction operation' }, { status: 400 })
      }
      return NextResponse.json(result)
    }

    // 4. Percentage Solver
    if (type === 'percentage') {
      const solver = new PercentageSolver()
      const { value, percentage, isIncrease, v1, v2 } = rest
      let result
      if (operation === 'calculate') {
        result = solver.calculatePercentage(Number(percentage), Number(value))
      } else if (operation === 'variation') {
        result = solver.applyVariation(Number(value), Number(percentage), Boolean(isIncrease))
      } else if (operation === 'between') {
        result = solver.calculateVariationBetween(Number(v1), Number(v2))
      } else {
        return NextResponse.json({ error: 'Unsupported percentage operation' }, { status: 400 })
      }
      return NextResponse.json(result)
    }

    // 5. Statistics Solver
    if (type === 'statistics') {
      const solver = new StatisticsSolver()
      const { data } = rest
      if (!data || !Array.isArray(data)) {
        return NextResponse.json({ error: 'data array required' }, { status: 400 })
      }
      const result = solver.analyze(data.map(Number))
      return NextResponse.json(result)
    }

    // 6. Physics Solver
    if (type === 'physics') {
      const solver = new PhysicsSolver()
      let result
      switch (operation) {
        case 'mruv':
          result = solver.solveMRUV(rest)
          break
        case 'torricelli':
          result = solver.solveTorricelli(rest)
          break
        case 'newton':
          result = solver.solveNewtonSecondLaw(rest)
          break
        case 'kinetic-energy':
          result = solver.solveKineticEnergy(Number(rest.m), Number(rest.v))
          break
        default:
          return NextResponse.json({ error: 'Unsupported physics operation' }, { status: 400 })
      }
      return NextResponse.json(result)
    }

    // 7. Chemistry Solver
    if (type === 'chemistry') {
      const solver = new ChemistrySolver()
      let result
      switch (operation) {
        case 'ideal-gas':
          result = solver.solveIdealGas(rest)
          break
        case 'density':
          result = solver.solveDensity(Number(rest.m), Number(rest.v))
          break
        case 'molar-amount':
          result = solver.solveMolarAmount(Number(rest.massGrams), Number(rest.molarMass))
          break
        default:
          return NextResponse.json({ error: 'Unsupported chemistry operation' }, { status: 400 })
      }
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Unsupported problem type' }, { status: 400 })
  } catch (error) {
    console.error('[EXERCISES_SOLVE_POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
