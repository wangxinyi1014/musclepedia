import { X, Heart, Plus, Check, Languages } from 'lucide-react'
import type { Exercise } from '../types'
import type { UIStrings } from '../i18n'

interface Props {
  t: UIStrings
  ex: Exercise
  lang: string
  setLang: (l: string) => void
  fav: boolean
  onToggleFav: () => void
  inPlan: boolean
  onAddToPlan: () => void
  onClose: () => void
  availableLangs: string[]
}

export default function ExerciseModal(props: Props) {
  const { t, ex, lang, setLang, fav, onToggleFav, inPlan, onAddToPlan, onClose, availableLangs } = props
  const steps = ex.instruction_steps?.[lang] ?? []
  const text = ex.instructions?.[lang]
  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="modal-gif">
          <img src={ex.gif_url} alt={ex.name} />
        </div>
        <div className="modal-body">
          <h2>{ex.name}</h2>
          <div className="meta-grid">
            <div>
              <span className="meta-label">{t.categoryField}</span>
              {ex.category}
            </div>
            <div>
              <span className="meta-label">{t.bodyPartField}</span>
              {ex.body_part}
            </div>
            <div>
              <span className="meta-label">{t.equipmentField}</span>
              {ex.equipment}
            </div>
            <div>
              <span className="meta-label">{t.target}</span>
              {ex.target}
            </div>
            <div>
              <span className="meta-label">{t.musGroup}</span>
              {ex.muscle_group}
            </div>
            <div>
              <span className="meta-label">{t.secMuscles}</span>
              {ex.secondary_muscles?.join(', ') || '—'}
            </div>
          </div>

          <div className="lang-row">
            <span className="meta-label">
              <Languages size={14} /> {t.lang}
            </span>
            <div className="lang-btns">
              {availableLangs.map((l) => (
                <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {steps.length > 0 ? (
            <div className="steps">
              <h3>{t.instructions}</h3>
              <ol>
                {steps.map((s, i) => (
                  <li key={i}>
                    <span className="step-no">
                      {t.step} {i + 1}
                      {t.stepSuffix}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            text && <p className="instr-text">{text}</p>
          )}

          <div className="modal-actions">
            <button className={`btn ${fav ? 'btn-on' : ''}`} onClick={onToggleFav}>
              <Heart size={15} fill={fav ? 'currentColor' : 'none'} /> {fav ? t.unfavorite : t.favorite}
            </button>
            <button className={`btn ${inPlan ? 'btn-on' : 'btn-primary'}`} onClick={onAddToPlan}>
              {inPlan ? <Check size={15} /> : <Plus size={15} />} {inPlan ? t.inPlan : t.addToPlan}
            </button>
          </div>
          <p className="attribution">{ex.attribution}</p>
        </div>
      </div>
    </div>
  )
}
