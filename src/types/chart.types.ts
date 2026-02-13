export interface Term {
  label: string
  value: number
  color: string
}

export type ChartType = 'bars' | 'circles' | 'rectangles' | 'donut'
export type ValueType = 'value' | 'percent'

export interface ChartStyle {
  font: string
  fontSize: string
  backgroundColor: string
}

export interface Chart {
  title: string
  type: ChartType
  terms: Term[]
  style: ChartStyle
  valueType: ValueType
}

export interface SavedChart extends Chart {
  id: string
  thumbnail: string
  savedAt: string
}

export interface ChartTypeInfo {
  type: ChartType
  name: string
  icon: string
}
