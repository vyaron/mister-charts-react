import type { ChartType } from '../../types/chart.types'
import { getChartTypes } from '../../services/chart.service'

interface Props {
  currentType: ChartType
  onSelect: (type: ChartType) => void
}

export function ChartTypeSelector({ currentType, onSelect }: Props) {
  const chartTypes = getChartTypes()

  return (
    <section className="chart-types-container">
      {chartTypes.map((chart) => (
        <div
          key={chart.type}
          className={`chart-type ${currentType === chart.type ? 'active' : ''}`}
          onClick={() => onSelect(chart.type)}
        >
          <img src={`img/chart/${chart.type}.svg`} alt={`${chart.name} icon`} />
          <h5>{chart.name}</h5>
        </div>
      ))}
    </section>
  )
}
