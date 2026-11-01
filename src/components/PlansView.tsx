import { useMemo, useState } from 'react'
import { Trash2, Copy, Plus, Wand2 } from 'lucide-react'
import type { Exercise, Plan } from '../types'
import type { UIStrings } from '../i18n'

interface Props {
  t: UIStrings
  plans: Plan[]
  byId: Map<string, Exercise>
  pool: Exercise[]
  onCreatePlan: (name: string, ids: string[]) => void
  onRemoveFromPlan: (planId: string, exId: string) => void
  onDeletePlan: (planId: string) => void
  onOpen: (id: string) => void
  showToast: (msg: string) => void
}

export default function PlansView(props: Props) {
  const { t, plans, byId, pool, onCreatePlan, onRemoveFromPlan, onDeletePlan, onOpen, showToast } = props
  const [newName, setNewName] = useState('')
  const [genTarget, setGenTarget] = useState('')
  const [genCount, setGenCount] = useState(5)
  const [expanded, setExpanded] = useState<string | null>(null)

  const targets = useMemo(() => [...new Set(pool.map((e) => e.target))].sort(), [pool])

  const copyPlan = async (plan: Plan) => {
    const list = plan.exerciseIds.map((id) => byId.get(id)?.name ?? id).join('\n')
    try {
      await navigator.clipboard.writeText(`${plan.name}\n${list}`)
      showToast(t.copied)
    } catch {
      /* clipboard unavailable */
    }
  }

  const generate = () => {
    const target = genTarget || undefined
    const pool2 = pool.filter((e) => (target ? e.target === target : true))
    const ids = [...pool2]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(genCount, pool2.length))
      .map((e) => e.id)
    onCreatePlan(`Auto · ${target || 'mix'} · ${ids.length}`, ids)
    showToast(t.planAdded)
  }

  return (
    <div className="view-panel">
      <h2>{t.planTitle}</h2>

      <div className="plan-builder">
        <div className="gen-row">
          <input
            placeholder={t.planNamePlaceholder}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            className="btn btn-primary"
            disabled={!newName.trim()}
            onClick={() => {
              onCreatePlan(newName.trim(), [])
              setNewName('')
            }}
          >
            <Plus size={15} /> {t.createPlan}
          </button>
        </div>
        <div className="gen-row">
          <select value={genTarget} onChange={(e) => setGenTarget(e.target.value)}>
            <option value="">{t.any}</option>
            {targets.map((tg) => (
              <option key={tg} value={tg}>
                {tg}
              </option>
            ))}
          </select>
          <select value={genCount} onChange={(e) => setGenCount(Number(e.target.value))}>
            {[3, 4, 5, 6, 8].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button className="btn" onClick={generate}>
            <Wand2 size={15} /> {t.genPlan}
          </button>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="empty">{t.emptyPlans}</div>
      ) : (
        <div className="plan-list">
          {plans.map((p) => {
            const exs = p.exerciseIds.map((id) => byId.get(id)).filter((e): e is Exercise => Boolean(e))
            const isOpen = expanded === p.id
            return (
              <div key={p.id} className="plan-item">
                <div className="plan-head" onClick={() => setExpanded(isOpen ? null : p.id)}>
                  <div>
                    <strong>{p.name}</strong>
                    <span>
                      {exs.length} {t.count}
                    </span>
                  </div>
                  <div className="plan-actions">
                    <button
                      title={t.sharePlan}
                      onClick={(e) => {
                        e.stopPropagation()
                        copyPlan(p)
                      }}
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      title={t.deletePlan}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeletePlan(p.id)
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="plan-detail">
                    {exs.length === 0 ? (
                      <p className="empty">{t.emptyPlans}</p>
                    ) : (
                      exs.map((ex) => (
                        <div key={ex.id} className="plan-ex">
                          <img src={ex.image} alt={ex.name} onClick={() => onOpen(ex.id)} />
                          <div onClick={() => onOpen(ex.id)}>
                            <strong>{ex.name}</strong>
                            <span>
                              {ex.category} · {ex.equipment}
                            </span>
                          </div>
                          <button
                            title={t.remove}
                            onClick={() => onRemoveFromPlan(p.id, ex.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
