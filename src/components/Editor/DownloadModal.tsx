import { Film, Image } from 'lucide-react'

interface Props {
  isGenerating: boolean
  progress: number
  onDownloadGIF: () => void
  onDownloadPNG: () => void
  onClose: () => void
}

export function DownloadModal({
  isGenerating,
  progress,
  onDownloadGIF,
  onDownloadPNG,
  onClose,
}: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Download Chart</h3>

        {!isGenerating ? (
          <div className="modal-options">
            <button className="modal-btn primary" onClick={onDownloadGIF}>
              <Film />
              <span>Animated GIF</span>
            </button>
            <button className="modal-btn" onClick={onDownloadPNG}>
              <Image />
              <span>Static PNG</span>
            </button>
            <button className="modal-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="modal-progress">
            <p>Generating GIF...</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
