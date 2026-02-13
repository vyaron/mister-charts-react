import { forwardRef } from 'react'

export const ChartCanvas = forwardRef<HTMLCanvasElement>((_, ref) => {
  return (
    <div className="canvas-wrapper">
      <canvas ref={ref} width={600} height={500} />
    </div>
  )
})

ChartCanvas.displayName = 'ChartCanvas'
