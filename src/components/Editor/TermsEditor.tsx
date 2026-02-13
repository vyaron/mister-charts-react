import type { Term } from '../../types/chart.types'
import { TermRow } from './TermRow'

interface Props {
  terms: Term[]
  onUpdateTerm: (idx: number, key: keyof Term, value: string | number) => void
  onAddTerm: () => void
  onRemoveTerm: (idx: number) => void
}

export function TermsEditor({ terms, onUpdateTerm, onRemoveTerm }: Props) {
  return (
    <section className="terms-editor-container">
      {terms.map((term, idx) => (
        <TermRow
          key={idx}
          term={term}
          idx={idx}
          onUpdate={(key, value) => onUpdateTerm(idx, key, value)}
          onRemove={() => onRemoveTerm(idx)}
          canRemove={terms.length > 2}
        />
      ))}
    </section>
  )
}
