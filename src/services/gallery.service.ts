import type { Chart, SavedChart } from '../types/chart.types'

const STORAGE_KEY = 'chartDB'

export function getSavedCharts(): SavedChart[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveChart(chartData: Chart, thumbnail: string): SavedChart {
  const charts = getSavedCharts()

  const newChart: SavedChart = {
    id: 'chart_' + Date.now(),
    title: chartData.title,
    type: chartData.type,
    style: { ...chartData.style },
    valueType: chartData.valueType,
    terms: chartData.terms.map((t) => ({ ...t })),
    thumbnail,
    savedAt: new Date().toISOString(),
  }

  charts.unshift(newChart)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(charts))

  return newChart
}

export function deleteChart(id: string): void {
  const charts = getSavedCharts()
  const filtered = charts.filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function getChartById(id: string): SavedChart | undefined {
  const charts = getSavedCharts()
  return charts.find((c) => c.id === id)
}
