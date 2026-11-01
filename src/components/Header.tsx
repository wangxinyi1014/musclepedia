import { Dumbbell, Moon, Sun, Languages } from 'lucide-react'
import type { UILang, UIStrings } from '../i18n'

interface Props {
  t: UIStrings
  ui: UILang
  setUi: (u: UILang) => void
  lang: string
  setLang: (l: string) => void
  theme: 'dark' | 'light'
  setTheme: (t: 'dark' | 'light') => void
  availableLangs: string[]
}

export default function Header({ t, ui, setUi, lang, setLang, theme, setTheme, availableLangs }: Props) {
  return (
    <header className="header">
      <div className="brand">
        <Dumbbell size={26} />
        <div>
          <h1>{t.appName}</h1>
          <p>{t.tagline}</p>
        </div>
      </div>
      <div className="controls">
        <div className="ui-lang-switch">
          <button className={ui === 'zh' ? 'active' : ''} onClick={() => setUi('zh')}>
            中
          </button>
          <button className={ui === 'en' ? 'active' : ''} onClick={() => setUi('en')}>
            EN
          </button>
        </div>
        <label className="lang-select">
          <Languages size={15} />
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            {availableLangs.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        <button
          className="icon-btn"
          title={theme === 'dark' ? t.themeLight : t.themeDark}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
