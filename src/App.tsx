import { useEffect, useMemo, useState } from 'react'
import type { Exercise, Plan } from './types'
import { UI, LANG_LABELS, type UILang, type UIStrings } from './i18n'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import ExerciseCard from './components/ExerciseCard'
import ExerciseModal from './components/ExerciseModal'
import RandomView from './components/RandomView'
import PlansView from './components/PlansView'
import StatsView from './components/StatsView'

type View = 'browse' | 'random' | 'plans' | 'stats'

const LS = {
  fav: 'fitatlas.favorites',
  plans: 'fitatlas.plans',
  ui: 'fitatlas.uilang',
  lang: 'fitatlas.lang',
  theme: 'fitatlas.theme',
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [data, setData] = useState<Exercise[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [view, setView] = useState<View>('browse')
  const [q, setQ] = useState('')
  const [bodyParts, setBodyParts] = useState<string[]>([])
  const [equipments, setEquipments] = useState<string[]>([])
  const [targets, setTargets] = useState<string[]>([])
  const [lang, setLang] = useState<string>(() => loadJSON(LS.lang, 'zh'))
  const [ui, setUi] = useState<UILang>(() => loadJSON(LS.ui, 'zh'))
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadJSON(LS.theme, 'dark'))
  const [favorites, setFavorites] = useState<string[]>(() => loadJSON(LS.fav, [] as string[]))
  const [plans, setPlans] = useState<Plan[]>(() => loadJSON(LS.plans, [] as Plan[]))
  const [detailId, setDetailId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch('data/exercises.json')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((d: Exercise[]) => setData(d))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(LS.theme, JSON.stringify(theme))
  }, [theme])
  useEffect(() => localStorage.setItem(LS.ui, JSON.stringify(ui)), [ui])
  useEffect(() => localStorage.setItem(LS.lang, JSON.stringify(lang)), [lang])
  useEffect(() => localStorage.setItem(LS.fav, JSON.stringify(favorites)), [favorites])
  useEffect(() => localStorage.setItem(LS.plans, JSON.stringify(plans)), [plans])

  const t: UIStrings = UI[ui]

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 1600)
  }

  const toggleInList = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v]

  const filtered = useMemo(() => {
    if (!data) return []
    const ql = q.trim().toLowerCase()
    return data.filter((ex) => {
      if (bodyParts.length && !bodyParts.includes(ex.body_part)) return false
      if (equipments.length && !equipments.includes(ex.equipment)) return false
      if (targets.length && !targets.includes(ex.target)) return false
      if (ql) {
        const hay = [
          ex.name,
          ex.category,
          ex.body_part,
          ex.equipment,
          ex.target,
          ex.muscle_group,
          ...ex.secondary_muscles,
          ex.instructions.en?.slice(0, 300) ?? '',
          ex.instructions.zh?.slice(0, 300) ?? '',
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(ql)) return false
      }
      return true
    })
  }, [data, q, bodyParts, equipments, targets])

  const byId = useMemo(() => {
    const m = new Map<string, Exercise>()
    data?.forEach((e) => m.set(e.id, e))
    return m
  }, [data])

  const facets = useMemo(() => {
    const mk = (get: (e: Exercise) => string) => {
      const counts = new Map<string, number>()
      if (!data) return counts
      for (const e of data) {
        if (bodyParts.length && !bodyParts.includes(e.body_part)) continue
        if (equipments.length && !equipments.includes(e.equipment)) continue
        if (targets.length && !targets.includes(e.target)) continue
        if (q.trim()) {
          const hay = `${e.name} ${e.category} ${e.equipment} ${e.target} ${e.instructions.zh ?? ''}`.toLowerCase()
          if (!hay.includes(q.trim().toLowerCase())) continue
        }
        const k = get(e)
        counts.set(k, (counts.get(k) ?? 0) + 1)
      }
      return counts
    }
    return { bodyPart: mk((e) => e.body_part), equipment: mk((e) => e.equipment), target: mk((e) => e.target) }
  }, [data, q, bodyParts, equipments, targets])

  const optionLists = useMemo(() => {
    if (!data) return { bodyPart: [], equipment: [], target: [] }
    const uniq = (get: (e: Exercise) => string) => [...new Set(data.map(get))].sort()
    return { bodyPart: uniq((e) => e.body_part), equipment: uniq((e) => e.equipment), target: uniq((e) => e.target) }
  }, [data])

  const detail = detailId ? byId.get(detailId) : undefined

  const toggleFavorite = (id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  }

  const addToPlan = (id: string) => {
    if (plans.length === 0) {
      const p: Plan = { id: crypto.randomUUID(), name: '我的计划', exerciseIds: [id], createdAt: Date.now() }
      setPlans([p])
      showToast(t.planAdded)
      return
    }
    const first = plans[0]
    if (first.exerciseIds.includes(id)) {
      showToast(t.inPlan)
      return
    }
    setPlans((ps) => ps.map((p, i) => (i === 0 ? { ...p, exerciseIds: [...p.exerciseIds, id] } : p)))
    showToast(t.planAdded)
  }

  if (error) {
    return (
      <div className="center-screen">
        <p>{t.error}</p>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="center-screen">
        <p>{t.loading}</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        t={t}
        ui={ui}
        setUi={setUi}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        availableLangs={Object.keys(LANG_LABELS)}
      />

      <nav className="tabs">
        {(
          [
            ['browse', t.browse],
            ['random', t.random],
            ['plans', t.plans],
            ['stats', t.stats],
          ] as [View, string][]
        ).map(([v, label]) => (
          <button key={v} className={`tab ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>
            {label}
          </button>
        ))}
      </nav>

      {view === 'browse' && (
        <>
          <div className="search-row">
            <input
              className="search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
            />
            {(bodyParts.length > 0 || equipments.length > 0 || targets.length > 0) && (
              <button className="reset-btn" onClick={() => { setBodyParts([]); setEquipments([]); setTargets([]); setQ('') }}>
                {t.reset}
              </button>
            )}
          </div>
          <FilterBar
            t={t}
            optionLists={optionLists}
            facets={facets}
            bodyParts={bodyParts}
            equipments={equipments}
            targets={targets}
            onToggleBody={(v) => setBodyParts((s) => toggleInList(s, v))}
            onToggleEquip={(v) => setEquipments((s) => toggleInList(s, v))}
            onToggleTarget={(v) => setTargets((s) => toggleInList(s, v))}
          />
          <div className="result-line">
            <span>
              {filtered.length} {t.count}
            </span>
          </div>
          {filtered.length === 0 ? (
            <div className="empty">{t.noResult}</div>
          ) : (
            <div className="grid">
              {filtered.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  ex={ex}
                  fav={favorites.includes(ex.id)}
                  onOpen={() => setDetailId(ex.id)}
                  onToggleFav={() => toggleFavorite(ex.id)}
                  t={t}
                />
              ))}
            </div>
          )}
        </>
      )}

      {view === 'random' && <RandomView t={t} pool={filtered} onOpen={(id) => setDetailId(id)} />}

      {view === 'plans' && (
        <PlansView
          t={t}
          plans={plans}
          byId={byId}
          pool={filtered}
          onCreatePlan={(name, ids) => {
            const p: Plan = { id: crypto.randomUUID(), name, exerciseIds: ids, createdAt: Date.now() }
            setPlans((ps) => [...ps, p])
          }}
          onRemoveFromPlan={(planId, exId) =>
            setPlans((ps) =>
              ps.map((p) => (p.id === planId ? { ...p, exerciseIds: p.exerciseIds.filter((x) => x !== exId) } : p)),
            )
          }
          onDeletePlan={(planId) => setPlans((ps) => ps.filter((p) => p.id !== planId))}
          onOpen={(id) => setDetailId(id)}
          showToast={showToast}
        />
      )}

      {view === 'stats' && <StatsView t={t} data={data} />}

      {detail && (
        <ExerciseModal
          t={t}
          ex={detail}
          lang={lang}
          setLang={setLang}
          fav={favorites.includes(detail.id)}
          onToggleFav={() => toggleFavorite(detail.id)}
          inPlan={plans.some((p) => p.exerciseIds.includes(detail.id))}
          onAddToPlan={() => addToPlan(detail.id)}
          onClose={() => setDetailId(null)}
          availableLangs={Object.keys(LANG_LABELS)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
