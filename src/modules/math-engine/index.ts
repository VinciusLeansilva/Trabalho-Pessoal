export * from './types';
export * from './utils';
export * from './matrix/MatrixSolver';
export * from './solvers/EquationSolver';
export * from './solvers/FractionSolver';
export * from './solvers/PercentageSolver';
export * from './solvers/StatisticsSolver';
export * from './solvers/PhysicsSolver';
export * from './solvers/ChemistrySolver';

import { MatrixSolver } from './matrix/MatrixSolver';
import { EquationSolver } from './solvers/EquationSolver';
import { FractionSolver } from './solvers/FractionSolver';
import { PercentageSolver } from './solvers/PercentageSolver';
import { StatisticsSolver } from './solvers/StatisticsSolver';
import { PhysicsSolver } from './solvers/PhysicsSolver';
import { ChemistrySolver } from './solvers/ChemistrySolver';

export function createMatrixSolver(): MatrixSolver {
  return new MatrixSolver();
}

export function createEquationSolver(): EquationSolver {
  return new EquationSolver();
}

export function createFractionSolver(): FractionSolver {
  return new FractionSolver();
}

export function createPercentageSolver(): PercentageSolver {
  return new PercentageSolver();
}

export function createStatisticsSolver(): StatisticsSolver {
  return new StatisticsSolver();
}

export function createPhysicsSolver(): PhysicsSolver {
  return new PhysicsSolver();
}

export function createChemistrySolver(): ChemistrySolver {
  return new ChemistrySolver();
}
