import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { HomePage } from './HomePage'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('HomePage', () => {
  it('renders the main heading', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('Create Beautiful Animated Charts')).toBeInTheDocument()
  })

  it('renders the description', () => {
    renderWithRouter(<HomePage />)
    expect(
      screen.getByText(/Turn your data into eye-catching animated GIFs/i)
    ).toBeInTheDocument()
  })

  it('renders Create Chart button', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('Create Chart')).toBeInTheDocument()
  })

  it('renders all feature cards', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('Multiple Chart Types')).toBeInTheDocument()
    expect(screen.getByText('Smooth Animations')).toBeInTheDocument()
    expect(screen.getByText('Export as GIF')).toBeInTheDocument()
  })

  it('navigates to editor when CTA is clicked', () => {
    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    renderWithRouter(<HomePage />)

    fireEvent.click(screen.getByText('Create Chart'))
    expect(mockNavigate).toHaveBeenCalledWith('/editor')
  })
})
