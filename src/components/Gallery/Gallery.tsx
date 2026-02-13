import { useState, useEffect } from 'react'
import { getSavedCharts, deleteChart } from '../../services/gallery.service'
import type { SavedChart } from '../../types/chart.types'
import { GalleryCard } from './GalleryCard'
import { showUserMsg } from '../common/UserMsg'

export function Gallery() {
  const [charts, setCharts] = useState<SavedChart[]>([])

  useEffect(() => {
    setCharts(getSavedCharts())
  }, [])

  const handleDelete = (id: string) => {
    deleteChart(id)
    setCharts(getSavedCharts())
    showUserMsg('Chart deleted')
  }

  return (
    <section className="gallery-page">
      <h3>Gallery</h3>
      <section className="gallery">
        {charts.length === 0 ? (
          <div className="gallery-empty">
            <p>No saved charts yet.</p>
            <p>Create a chart and save it to see it here!</p>
          </div>
        ) : (
          charts.map((chart) => (
            <GalleryCard
              key={chart.id}
              chart={chart}
              onDelete={() => handleDelete(chart.id)}
            />
          ))
        )}
      </section>
    </section>
  )
}
