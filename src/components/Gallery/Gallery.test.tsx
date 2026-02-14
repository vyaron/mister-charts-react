import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Gallery } from './Gallery'
import * as galleryService from '../../services/gallery.service'

vi.mock('../../services/gallery.service')

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Gallery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when no charts', () => {
    vi.mocked(galleryService.getSavedCharts).mockReturnValue([])

    renderWithRouter(<Gallery />)

    expect(screen.getByText('No saved charts yet.')).toBeInTheDocument()
    expect(
      screen.getByText('Create a chart and save it to see it here!')
    ).toBeInTheDocument()
  })

  it('renders gallery cards for saved charts', () => {
    vi.mocked(galleryService.getSavedCharts).mockReturnValue([
      {
        id: 'chart_1',
        title: 'Test Chart 1',
        type: 'bars',
        terms: [],
        style: { font: 'Arial', fontSize: '45px', backgroundColor: 'transparent' },
        valueType: 'value',
        thumbnail: 'data:image/png;base64,test',
        savedAt: '2026-02-13T12:00:00.000Z',
      },
      {
        id: 'chart_2',
        title: 'Test Chart 2',
        type: 'circles',
        terms: [],
        style: { font: 'Arial', fontSize: '45px', backgroundColor: 'transparent' },
        valueType: 'value',
        thumbnail: 'data:image/png;base64,test2',
        savedAt: '2026-02-13T13:00:00.000Z',
      },
    ])

    renderWithRouter(<Gallery />)

    expect(screen.getByText('Test Chart 1')).toBeInTheDocument()
    expect(screen.getByText('Test Chart 2')).toBeInTheDocument()
  })

  it('deletes chart when delete button is clicked', () => {
    vi.mocked(galleryService.getSavedCharts)
      .mockReturnValueOnce([
        {
          id: 'chart_1',
          title: 'Test Chart',
          type: 'bars',
          terms: [],
          style: { font: 'Arial', fontSize: '45px', backgroundColor: 'transparent' },
          valueType: 'value',
          thumbnail: 'data:image/png;base64,test',
          savedAt: '2026-02-13T12:00:00.000Z',
        },
      ])
      .mockReturnValueOnce([])

    renderWithRouter(<Gallery />)

    const deleteButton = screen.getByTitle('Delete')
    fireEvent.click(deleteButton)

    expect(galleryService.deleteChart).toHaveBeenCalledWith('chart_1')
  })
})
