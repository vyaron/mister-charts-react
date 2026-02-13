import { useRef } from 'react'
import { getChartColors } from '../../services/util.service'

interface Props {
  currentColor: string
  onSelect: (color: string) => void
  onChange: (color: string) => void
}

export function ColorPicker({ currentColor, onSelect, onChange }: Props) {
  const colors = getChartColors()
  const colorInputRef = useRef<HTMLInputElement>(null)

  const handleOtherClick = () => {
    colorInputRef.current?.click()
  }

  return (
    <div className="color-picker-dropdown">
      <div className="color-swatches">
        {colors.map((color) => (
          <button
            key={color}
            className="color-swatch"
            style={{ background: color }}
            onClick={() => onSelect(color)}
          />
        ))}
      </div>
      <button className="color-other" onClick={handleOtherClick}>
        Other...
      </button>
      <input
        ref={colorInputRef}
        type="color"
        className="hidden-color-input"
        value={currentColor}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
      />
    </div>
  )
}
