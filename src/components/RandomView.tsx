import { useMemo, useState } from 'react'
import { Shuffle } from 'lucide-react'
import type { Exercise } from '../types'
import type { UIStrings } from '../i18n'
import ExerciseCard from './ExerciseCard'

interface Props {
  t: UIStrings
  pool: Exercise[]
  onOpen: (id: string) => void
}

const COUNT_OPTIONS = [3, 4, 5, 6, 8]

export default function RandomView({ t, pool, onOpen }: Props) {
  const [count, setCount] = useState(5)
  const [picked, setPicked] = useState<string[]>([])

  const generate = () => {
    const ids = [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((e) => e.id)
    setPicked(ids)
  }

  const pickedExercises = useMemo(
    () => picked.map((id) => pool.find((e) => e.id === id)).filter((e): e is Exercise => Boolean(e)),
    [picked, pool],
  )

  const favDummy = false
  return (
    <div className="view-panel">
      <h2>{t.randomTitle}</h2>
      <p className="view-hint">{t.randomHint}</p>
      <div className="random-controls">
        <label>
          {t.randomCount}
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {COUNT_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary" onClick={generate}>
          <Shuffle size={15} /> {picked.length ? t.randomBtn : t.randomTitle}
        </button>
      </div>
      {pickedExercises.length > 0 && (
        <div className="grid">
          {pickedExercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              fav={favDummy}
              onOpen={() => onOpen(ex.id)}
              onToggleFav={() => {}}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  )
}
