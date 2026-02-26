import { useEffect, useState, useRef } from 'react'

export default function StrokeOrderViewer({ character }) {
  const [kanjiData, setKanjiData] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [visibleStrokes, setVisibleStrokes] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { KanjiVG } = await import('kanjivg-js')
        const kvg = new KanjiVG()
        const results = await kvg.getKanji(character)
        if (!cancelled && results.length > 0) {
          setKanjiData(results[0])
          setVisibleStrokes(results[0].strokes.length)
        }
      } catch (e) {
        console.warn('KanjiVG load failed:', e)
      }
    }
    load()
    return () => { cancelled = true }
  }, [character])

  const animate = () => {
    if (!kanjiData || animating) return
    setAnimating(true)
    setVisibleStrokes(0)

    let i = 0
    timerRef.current = setInterval(() => {
      i++
      setVisibleStrokes(i)
      if (i >= kanjiData.strokes.length) {
        clearInterval(timerRef.current)
        setAnimating(false)
      }
    }, 400)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!kanjiData) {
    return (
      <div className="stroke-viewer">
        <span style={{ color: 'var(--color-text-light)', fontSize: 14 }}>よみこみ中...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="stroke-viewer" onClick={animate} style={{ cursor: 'pointer' }}>
        <svg viewBox="0 0 109 109" xmlns="http://www.w3.org/2000/svg">
          {kanjiData.strokes.map((stroke, i) => (
            <path
              key={i}
              d={stroke.path}
              fill="none"
              stroke={i < visibleStrokes ? '#333' : '#eee'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'stroke 0.3s' }}
            />
          ))}
          {kanjiData.strokes.map((stroke, i) =>
            i < visibleStrokes && stroke.numberPosition ? (
              <text
                key={`n${i}`}
                x={stroke.numberPosition.x}
                y={stroke.numberPosition.y}
                fontSize="8"
                fill="var(--color-primary)"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {i + 1}
              </text>
            ) : null
          )}
        </svg>
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-light)', marginTop: 4 }}>
        タップで書きじゅんアニメーション ({kanjiData.strokeCount}かく)
      </p>
    </div>
  )
}
