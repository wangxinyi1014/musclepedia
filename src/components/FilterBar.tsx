import type { UIStrings } from '../i18n'

interface Props {
  t: UIStrings
  optionLists: { bodyPart: string[]; equipment: string[]; target: string[] }
  facets: { bodyPart: Map<string, number>; equipment: Map<string, number>; target: Map<string, number> }
  bodyParts: string[]
  equipments: string[]
  targets: string[]
  onToggleBody: (v: string) => void
  onToggleEquip: (v: string) => void
  onToggleTarget: (v: string) => void
}

function ChipGroup({
  title,
  options,
  selected,
  onToggle,
  counts,
}: {
  title: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
  counts: Map<string, number>
}) {
  if (options.length === 0) return null
  return (
    <div className="filter-group">
      <div className="filter-title">{title}</div>
      <div className="chips">
        {options.map((opt) => {
          const active = selected.includes(opt)
          const n = counts.get(opt) ?? 0
          return (
            <button key={opt} className={`chip ${active ? 'active' : ''}`} onClick={() => onToggle(opt)}>
              {opt}
              <span className="chip-count">{n}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function FilterBar(props: Props) {
  const { t, optionLists, facets, bodyParts, equipments, targets, onToggleBody, onToggleEquip, onToggleTarget } = props
  return (
    <div className="filter-bar">
      <ChipGroup title={t.bodyPart} options={optionLists.bodyPart} selected={bodyParts} onToggle={onToggleBody} counts={facets.bodyPart} />
      <ChipGroup title={t.equipment} options={optionLists.equipment} selected={equipments} onToggle={onToggleEquip} counts={facets.equipment} />
      <ChipGroup title={t.target} options={optionLists.target} selected={targets} onToggle={onToggleTarget} counts={facets.target} />
    </div>
  )
}
