import { describe, it, expect } from 'vitest'
import {
  getChartTypes,
  createTerm,
  getDefaultChart,
  easeOut,
} from './chart.service'

describe('chart.service', () => {
  describe('getChartTypes', () => {
    it('returns array of 4 chart types', () => {
      const types = getChartTypes()
      expect(types).toHaveLength(4)
    })

    it('includes all expected chart types', () => {
      const types = getChartTypes()
      const typeNames = types.map((t) => t.type)
      expect(typeNames).toContain('circles')
      expect(typeNames).toContain('donut')
      expect(typeNames).toContain('rectangles')
      expect(typeNames).toContain('bars')
    })

    it('each chart type has name and icon', () => {
      const types = getChartTypes()
      types.forEach((type) => {
        expect(type.name).toBeTruthy()
        expect(type.icon).toBeTruthy()
      })
    })
  })

  describe('createTerm', () => {
    it('creates term with default values', () => {
      const term = createTerm(0)
      expect(term.label).toBe('')
      expect(term.value).toBe(1)
      expect(term.color).toBeTruthy()
    })

    it('assigns different colors for different indices', () => {
      const term0 = createTerm(0)
      const term1 = createTerm(1)
      expect(term0.color).not.toBe(term1.color)
    })
  })

  describe('getDefaultChart', () => {
    it('returns chart with default title', () => {
      const chart = getDefaultChart()
      expect(chart.title).toBe('Elections Results')
    })

    it('returns chart with circles type', () => {
      const chart = getDefaultChart()
      expect(chart.type).toBe('circles')
    })

    it('returns chart with 2 terms', () => {
      const chart = getDefaultChart()
      expect(chart.terms).toHaveLength(2)
    })

    it('returns chart with Arial font', () => {
      const chart = getDefaultChart()
      expect(chart.style.font).toBe('Arial')
    })

    it('returns chart with value mode', () => {
      const chart = getDefaultChart()
      expect(chart.valueType).toBe('value')
    })
  })

  describe('easeOut', () => {
    it('returns 0 for input 0', () => {
      expect(easeOut(0)).toBe(0)
    })

    it('returns 1 for input 1', () => {
      expect(easeOut(1)).toBe(1)
    })

    it('returns value between 0 and 1 for input 0.5', () => {
      const result = easeOut(0.5)
      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThan(1)
    })

    it('eases out (faster at start, slower at end)', () => {
      // Ease out should be above linear
      expect(easeOut(0.5)).toBeGreaterThan(0.5)
    })
  })
})
