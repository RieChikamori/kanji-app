import { useParams, useNavigate } from 'react-router'
import { useRef, useState, useEffect, useCallback } from 'react'
import { grade3Kanji } from '../../data/grade3'
import { useProgressStore } from '../../stores/progressStore'
import { validateStroke } from '../../utils/strokeMatcher'

export default function WritingPractice() {
  const { char } = useParams()
  const navigate = useNavigate()
  const kanji = grade3Kanji.find((k) => k.character === char)
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)
  const currentPoints = useRef([])
  const { recordPractice } = useProgressStore()

  const [kanjiData, setKanjiData] = useState(null)
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0)
  const [completedStrokes, setCompletedStrokes] = useState([])
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { KanjiVG } = await import('kanjivg-js')
        const kvg = new KanjiVG()
        const results = await kvg.getKanji(char)
        if (!cancelled && results.length > 0) {
          setKanjiData(results[0])
        }
      } catch (e) {
        console.warn('KanjiVG load failed:', e)
      }
    }
    load()
    return () => { cancelled = true }
  }, [char])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  const drawStroke = useCallback((points, color = '#333') => {
    const canvas = canvasRef.current
    if (!canvas || points.length < 2) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 4 * dpr
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.moveTo(points[0].x * dpr, points[0].y * dpr)
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * dpr, points[i].y * dpr)
    }
    ctx.stroke()
  }, [])

  const redrawAll = useCallback(() => {
    clearCanvas()
    completedStrokes.forEach((s) => drawStroke(s, '#666'))
  }, [clearCanvas, drawStroke, completedStrokes])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const preventScribble = (e) => { e.preventDefault() }
    canvas.addEventListener('touchstart', preventScribble, { passive: false })
    canvas.addEventListener('touchmove', preventScribble, { passive: false })

    const getPos = (e) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const onDown = (e) => {
      if (isComplete) return
      isDrawing.current = true
      currentPoints.current = [getPos(e)]
    }

    const onMove = (e) => {
      if (!isDrawing.current) return
      const pt = getPos(e)
      currentPoints.current.push(pt)

      const ctx = canvas.getContext('2d')
      const prev = currentPoints.current[currentPoints.current.length - 2]
      ctx.beginPath()
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 4 * dpr
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(prev.x * dpr, prev.y * dpr)
      ctx.lineTo(pt.x * dpr, pt.y * dpr)
      ctx.stroke()
    }

    const onUp = () => {
      if (!isDrawing.current) return
      isDrawing.current = false
      const pts = [...currentPoints.current]
      currentPoints.current = []

      if (pts.length < 3 || !kanjiData) return

      const strokePath = kanjiData.strokes[currentStrokeIndex]?.path
      if (!strokePath) return

      const result = validateStroke(pts, strokePath, rect.width, rect.height)

      if (result.correct) {
        setCompletedStrokes((prev) => [...prev, pts])
        setFeedback(result.feedback)
        setFeedbackType('correct')
        const nextIdx = currentStrokeIndex + 1
        setCurrentStrokeIndex(nextIdx)

        if (nextIdx >= kanjiData.strokes.length) {
          setIsComplete(true)
          recordPractice(char, 'writing', true)
        }
      } else {
        setFeedback(result.feedback)
        setFeedbackType('incorrect')
        setTimeout(() => {
          redrawAll()
        }, 300)
      }

      setTimeout(() => setFeedback(''), 1500)
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('touchstart', preventScribble)
      canvas.removeEventListener('touchmove', preventScribble)
    }
  }, [kanjiData, currentStrokeIndex, isComplete, char, redrawAll, recordPractice])

  const reset = () => {
    setCurrentStrokeIndex(0)
    setCompletedStrokes([])
    setIsComplete(false)
    setFeedback('')
    clearCanvas()
  }

  if (!kanji) {
    return <div style={{ textAlign: 'center', paddingTop: 40 }}>かんじがみつかりません</div>
  }

  return (
    <div className="writing-practice fade-in">
      <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ alignSelf: 'flex-start', flex: 'none', padding: '8px 16px' }}>
        ← もどる
      </button>

      <h2 style={{ fontSize: 20 }}>「{kanji.character}」をかこう</h2>

      <div className="stroke-info">
        <div className="stroke-counter">
          {kanjiData
            ? `${currentStrokeIndex} / ${kanjiData.strokes.length} かく`
            : 'よみこみ中...'}
        </div>
      </div>

      <div className="canvas-area">
        {kanjiData && (
          <svg
            className="stroke-guide-overlay"
            viewBox="0 0 109 109"
            xmlns="http://www.w3.org/2000/svg"
          >
            {kanjiData.strokes.map((stroke, i) => {
              let color = '#F0F0F0'
              let width = 2
              if (i < currentStrokeIndex) {
                color = '#C8E6C9'
                width = 3
              } else if (i === currentStrokeIndex) {
                color = 'var(--color-primary-light)'
                width = 4
              }
              return (
                <path
                  key={i}
                  d={stroke.path}
                  fill="none"
                  stroke={color}
                  strokeWidth={width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            })}
          </svg>
        )}
        <canvas ref={canvasRef} className="writing-canvas" />
      </div>

      <div className={`feedback-text ${feedbackType}`}>
        {feedback && <span className="celebration">{feedback}</span>}
      </div>

      <div className="canvas-buttons">
        <button className="btn btn-outline" onClick={reset}>
          やりなおす
        </button>
        {isComplete && (
          <button className="btn btn-success" onClick={() => navigate(`/kanji/${char}`)}>
            つぎへ
          </button>
        )}
      </div>

      {isComplete && (
        <div className="complete-overlay" onClick={() => navigate(`/kanji/${char}`)}>
          <div className="complete-modal celebration" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 すごい！</h2>
            <p>「{kanji.character}」をかけたね！</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" onClick={reset} style={{ flex: 1 }}>
                もういちど
              </button>
              <button className="btn btn-primary" onClick={() => navigate(`/kanji/${char}`)} style={{ flex: 1 }}>
                もどる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
