import { Heart, PlayCircle } from 'lucide-react'
import type { Exercise } from '../types'
import type { UIStrings } from '../i18n'

interface Props {
  ex: Exercise
  fav: boolean
  onOpen: () => void
  onToggleFav: () => void
  t: UIStrings
}

export default function ExerciseCard({ ex, fav, onOpen, onToggleFav, t }: Props) {
  return (
    <div className="card" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen()}>
      <div className="card-thumb">
        <img src={ex.image} alt={ex.name} loading="lazy" />
        <span className="play-badge">
          <PlayCircle size={18} />
        </span>
        <button
          className={`fav-btn ${fav ? 'on' : ''}`}
          title={fav ? t.unfavorite : t.favorite}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFav()
          }}
        >
          <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="card-body">
        <div className="card-name">{ex.name}</div>
        <div className="card-meta">
          <span>{ex.category}</span>
          <span>{ex.equipment}</span>
          <span>{ex.target}</span>
        </div>
      </div>
    </div>
  )
}
