import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ColorPicker } from './ColorPicker'

describe('ColorPicker', () => {
  const defaultProps = {
    currentColor: '#8CB4FF',
    onSelect: vi.fn(),
    onChange: vi.fn(),
  }

  it('renders color swatches', () => {
    render(<ColorPicker {...defaultProps} />)
    const swatches = screen.getAllByRole('button', { name: '' })
    // 5 color swatches + 1 "Other..." button
    expect(swatches.length).toBeGreaterThanOrEqual(5)
  })

  it('renders Other button', () => {
    render(<ColorPicker {...defaultProps} />)
    expect(screen.getByText('Other...')).toBeInTheDocument()
  })

  it('calls onSelect when swatch is clicked', () => {
    const onSelect = vi.fn()
    render(<ColorPicker {...defaultProps} onSelect={onSelect} />)

    const swatches = screen.getAllByRole('button', { name: '' })
    fireEvent.click(swatches[0])

    expect(onSelect).toHaveBeenCalled()
  })

  it('renders hidden color input', () => {
    const { container } = render(<ColorPicker {...defaultProps} />)
    const colorInput = container.querySelector('input[type="color"]')
    expect(colorInput).toBeInTheDocument()
  })

  it('color input has correct current value', () => {
    const { container } = render(
      <ColorPicker {...defaultProps} currentColor="#FF0000" />
    )
    const colorInput = container.querySelector(
      'input[type="color"]'
    ) as HTMLInputElement
    expect(colorInput.value).toBe('#ff0000')
  })

  it('calls onChange when native color picker value changes', () => {
    const onChange = vi.fn()
    const { container } = render(
      <ColorPicker {...defaultProps} onChange={onChange} />
    )

    const colorInput = container.querySelector('input[type="color"]')!
    fireEvent.input(colorInput, { target: { value: '#FF0000' } })

    expect(onChange).toHaveBeenCalledWith('#ff0000')
  })
})
