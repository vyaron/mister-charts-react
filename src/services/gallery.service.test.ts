import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getSavedCharts,
  saveChart,
  deleteChart,
  getChartById,
} from './gallery.service'
import type { Chart } from '../types/chart.types'

describe('gallery.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem = vi.fn()
    localStorage.setItem = vi.fn()
  })

  const mockChart: Chart = {
    title: 'Test Chart',
    type: 'bars',
    terms: [
      { label: 'A', value: 10, color: '#8CB4FF' },
      { label: 'B', value: 20, color: '#688FD9' },
    ],
    style: { font: 'Arial', fontSize: '45px', backgroundColor: 'transparent' },
    valueType: 'value',
  }

  describe('getSavedCharts', () => {
    it('returns empty array when no data in localStorage', () => {
      ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null)
      const charts = getSavedCharts()
      expect(charts).toEqual([])
    })

    it('returns parsed charts from localStorage', () => {
      const savedCharts = [{ id: '1', title: 'Chart 1' }]
      ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
        JSON.stringify(savedCharts)
      )
      const charts = getSavedCharts()
      expect(charts).toEqual(savedCharts)
    })
  })

  describe('saveChart', () => {
    it('saves chart to localStorage', () => {
      ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('[]')

      const result = saveChart(mockChart, 'data:image/png;base64,test')

      expect(result.title).toBe('Test Chart')
      expect(result.type).toBe('bars')
      expect(result.thumbnail).toBe('data:image/png;base64,test')
      expect(result.id).toMatch(/^chart_\d+$/)
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('adds new chart at beginning of array', () => {
      const existingCharts = [{ id: 'old', title: 'Old Chart' }]
      ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
        JSON.stringify(existingCharts)
      )

      saveChart(mockChart, 'data:image/png;base64,test')

      const setItemCall = (localStorage.setItem as ReturnType<typeof vi.fn>).mock.calls[0]
      const savedData = JSON.parse(setItemCall[1])
      expect(savedData[0].title).toBe('Test Chart')
      expect(savedData[1].id).toBe('old')
    })
  })

  describe('deleteChart', () => {
    it('removes chart by id', () => {
      const charts = [
        { id: 'chart_1', title: 'Chart 1' },
        { id: 'chart_2', title: 'Chart 2' },
      ]
      ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
        JSON.stringify(charts)
      )

      deleteChart('chart_1')

      const setItemCall = (localStorage.setItem as ReturnType<typeof vi.fn>).mock.calls[0]
      const savedData = JSON.parse(setItemCall[1])
      expect(savedData).toHaveLength(1)
      expect(savedData[0].id).toBe('chart_2')
    })
  })

  describe('getChartById', () => {
    it('returns chart when found', () => {
      const charts = [
        { id: 'chart_1', title: 'Chart 1' },
        { id: 'chart_2', title: 'Chart 2' },
      ]
      ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
        JSON.stringify(charts)
      )

      const chart = getChartById('chart_2')
      expect(chart?.title).toBe('Chart 2')
    })

    it('returns undefined when not found', () => {
      ;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('[]')
      const chart = getChartById('nonexistent')
      expect(chart).toBeUndefined()
    })
  })
})
