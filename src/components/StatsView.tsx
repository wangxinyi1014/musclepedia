import { useMemo } from 'react'
import type { Exercise } from '../types'
import type { UIStrings } from '../i18n'

interface Props {
  t: UIStrings
  data: Exercise[]
}

function Bar({ label, n, max }: { label: string; n: number; max: number }) {
  return (
    <div className="bar-row">
      <span className="bar-label">{label}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${max ? (n / max) * 100 : 0}%` }} />
      </div>
      <span className="bar-n">{n}</span>
    </div>
  )
}

function Section({ title, items }: { title: string; items: [string, number][] }) {
  if (items.length === 0) return null
  const max = items[0][1]
  return (
    <div className="stats-section">
      <h3>{title}</h3>
      {items.map(([label, n]) => (
        <Bar key={label} label={label} n={n} max={max} />
      ))}
    </div>
  )
}

export default function StatsView({ t, data }: Props) {
  const dist = useMemo(() => {
    const count = (get: (e: Exercise) => string) => {
      const m = new Map<string, number>()
      for (const e of data) m.set(get(e), (m.get(get(e)) ?? 0) + 1)
      return [...m.entries()].sort((a, b) => b[1] - a[1])
    }
    const targets = count((e) => e.target)
    return {
      category: count((e) => e.category),
      equipment: count((e) => e.equipment),
      bodyPart: count((e) => e.body_part),
      target: targets.slice(0, 10),
      languages: Object.keys(data[0]?.instructions ?? {}),
    }
  }, [data])

  return (
    <div className="view-panel">
      <h2>{t.statsTitle}</h2>
      <div className="stats-total">
        <div className="big-num">{data.length}</div>
        <div>{t.statsTotal}</div>
      </div>
      <div className="stats-grid">
        <Section title={t.statsBodyParts} items={dist.bodyPart} />
        <Section title={t.statsCategories} items={dist.category} />
        <Section title={t.statsTargets} items={dist.target} />
        <Section title={t.statsEquipment} items={dist.equipment} />
      </div>
      <p className="lang-note">
        {t.lang}: {dist.languages.map((l) => l.toUpperCase()).join(' · ')}
      </p>
      <p className="attribution">{t.dataAttribution}</p>
    </div>
  )
}
