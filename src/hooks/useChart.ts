import { useState, useCallback } from 'react'
import type { Chart, Term, ChartType, ValueType } from '../types/chart.types'
import { getDefaultChart, createTerm } from '../services/chart.service'

export function useChart(initialChart?: Chart) {
  const [chart, setChart] = useState<Chart>(initialChart || getDefaultChart())

  const updateTitle = useCallback((title: string) => {
    setChart((prev) => ({ ...prev, title }))
  }, [])

  const updateType = useCallback((type: ChartType) => {
    setChart((prev) => ({ ...prev, type }))
  }, [])

  const updateTerm = useCallback((idx: number, key: keyof Term, value: string | number) => {
    setChart((prev) => ({
      ...prev,
      terms: prev.terms.map((term, i) =>
        i === idx ? { ...term, [key]: value } : term
      ),
    }))
  }, [])

  const addTerm = useCallback(() => {
    setChart((prev) => {
      if (prev.terms.length >= 5) return prev
      return {
        ...prev,
        terms: [...prev.terms, createTerm(prev.terms.length)],
      }
    })
  }, [])

  const removeTerm = useCallback((idx: number) => {
    setChart((prev) => {
      if (prev.terms.length <= 2) return prev
      return {
        ...prev,
        terms: prev.terms.filter((_, i) => i !== idx),
      }
    })
  }, [])

  const setValueType = useCallback((valueType: ValueType) => {
    setChart((prev) => ({ ...prev, valueType }))
  }, [])

  const setFont = useCallback((font: string) => {
    setChart((prev) => ({
      ...prev,
      style: { ...prev.style, font },
    }))
  }, [])

  const loadChart = useCallback((newChart: Chart) => {
    setChart(newChart)
  }, [])

  const resetChart = useCallback(() => {
    setChart(getDefaultChart())
  }, [])

  return {
    chart,
    updateTitle,
    updateType,
    updateTerm,
    addTerm,
    removeTerm,
    setValueType,
    setFont,
    loadChart,
    resetChart,
  }
}
