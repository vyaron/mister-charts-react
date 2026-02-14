import { describe, it, expect } from 'vitest'
import {
  getNextChartColor,
  getChartColors,
  getFonts,
  makeId,
} from './util.service'

describe('util.service', () => {
  describe('getNextChartColor', () => {
    it('returns correct color for index 0', () => {
      expect(getNextChartColor(0)).toBe('#8CB4FF')
    })

    it('returns correct color for index 1', () => {
      expect(getNextChartColor(1)).toBe('#688FD9')
    })

    it('wraps around when index exceeds array length', () => {
      expect(getNextChartColor(5)).toBe('#8CB4FF')
      expect(getNextChartColor(6)).toBe('#688FD9')
    })
  })

  describe('getChartColors', () => {
    it('returns array of 5 colors', () => {
      const colors = getChartColors()
      expect(colors).toHaveLength(5)
    })

    it('returns valid hex colors', () => {
      const colors = getChartColors()
      colors.forEach((color) => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      })
    })
  })

  describe('getFonts', () => {
    it('returns array of fonts', () => {
      const fonts = getFonts()
      expect(fonts.length).toBeGreaterThan(0)
    })

    it('includes Arial', () => {
      const fonts = getFonts()
      expect(fonts).toContain('Arial')
    })
  })

  describe('makeId', () => {
    it('generates id with default length of 8', () => {
      const id = makeId()
      expect(id).toHaveLength(8)
    })

    it('generates id with custom length', () => {
      const id = makeId(12)
      expect(id).toHaveLength(12)
    })

    it('generates unique ids', () => {
      const ids = new Set(Array.from({ length: 100 }, () => makeId()))
      expect(ids.size).toBe(100)
    })

    it('only contains alphanumeric characters', () => {
      const id = makeId(100)
      expect(id).toMatch(/^[A-Za-z0-9]+$/)
    })
  })
})
