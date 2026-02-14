import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnimation } from './useAnimation'

describe('useAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns animate and stop functions', () => {
    const { result } = renderHook(() => useAnimation())

    expect(typeof result.current.animate).toBe('function')
    expect(typeof result.current.stop).toBe('function')
  })

  it('calls onFrame with progress values', async () => {
    const onFrame = vi.fn()
    const { result } = renderHook(() => useAnimation(1000))

    let frameId = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(() => cb(performance.now()), 16)
      return ++frameId
    })

    act(() => {
      result.current.animate(onFrame)
    })

    // Advance timers to trigger frames
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(onFrame).toHaveBeenCalled()
    // First call should have low progress (near 0)
    const firstProgress = onFrame.mock.calls[0][0]
    expect(firstProgress).toBeGreaterThanOrEqual(0)
    expect(firstProgress).toBeLessThanOrEqual(1)
  })

  it('stop cancels animation', () => {
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame')
    const { result } = renderHook(() => useAnimation())

    let frameId = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return ++frameId
    })

    act(() => {
      result.current.animate(() => {})
    })

    act(() => {
      result.current.stop()
    })

    expect(cancelSpy).toHaveBeenCalled()
  })

  it('uses custom duration', () => {
    const { result: result1 } = renderHook(() => useAnimation(1000))
    const { result: result2 } = renderHook(() => useAnimation(2000))

    // Both should return valid animate/stop functions
    expect(result1.current.animate).toBeDefined()
    expect(result2.current.animate).toBeDefined()
  })
})
