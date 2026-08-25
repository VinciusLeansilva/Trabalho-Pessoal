import { describe, it, expect } from 'vitest'
import { MatrixSolver } from '@/modules/math-engine'

describe('MatrixSolver', () => {
  const solver = new MatrixSolver()
  
  describe('addMatrices', () => {
    it('adds two 2x2 matrices correctly', () => {
      const a = { data: [[1,2],[3,4]], rows: 2, cols: 2, label: 'A' }
      const b = { data: [[5,6],[7,8]], rows: 2, cols: 2, label: 'B' }
      const result = solver.addMatrices(a, b)
      expect(result.result.data).toEqual([[6,8],[10,12]])
      expect(result.errors).toHaveLength(0)
      expect(result.steps.length).toBeGreaterThan(0)
    })
    
    it('returns error for incompatible dimensions', () => {
      const a = { data: [[1,2],[3,4]], rows: 2, cols: 2, label: 'A' }
      const b = { data: [[1,2,3]], rows: 1, cols: 3, label: 'B' }
      const result = solver.addMatrices(a, b)
      expect(result.errors.length).toBeGreaterThan(0)
    })
    
    it('generates step-by-step with highlighted elements', () => {
      const a = { data: [[1,2],[3,4]], rows: 2, cols: 2, label: 'A' }
      const b = { data: [[5,6],[7,8]], rows: 2, cols: 2, label: 'B' }
      const result = solver.addMatrices(a, b)
      // Each step should have highlighted elements
      const hasHighlights = result.steps.some(s => s.highlightedElements.length > 0)
      expect(hasHighlights).toBe(true)
    })
  })
  
  describe('determinant', () => {
    it('calculates 2x2 determinant correctly', () => {
      // det([[2,3],[1,4]]) = 2*4 - 3*1 = 5
      const m = { data: [[2,3],[1,4]], rows: 2, cols: 2, label: 'A' }
      const result = solver.determinant(m)
      expect(result.result).toBe(5)
      expect(result.errors).toHaveLength(0)
    })
    
    it('calculates 3x3 determinant correctly', () => {
      // det([[1,2,3],[4,5,6],[7,8,9]]) = 0
      const m = { data: [[1,2,3],[4,5,6],[7,8,9]], rows: 3, cols: 3, label: 'A' }
      const result = solver.determinant(m)
      expect(result.result).toBeCloseTo(0, 5)
    })
    
    it('returns error for non-square matrix', () => {
      const m = { data: [[1,2,3],[4,5,6]], rows: 2, cols: 3, label: 'A' }
      const result = solver.determinant(m)
      expect(result.errors.length).toBeGreaterThan(0)
    })
    
    it('det of identity matrix is 1', () => {
      const m = { data: [[1,0,0],[0,1,0],[0,0,1]], rows: 3, cols: 3, label: 'I' }
      const result = solver.determinant(m)
      expect(result.result).toBe(1)
    })
  })
  
  describe('transpose', () => {
    it('transposes 2x3 matrix to 3x2', () => {
      const m = { data: [[1,2,3],[4,5,6]], rows: 2, cols: 3, label: 'A' }
      const result = solver.transpose(m)
      expect(result.result.rows).toBe(3)
      expect(result.result.cols).toBe(2)
      expect(result.result.data[0][0]).toBe(1)
      expect(result.result.data[0][1]).toBe(4)
    })
  })
  
  describe('multiplyMatrices', () => {
    it('multiplies 2x2 matrices', () => {
      // [[1,2],[3,4]] * [[5,6],[7,8]] = [[19,22],[43,50]]
      const a = { data: [[1,2],[3,4]], rows: 2, cols: 2, label: 'A' }
      const b = { data: [[5,6],[7,8]], rows: 2, cols: 2, label: 'B' }
      const result = solver.multiplyMatrices(a, b)
      expect(result.result.data[0][0]).toBe(19)
      expect(result.result.data[0][1]).toBe(22)
      expect(result.result.data[1][0]).toBe(43)
      expect(result.result.data[1][1]).toBe(50)
    })
    
    it('returns error when dimensions are incompatible', () => {
      const a = { data: [[1,2,3]], rows: 1, cols: 3, label: 'A' }
      const b = { data: [[1,2],[3,4]], rows: 2, cols: 2, label: 'B' }
      const result = solver.multiplyMatrices(a, b)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })
  
  describe('inverse', () => {
    it('calculates inverse of 2x2 matrix', () => {
      // [[2,3],[1,4]]^-1 = (1/5) * [[4,-3],[-1,2]] = [[0.8,-0.6],[-0.2,0.4]]
      const m = { data: [[2,3],[1,4]], rows: 2, cols: 2, label: 'A' }
      const result = solver.inverse(m)
      expect(result.result.data[0][0]).toBeCloseTo(0.8, 5)
      expect(result.result.data[0][1]).toBeCloseTo(-0.6, 5)
      expect(result.errors).toHaveLength(0)
    })
    
    it('returns error for singular matrix', () => {
      // det = 0, so no inverse
      const m = { data: [[1,2],[2,4]], rows: 2, cols: 2, label: 'A' }
      const result = solver.inverse(m)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })
  
  describe('scalarMultiply', () => {
    it('multiplies each element by scalar', () => {
      const m = { data: [[1,2],[3,4]], rows: 2, cols: 2, label: 'A' }
      const result = solver.scalarMultiply(m, 3)
      expect(result.result.data[0][0]).toBe(3)
      expect(result.result.data[1][1]).toBe(12)
    })
  })
  
  describe('gaussianElimination', () => {
    it('reduces a 3x4 augmented matrix', () => {
      // System: x + y = 3, 2x - y = 0 -> x=1, y=2
      const m = { data: [[1,1,3],[2,-1,0]], rows: 2, cols: 3, label: 'A' }
      const result = solver.gaussianElimination(m)
      expect(result.errors).toHaveLength(0)
      expect(result.steps.length).toBeGreaterThan(0)
    })
  })
})
