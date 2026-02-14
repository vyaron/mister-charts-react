import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChart } from './useChart'

describe('useChart', () => {
  it('initializes with default chart', () => {
    const { result } = renderHook(() => useChart())

    expect(result.current.chart.title).toBe('Elections Results')
    expect(result.current.chart.type).toBe('circles')
    expect(result.current.chart.terms).toHaveLength(2)
  })

  it('updates title', () => {
    const { result } = renderHook(() => useChart())

    act(() => {
      result.current.updateTitle('New Title')
    })

    expect(result.current.chart.title).toBe('New Title')
  })

  it('updates chart type', () => {
    const { result } = renderHook(() => useChart())

    act(() => {
      result.current.updateType('bars')
    })

    expect(result.current.chart.type).toBe('bars')
  })

  it('updates term', () => {
    const { result } = renderHook(() => useChart())

    act(() => {
      result.current.updateTerm(0, 'label', 'First Term')
    })

    expect(result.current.chart.terms[0].label).toBe('First Term')
  })

  it('updates term value', () => {
    const { result } = renderHook(() => useChart())

    act(() => {
      result.current.updateTerm(0, 'value', 50)
    })

    expect(result.current.chart.terms[0].value).toBe(50)
  })

  it('adds term when under limit', () => {
    const { result } = renderHook(() => useChart())
    const initialCount = result.current.chart.terms.length

    act(() => {
      result.current.addTerm()
    })

    expect(result.current.chart.terms).toHaveLength(initialCount + 1)
  })

  it('does not add term when at 5 terms', () => {
    const { result } = renderHook(() => useChart())

    // Add terms to reach limit
    act(() => {
      result.current.addTerm()
      result.current.addTerm()
      result.current.addTerm()
    })

    expect(result.current.chart.terms).toHaveLength(5)

    // Try to add one more
    act(() => {
      result.current.addTerm()
    })

    expect(result.current.chart.terms).toHaveLength(5)
  })

  it('removes term when above minimum', () => {
    const { result } = renderHook(() => useChart())

    act(() => {
      result.current.addTerm()
    })

    const countBefore = result.current.chart.terms.length

    act(() => {
      result.current.removeTerm(0)
    })

    expect(result.current.chart.terms).toHaveLength(countBefore - 1)
  })

  it('does not remove term when at 2 terms', () => {
    const { result } = renderHook(() => useChart())

    expect(result.current.chart.terms).toHaveLength(2)

    act(() => {
      result.current.removeTerm(0)
    })

    expect(result.current.chart.terms).toHaveLength(2)
  })

  it('sets value type', () => {
    const { result } = renderHook(() => useChart())

    act(() => {
      result.current.setValueType('percent')
    })

    expect(result.current.chart.valueType).toBe('percent')
  })

  it('sets font', () => {
    const { result } = renderHook(() => useChart())

    act(() => {
      result.current.setFont('Roboto')
    })

    expect(result.current.chart.style.font).toBe('Roboto')
  })

  it('loads chart', () => {
    const { result } = renderHook(() => useChart())

    const newChart = {
      title: 'Loaded Chart',
      type: 'donut' as const,
      terms: [{ label: 'X', value: 100, color: '#fff' }],
      style: { font: 'Lato', fontSize: '45px', backgroundColor: 'transparent' },
      valueType: 'percent' as const,
    }

    act(() => {
      result.current.loadChart(newChart)
    })

    expect(result.current.chart.title).toBe('Loaded Chart')
    expect(result.current.chart.type).toBe('donut')
  })

  it('resets chart to default', () => {
    const { result } = renderHook(() => useChart())

    act(() => {
      result.current.updateTitle('Custom Title')
      result.current.updateType('bars')
    })

    act(() => {
      result.current.resetChart()
    })

    expect(result.current.chart.title).toBe('Elections Results')
    expect(result.current.chart.type).toBe('circles')
  })
})
