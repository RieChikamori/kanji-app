import { useState } from 'react'
import { Link } from 'react-router'
import { grade3Kanji } from '../../data/grade3'
import { useProgressStore } from '../../stores/progressStore'

function getMasteryColor(level) {
  if (level === 0) return 'var(--color-mastery-0)'
  if (level < 20) return 'var(--color-mastery-1)'
  if (level < 40) return 'var(--color-mastery-2)'
  if (level < 60) return 'var(--color-mastery-3)'
  if (level < 80) return 'var(--color-mastery-4)'
  return 'var(--color-mastery-5)'
}

export default function KanjiGrid() {
  const [search, setSearch] = useState('')
  const { getMastery } = useProgressStore()

  const filtered = search
    ? grade3Kanji.filter(
        (k) =>
          k.character.includes(search) ||
          k.onYomi.some((r) => r.includes(search)) ||
          k.kunYomi.some((r) => r.includes(search)) ||
          k.meanings.some((m) => m.includes(search))
      )
    : grade3Kanji

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
        かんじ一らん ({grade3Kanji.length}字)
      </h2>
      <input
        className="search-bar"
        type="text"
        placeholder="かんじ・読み・いみで さがす..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="kanji-grid">
        {filtered.map((k) => {
          const mastery = getMastery(k.character)
          return (
            <Link key={k.character} to={`/kanji/${k.character}`} className="kanji-card">
              <span
                className="mastery-dot"
                style={{ background: getMasteryColor(mastery) }}
              />
              {k.character}
            </Link>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: 32 }}>
          みつかりませんでした
        </p>
      )}
    </div>
  )
}
