import { useNavigate } from 'react-router-dom'
import type { SavedChart } from '../../types/chart.types'
import { Pencil, Trash2 } from 'lucide-react'

interface Props {
  chart: SavedChart
  onDelete: () => void
}

export function GalleryCard({ chart, onDelete }: Props) {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="gallery-card">
      <div className="gallery-card-thumbnail">
        <img src={chart.thumbnail} alt={chart.title} />
      </div>
      <div className="gallery-card-info">
        <h4 className="gallery-card-title">{chart.title || 'Untitled'}</h4>
        <span className="gallery-card-date">{formatDate(chart.savedAt)}</span>
      </div>
      <div className="gallery-card-actions">
        <button
          className="gallery-btn"
          onClick={() => navigate(`/editor/${chart.id}`)}
          title="Edit"
        >
          <Pencil />
        </button>
        <button
          className="gallery-btn gallery-btn-danger"
          onClick={onDelete}
          title="Delete"
        >
          <Trash2 />
        </button>
      </div>
    </div>
  )
}
