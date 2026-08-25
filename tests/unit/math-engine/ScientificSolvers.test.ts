import { describe, it, expect } from 'vitest';
import {
  EquationSolver,
  FractionSolver,
  PercentageSolver,
  StatisticsSolver,
  PhysicsSolver,
  ChemistrySolver
} from '@/modules/math-engine';

describe('Scientific Solvers Suite', () => {
  describe('EquationSolver', () => {
    const solver = new EquationSolver();

    it('solves linear equation 2x + 4 = 10', () => {
      const res = solver.solveLinear(2, 4, 10);
      expect(res.errors).toHaveLength(0);
      expect(res.result.x).toBe(3);
      expect(res.steps.length).toBeGreaterThan(1);
    });

    it('solves quadratic equation x^2 - 5x + 6 = 0 (roots 2 and 3)', () => {
      const res = solver.solveQuadratic(1, -5, 6);
      expect(res.errors).toHaveLength(0);
      expect(res.result.delta).toBe(1);
      expect(res.result.roots).toEqual([3, 2]);
      expect(res.result.isComplex).toBe(false);
      expect(res.result.vertex.x).toBe(2.5);
    });

    it('handles quadratic with delta < 0 (complex roots)', () => {
      const res = solver.solveQuadratic(1, 0, 4); // x^2 + 4 = 0
      expect(res.result.delta).toBe(-16);
      expect(res.result.isComplex).toBe(true);
    });
  });

  describe('FractionSolver', () => {
    const solver = new FractionSolver();

    it('simplifies fraction 8/12 to 2/3', () => {
      const res = solver.simplify({ numerator: 8, denominator: 12 });
      expect(res.result.simplified).toEqual({ numerator: 2, denominator: 3 });
    });

    it('adds fractions 1/3 + 1/6 = 1/2', () => {
      const res = solver.add({ numerator: 1, denominator: 3 }, { numerator: 1, denominator: 6 });
      expect(res.result.simplified).toEqual({ numerator: 1, denominator: 2 });
      expect(res.result.decimal).toBe(0.5);
    });

    it('multiplies fractions 2/3 * 3/4 = 1/2', () => {
      const res = solver.multiply({ numerator: 2, denominator: 3 }, { numerator: 3, denominator: 4 });
      expect(res.result.simplified).toEqual({ numerator: 1, denominator: 2 });
    });

    it('divides fractions 1/2 / 1/4 = 2/1', () => {
      const res = solver.divide({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 4 });
      expect(res.result.simplified).toEqual({ numerator: 2, denominator: 1 });
    });
  });

  describe('PercentageSolver', () => {
    const solver = new PercentageSolver();

    it('calculates 15% of 200 = 30', () => {
      const res = solver.calculatePercentage(15, 200);
      expect(res.result.value).toBe(30);
    });

    it('applies 20% increase on 100 = 120', () => {
      const res = solver.applyVariation(100, 20, true);
      expect(res.result.value).toBe(120);
    });

    it('applies 10% discount on 200 = 180', () => {
      const res = solver.applyVariation(200, 10, false);
      expect(res.result.value).toBe(180);
    });

    it('calculates variation from 50 to 75 = 50%', () => {
      const res = solver.calculateVariationBetween(50, 75);
      expect(res.result.percentage).toBe(50);
    });
  });

  describe('StatisticsSolver', () => {
    const solver = new StatisticsSolver();

    it('calculates mean, median, mode and std dev for [2, 4, 4, 4, 5, 5, 7, 9]', () => {
      const data = [2, 4, 4, 4, 5, 5, 7, 9];
      const res = solver.analyze(data);
      expect(res.result.count).toBe(8);
      expect(res.result.mean).toBe(5);
      expect(res.result.median).toBe(4.5);
      expect(res.result.mode).toEqual([4]);
      expect(res.result.min).toBe(2);
      expect(res.result.max).toBe(9);
      expect(res.result.range).toBe(7);
      expect(res.result.standardDeviation).toBeCloseTo(2, 1);
    });
  });

  describe('PhysicsSolver', () => {
    const solver = new PhysicsSolver();

    it('solves MRUV final velocity v = v0 + at', () => {
      const res = solver.solveMRUV({ v0: 10, a: 2, t: 5 });
      expect(res.result.value).toBe(20);
      expect(res.result.unit).toBe('m/s');
    });

    it('solves Torricelli equation v^2 = v0^2 + 2*a*ds', () => {
      const res = solver.solveTorricelli({ v0: 0, a: 2, deltaS: 25 });
      expect(res.result.value).toBe(10);
      expect(res.result.unit).toBe('m/s');
    });

    it('solves Newton 2nd law F = m * a', () => {
      const res = solver.solveNewtonSecondLaw({ m: 10, a: 5 });
      expect(res.result.value).toBe(50);
      expect(res.result.unit).toBe('N');
    });

    it('solves Kinetic Energy Ec = (m * v^2)/2', () => {
      const res = solver.solveKineticEnergy(2, 10);
      expect(res.result.value).toBe(100);
      expect(res.result.unit).toBe('J');
    });
  });

  describe('ChemistrySolver', () => {
    const solver = new ChemistrySolver();

    it('solves ideal gas law for pressure P = nRT/V', () => {
      const res = solver.solveIdealGas({ v: 22.4, n: 1, t: 273.15, r: 0.082 });
      expect(res.result.value).toBeCloseTo(1, 0.1);
      expect(res.result.unit).toBe('atm');
    });

    it('solves density d = m / V', () => {
      const res = solver.solveDensity(100, 50);
      expect(res.result.value).toBe(2);
      expect(res.result.unit).toBe('g/cm³');
    });

    it('solves molar amount n = m / M', () => {
      const res = solver.solveMolarAmount(36, 18); // 36g H2O
      expect(res.result.value).toBe(2);
      expect(res.result.unit).toBe('mol');
    });
  });
});
