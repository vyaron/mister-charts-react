import type { Chart, ChartTypeInfo, Term } from '../types/chart.types'
import { getNextChartColor } from './util.service'

const gChartTypes: ChartTypeInfo[] = [
  { type: 'circles', name: 'Circles', icon: 'circle-dot' },
  { type: 'donut', name: 'Donut', icon: 'circle-dashed' },
  { type: 'rectangles', name: 'Rectangles', icon: 'rectangle-horizontal' },
  { type: 'bars', name: 'Bars', icon: 'chart-column' },
]

export function getChartTypes(): ChartTypeInfo[] {
  return gChartTypes
}

export function createTerm(idx: number): Term {
  return {
    label: '',
    value: 1,
    color: getNextChartColor(idx),
  }
}

export function getDefaultChart(): Chart {
  return {
    type: 'circles',
    title: 'Elections Results',
    style: {
      font: 'Arial',
      fontSize: '45px',
      backgroundColor: 'transparent',
    },
    valueType: 'value',
    terms: [createTerm(0), createTerm(1)],
  }
}

// Rendering functions
export function renderChart(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  progress: number = 1
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Fill white background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  renderChartTitle(ctx, chart)

  switch (chart.type) {
    case 'bars':
      renderBarsChart(ctx, chart, progress)
      break
    case 'circles':
      renderCirclesChart(ctx, chart, progress)
      break
    case 'rectangles':
      renderRectanglesChart(ctx, chart, progress)
      break
    case 'donut':
      renderDonutChart(ctx, chart, progress)
      break
  }

  renderChartLegend(ctx, chart, progress)
}

function renderChartTitle(ctx: CanvasRenderingContext2D, chart: Chart): void {
  ctx.fillStyle = '#333'
  ctx.font = `bold 24px ${chart.style.font}`
  ctx.textAlign = 'left'
  ctx.fillText(chart.title, 30, 40)
}

function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = []
  for (let i = 0; i < text.length; i += maxChars) {
    lines.push(text.slice(i, i + maxChars))
  }
  return lines
}

function renderChartLegend(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  progress: number = 1
): void {
  const sidePadding = 40
  const chartWidth = ctx.canvas.width - sidePadding * 2
  const legendY = ctx.canvas.height - 80
  const total = chart.terms.reduce((sum, term) => sum + Number(term.value), 0)

  // Legend starts at 70% progress, slower fade in
  const legendProgress = Math.max(0, (progress - 0.7) / 0.3)
  ctx.globalAlpha = legendProgress

  // Calculate legend positions based on chart type
  const legendPositions = chart.terms.map((term, idx) => {
    if (chart.type === 'circles') {
      const spacing = chartWidth / (chart.terms.length + 1)
      return sidePadding + (idx + 1) * spacing
    } else if (chart.type === 'rectangles') {
      let x = sidePadding
      for (let i = 0; i < idx; i++) {
        x += (chart.terms[i].value / total) * chartWidth
      }
      return x + ((term.value / total) * chartWidth) / 2
    } else {
      const spacing = chartWidth / chart.terms.length
      return sidePadding + idx * spacing + spacing / 2
    }
  })

  chart.terms.forEach((term, idx) => {
    const centerX = legendPositions[idx]
    const label = term.label || `Term ${idx + 1}`
    const percent = total ? Math.round((term.value / total) * 100) : 0

    // Draw color circle
    ctx.fillStyle = term.color
    ctx.beginPath()
    ctx.arc(centerX, legendY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Draw percentage (if percent mode)
    ctx.fillStyle = '#333'
    ctx.font = `bold 16px ${chart.style.font}`
    ctx.textAlign = 'center'
    if (chart.valueType === 'percent') {
      ctx.fillText(`${percent}%`, centerX, legendY + 28)
    } else {
      ctx.fillText(String(term.value), centerX, legendY + 28)
    }

    // Draw label (wrapped)
    ctx.font = `14px ${chart.style.font}`
    const lines = wrapText(label, 10)
    lines.forEach((line, lineIdx) => {
      ctx.fillText(line, centerX, legendY + 48 + lineIdx * 16)
    })
  })

  ctx.globalAlpha = 1
}

function drawRoundedBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  if (height <= 0 || width <= 0) return
  radius = Math.max(0, Math.min(radius, height / 2, width / 2))
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.arcTo(x + width, y, x + width, y + radius, radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
  ctx.lineTo(x + radius, y + height)
  ctx.arcTo(x, y + height, x, y + height - radius, radius)
  ctx.lineTo(x, y + radius)
  ctx.arcTo(x, y, x + radius, y, radius)
  ctx.closePath()
  ctx.fill()
}

function getStaggeredProgress(
  progress: number,
  idx: number,
  count: number,
  staggerAmount: number = 0.3
): number {
  if (count <= 1) return progress
  const delay = (idx / (count - 1)) * staggerAmount
  return Math.max(0, Math.min(1, (progress - delay) / (1 - staggerAmount)))
}

function renderBarsChart(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  progress: number = 1
): void {
  const topPadding = 70
  const bottomPadding = 120
  const sidePadding = 40
  const chartHeight = ctx.canvas.height - topPadding - bottomPadding
  const chartWidth = ctx.canvas.width - sidePadding * 2

  const maxValue = Math.max(...chart.terms.map((term) => term.value))
  const columnWidth = chartWidth / chart.terms.length
  const barWidth = Math.min(columnWidth * 0.3, 20)
  const radius = barWidth / 2

  chart.terms.forEach((term, idx) => {
    const barX = sidePadding + idx * columnWidth + (columnWidth - barWidth) / 2

    // Draw gray background track
    ctx.fillStyle = '#e5e5e5'
    drawRoundedBar(ctx, barX, topPadding, barWidth, chartHeight, radius)

    // Draw colored bar with staggered progress
    const itemProgress = getStaggeredProgress(progress, idx, chart.terms.length)
    const barHeight = (term.value / maxValue) * chartHeight * itemProgress
    ctx.fillStyle = term.color
    drawRoundedBar(
      ctx,
      barX,
      topPadding + chartHeight - barHeight,
      barWidth,
      barHeight,
      radius
    )
  })
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function renderCirclesChart(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  progress: number = 1
): void {
  const topPadding = 70
  const bottomPadding = 120
  const sidePadding = 40
  const chartHeight = ctx.canvas.height - topPadding - bottomPadding
  const chartWidth = ctx.canvas.width - sidePadding * 2

  const maxValue = Math.max(...chart.terms.map((term) => term.value))
  const maxRadius = Math.min(chartHeight / 2, chartWidth / (chart.terms.length + 1))
  const minRadius = maxRadius * 0.3

  const centerY = topPadding + chartHeight / 2
  const spacing = chartWidth / (chart.terms.length + 1)

  // Sort terms by value to draw larger circles first
  const sortedTerms = chart.terms
    .map((term, idx) => ({ ...term, originalIdx: idx }))
    .sort((a, b) => b.value - a.value)

  sortedTerms.forEach((term) => {
    const fullRadius = minRadius + (term.value / maxValue) * (maxRadius - minRadius)
    const itemProgress = getStaggeredProgress(
      progress,
      term.originalIdx,
      chart.terms.length
    )
    const radius = Math.max(0, fullRadius * itemProgress)
    if (radius <= 0) return
    const centerX = sidePadding + (term.originalIdx + 1) * spacing

    ctx.fillStyle = hexToRgba(term.color, 0.7)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fill()
  })
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  radius = Math.min(radius, width / 2, height / 2)
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.arcTo(x + width, y, x + width, y + radius, radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
  ctx.lineTo(x + radius, y + height)
  ctx.arcTo(x, y + height, x, y + height - radius, radius)
  ctx.lineTo(x, y + radius)
  ctx.arcTo(x, y, x + radius, y, radius)
}

function drawRoundedRectRight(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  radius = Math.min(radius, width, height / 2)
  ctx.moveTo(x, y)
  ctx.lineTo(x + width - radius, y)
  ctx.arcTo(x + width, y, x + width, y + radius, radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
  ctx.lineTo(x, y + height)
  ctx.lineTo(x, y)
}

function renderRectanglesChart(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  progress: number = 1
): void {
  const topPadding = 70
  const bottomPadding = 120
  const sidePadding = 40
  const chartHeight = ctx.canvas.height - topPadding - bottomPadding
  const chartWidth = ctx.canvas.width - sidePadding * 2

  const total = chart.terms.reduce((sum, term) => sum + Number(term.value), 0)
  if (total === 0) return

  const barHeight = Math.min(chartHeight * 0.6, 200)
  const barY = topPadding + (chartHeight - barHeight) / 2
  const radius = 16

  const phase1End = 0.4
  const fillProgress = Math.min(progress / phase1End, 1)
  const overlayProgress = Math.max(0, (progress - phase1End) / (1 - phase1End))

  // Draw first rectangle filling the entire bar with animation
  if (chart.terms.length > 0) {
    const fillWidth = chartWidth * fillProgress
    if (fillWidth > 0) {
      ctx.fillStyle = chart.terms[0].color
      ctx.beginPath()
      drawRoundedRect(ctx, sidePadding, barY, fillWidth, barHeight, radius)
      ctx.fill()
    }
  }

  // Then draw subsequent rectangles on top
  if (overlayProgress > 0 && chart.terms.length > 1) {
    let currentX = sidePadding + (chart.terms[0].value / total) * chartWidth

    for (let idx = 1; idx < chart.terms.length; idx++) {
      const term = chart.terms[idx]
      const fullWidth = (term.value / total) * chartWidth
      const itemProgress = getStaggeredProgress(
        overlayProgress,
        idx - 1,
        chart.terms.length - 1,
        0.8
      )
      const width = fullWidth * itemProgress

      if (width > 0) {
        ctx.fillStyle = term.color
        ctx.beginPath()

        const isLast = idx === chart.terms.length - 1

        if (isLast) {
          drawRoundedRectRight(ctx, currentX, barY, width, barHeight, radius)
        } else {
          ctx.rect(currentX, barY, width, barHeight)
        }
        ctx.fill()
      }

      currentX += fullWidth
    }
  }
}

function renderDonutChart(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  progress: number = 1
): void {
  const topPadding = 70
  const bottomPadding = 120
  const sidePadding = 40
  const chartHeight = ctx.canvas.height - topPadding - bottomPadding
  const chartWidth = ctx.canvas.width - sidePadding * 2

  const total = chart.terms.reduce((sum, term) => sum + Number(term.value), 0)
  if (total === 0) return

  const centerX = sidePadding + chartWidth / 2
  const centerY = topPadding + chartHeight / 2
  const outerRadius = Math.min(chartHeight, chartWidth) / 2 - 10
  const lineWidth = outerRadius * 0.35
  const radius = outerRadius - lineWidth / 2

  const startAngle = -Math.PI / 2

  const phase1End = 0.4
  const fillProgress = Math.min(progress / phase1End, 1)
  const overlayProgress = Math.max(0, (progress - phase1End) / (1 - phase1End))

  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'

  // Phase 1: Draw first color filling the entire donut
  if (chart.terms.length > 0) {
    const endAngle = startAngle + 2 * Math.PI * fillProgress
    ctx.strokeStyle = chart.terms[0].color
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.stroke()
  }

  // Phase 2: Draw subsequent segments on top
  if (overlayProgress > 0 && chart.terms.length > 1) {
    let currentAngle = startAngle + (chart.terms[0].value / total) * 2 * Math.PI

    for (let idx = 1; idx < chart.terms.length; idx++) {
      const term = chart.terms[idx]
      const segmentAngle = (term.value / total) * 2 * Math.PI
      const itemProgress = getStaggeredProgress(
        overlayProgress,
        idx - 1,
        chart.terms.length - 1,
        0.8
      )
      const currentSegmentAngle = segmentAngle * itemProgress

      if (currentSegmentAngle > 0) {
        ctx.strokeStyle = term.color
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + currentSegmentAngle)
        ctx.stroke()
      }

      currentAngle += segmentAngle
    }
  }
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}
