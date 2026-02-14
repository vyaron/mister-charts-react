import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChartTypeSelector } from './ChartTypeSelector'

describe('ChartTypeSelector', () => {
  it('renders all chart types', () => {
    const onSelect = vi.fn()
    render(<ChartTypeSelector currentType="circles" onSelect={onSelect} />)

    expect(screen.getByText('Circles')).toBeInTheDocument()
    expect(screen.getByText('Donut')).toBeInTheDocument()
    expect(screen.getByText('Rectangles')).toBeInTheDocument()
    expect(screen.getByText('Bars')).toBeInTheDocument()
  })

  it('calls onSelect when chart type is clicked', () => {
    const onSelect = vi.fn()
    render(<ChartTypeSelector currentType="circles" onSelect={onSelect} />)

    fireEvent.click(screen.getByText('Bars'))
    expect(onSelect).toHaveBeenCalledWith('bars')
  })

  it('renders images for each chart type', () => {
    const onSelect = vi.fn()
    render(<ChartTypeSelector currentType="circles" onSelect={onSelect} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(4)
  })
})
