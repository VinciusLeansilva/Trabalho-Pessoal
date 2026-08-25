import { describe, it, expect } from 'vitest'
import { formatFileSize, generateInitials, slugify, truncate } from '@/lib/utils'

describe('formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1048576)).toBe('1 MB')
    expect(formatFileSize(1073741824)).toBe('1 GB')
  })
})

describe('generateInitials', () => {
  it('generates initials from full name', () => {
    expect(generateInitials('João Silva')).toBe('JS')
    expect(generateInitials('Carlos Santos Lima')).toBe('CL')
    expect(generateInitials('Ana')).toBe('A')
  })
})

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...')
    expect(truncate('Hi', 10)).toBe('Hi')
  })
})

describe('slugify', () => {
  it('converts text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('Matrizes e Determinantes')).toBe('matrizes-e-determinantes')
  })
})
