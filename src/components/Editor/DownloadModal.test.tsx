import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DownloadModal } from './DownloadModal'

describe('DownloadModal', () => {
  const defaultProps = {
    isGenerating: false,
    progress: 0,
    onDownloadGIF: vi.fn(),
    onDownloadPNG: vi.fn(),
    onClose: vi.fn(),
  }

  it('renders download options when not generating', () => {
    render(<DownloadModal {...defaultProps} />)

    expect(screen.getByText('Download Chart')).toBeInTheDocument()
    expect(screen.getByText('Animated GIF')).toBeInTheDocument()
    expect(screen.getByText('Static PNG')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onDownloadGIF when GIF button is clicked', () => {
    const onDownloadGIF = vi.fn()
    render(<DownloadModal {...defaultProps} onDownloadGIF={onDownloadGIF} />)

    fireEvent.click(screen.getByText('Animated GIF'))
    expect(onDownloadGIF).toHaveBeenCalled()
  })

  it('calls onDownloadPNG when PNG button is clicked', () => {
    const onDownloadPNG = vi.fn()
    render(<DownloadModal {...defaultProps} onDownloadPNG={onDownloadPNG} />)

    fireEvent.click(screen.getByText('Static PNG'))
    expect(onDownloadPNG).toHaveBeenCalled()
  })

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn()
    render(<DownloadModal {...defaultProps} onClose={onClose} />)

    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    render(<DownloadModal {...defaultProps} onClose={onClose} />)

    fireEvent.click(screen.getByText('Download Chart').closest('.modal-overlay')!)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose when modal content is clicked', () => {
    const onClose = vi.fn()
    render(<DownloadModal {...defaultProps} onClose={onClose} />)

    fireEvent.click(screen.getByText('Download Chart'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('shows progress when generating', () => {
    render(<DownloadModal {...defaultProps} isGenerating={true} progress={50} />)

    expect(screen.getByText('Generating GIF...')).toBeInTheDocument()
    expect(screen.queryByText('Animated GIF')).not.toBeInTheDocument()
  })

  it('displays correct progress width', () => {
    const { container } = render(
      <DownloadModal {...defaultProps} isGenerating={true} progress={75} />
    )

    const progressFill = container.querySelector('.progress-fill')
    expect(progressFill).toHaveStyle({ width: '75%' })
  })
})
