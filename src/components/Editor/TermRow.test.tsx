import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TermRow } from './TermRow'

describe('TermRow', () => {
  const defaultTerm = {
    label: 'Test Label',
    value: 42,
    color: '#8CB4FF',
  }

  const defaultProps = {
    term: defaultTerm,
    idx: 0,
    onUpdate: vi.fn(),
    onRemove: vi.fn(),
    canRemove: true,
  }

  it('renders term label', () => {
    render(<TermRow {...defaultProps} />)
    const input = screen.getByDisplayValue('Test Label')
    expect(input).toBeInTheDocument()
  })

  it('renders term value', () => {
    render(<TermRow {...defaultProps} />)
    const input = screen.getByDisplayValue('42')
    expect(input).toBeInTheDocument()
  })

  it('calls onUpdate when label changes', () => {
    const onUpdate = vi.fn()
    render(<TermRow {...defaultProps} onUpdate={onUpdate} />)

    const input = screen.getByDisplayValue('Test Label')
    fireEvent.change(input, { target: { value: 'New Label' } })

    expect(onUpdate).toHaveBeenCalledWith('label', 'New Label')
  })

  it('calls onUpdate when value changes', () => {
    const onUpdate = vi.fn()
    render(<TermRow {...defaultProps} onUpdate={onUpdate} />)

    const input = screen.getByDisplayValue('42')
    fireEvent.change(input, { target: { value: '100' } })

    expect(onUpdate).toHaveBeenCalledWith('value', 100)
  })

  it('shows remove button when canRemove is true', () => {
    render(<TermRow {...defaultProps} canRemove={true} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(1)
  })

  it('hides remove button when canRemove is false', () => {
    render(<TermRow {...defaultProps} canRemove={false} />)
    // Only color picker button should be present
    const colorButton = screen.getByRole('button')
    expect(colorButton.className).toContain('color-indicator')
  })

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn()
    render(<TermRow {...defaultProps} onRemove={onRemove} />)

    const buttons = screen.getAllByRole('button')
    const removeButton = buttons.find(
      (btn) => btn.className.includes('btn-remove-term')
    )!
    fireEvent.click(removeButton)

    expect(onRemove).toHaveBeenCalled()
  })

  it('toggles color picker on color button click', () => {
    const { container } = render(<TermRow {...defaultProps} />)

    const colorButton = container.querySelector('.color-indicator')!
    fireEvent.click(colorButton)

    expect(screen.getByText('Other...')).toBeInTheDocument()
  })
})
