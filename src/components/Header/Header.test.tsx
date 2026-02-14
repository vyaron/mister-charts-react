import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from './Header'

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Header', () => {
  it('renders the title', () => {
    renderWithRouter(<Header />)
    expect(screen.getByText('Mister Charts')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithRouter(<Header />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Editor')).toBeInTheDocument()
    expect(screen.getByText('Gallery')).toBeInTheDocument()
  })

  it('has correct link destinations', () => {
    renderWithRouter(<Header />)
    
    const homeLink = screen.getByText('Home')
    const editorLink = screen.getByText('Editor')
    const galleryLink = screen.getByText('Gallery')

    expect(homeLink.closest('a')).toHaveAttribute('href', '/')
    expect(editorLink.closest('a')).toHaveAttribute('href', '/editor')
    expect(galleryLink.closest('a')).toHaveAttribute('href', '/gallery')
  })
})
