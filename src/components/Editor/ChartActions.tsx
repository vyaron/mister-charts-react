import { Play, Save, Download } from 'lucide-react'

interface Props {
  onPreview: () => void
  onSave: () => void
  onDownload: () => void
}

export function ChartActions({ onPreview, onSave, onDownload }: Props) {
  return (
    <div className="chart-actions">
      <button className="action-btn" onClick={onPreview} title="Preview animation">
        <Play />
      </button>
      <button className="action-btn" onClick={onSave} title="Save to gallery">
        <Save />
      </button>
      <button className="action-btn" onClick={onDownload} title="Download">
        <Download />
      </button>
    </div>
  )
}
