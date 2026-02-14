import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChartActions } from './ChartActions'

describe('ChartActions', () => {
  it('renders all action buttons', () => {
    const onPreview = vi.fn()
    const onSave = vi.fn()
    const onDownload = vi.fn()

    render(
      <ChartActions
        onPreview={onPreview}
        onSave={onSave}
        onDownload={onDownload}
      />
    )

    expect(screen.getByTitle('Preview animation')).toBeInTheDocument()
    expect(screen.getByTitle('Save to gallery')).toBeInTheDocument()
    expect(screen.getByTitle('Download')).toBeInTheDocument()
  })

  it('calls onPreview when preview button is clicked', () => {
    const onPreview = vi.fn()
    const onSave = vi.fn()
    const onDownload = vi.fn()

    render(
      <ChartActions
        onPreview={onPreview}
        onSave={onSave}
        onDownload={onDownload}
      />
    )

    fireEvent.click(screen.getByTitle('Preview animation'))
    expect(onPreview).toHaveBeenCalled()
  })

  it('calls onSave when save button is clicked', () => {
    const onPreview = vi.fn()
    const onSave = vi.fn()
    const onDownload = vi.fn()

    render(
      <ChartActions
        onPreview={onPreview}
        onSave={onSave}
        onDownload={onDownload}
      />
    )

    fireEvent.click(screen.getByTitle('Save to gallery'))
    expect(onSave).toHaveBeenCalled()
  })

  it('calls onDownload when download button is clicked', () => {
    const onPreview = vi.fn()
    const onSave = vi.fn()
    const onDownload = vi.fn()

    render(
      <ChartActions
        onPreview={onPreview}
        onSave={onSave}
        onDownload={onDownload}
      />
    )

    fireEvent.click(screen.getByTitle('Download'))
    expect(onDownload).toHaveBeenCalled()
  })
})
