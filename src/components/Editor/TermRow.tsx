import { useState } from 'react'
import type { Term } from '../../types/chart.types'
import { ColorPicker } from './ColorPicker'
import { PaintBucket, X } from 'lucide-react'

interface Props {
  term: Term
  idx: number
  onUpdate: (key: keyof Term, value: string | number) => void
  onRemove: () => void
  canRemove: boolean
}

export function TermRow({ term, onUpdate, onRemove, canRemove }: Props) {
  const [showColorPicker, setShowColorPicker] = useState(false)

  return (
    <div className="term-row">
      <div className="color-picker-wrapper">
        <button
          className="color-indicator"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <PaintBucket style={{ color: term.color }} />
        </button>
        {showColorPicker && (
          <ColorPicker
            currentColor={term.color}
            onSelect={(color) => {
              onUpdate('color', color)
              setShowColorPicker(false)
            }}
            onChange={(color) => onUpdate('color', color)}
          />
        )}
      </div>

      <div className="field field-name">
        <label>Variable name</label>
        <input
          type="text"
          value={term.label}
          maxLength={20}
          onChange={(e) => onUpdate('label', e.target.value)}
        />
      </div>

      <div className="field field-value">
        <label>Value</label>
        <input
          type="number"
          value={term.value}
          onChange={(e) => onUpdate('value', Number(e.target.value))}
        />
      </div>

      {canRemove && (
        <button className="btn-remove-term" onClick={onRemove}>
          <X size={16} />
        </button>
      )}
    </div>
  )
}
