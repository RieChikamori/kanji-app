import { useParams, useNavigate } from 'react-router'
import { useState, useEffect, useMemo } from 'react'
import { grade3Kanji } from '../../data/grade3'
import { useProgressStore } from '../../stores/progressStore'

const QUIZ_LENGTH = 10

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestions(type) {
  const candidates = shuffle(grade3Kanji).slice(0, QUIZ_LENGTH)
  return candidates.map((kanji) => {
    let correctAnswer, allOptions

    if (type === 'reading') {
      const readings = [...kanji.onYomi, ...kanji.kunYomi.map((r) => r.replace(/\..+/, ''))]
      correctAnswer = readings[0] || kanji.onYomi[0] || '—'
      const others = shuffle(
        grade3Kanji
          .filter((k) => k.character !== kanji.character)
          .map((k) => {
            const r = [...k.onYomi, ...k.kunYomi.map((r) => r.replace(/\..+/, ''))]
            return r[0] || k.onYomi[0] || '—'
          })
          .filter((r) => r !== correctAnswer)
      ).slice(0, 3)
      allOptions = shuffle([correctAnswer, ...others])
    } else {
      correctAnswer = kanji.meanings[0]
      const others = shuffle(
        grade3Kanji
          .filter((k) => k.character !== kanji.character)
          .map((k) => k.meanings[0])
          .filter((m) => m !== correctAnswer)
      ).slice(0, 3)
      allOptions = shuffle([correctAnswer, ...others])
    }

    return {
      character: kanji.character,
      correctAnswer,
      options: allOptions,
    }
  })
}

export default function QuizContainer() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { recordPractice } = useProgressStore()

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    setQuestions(generateQuestions(type))
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setShowResult(false)
  }, [type])

  const question = questions[currentIndex]

  const handleSelect = (option) => {
    if (selected !== null) return
    setSelected(option)
    const correct = option === question.correctAnswer
    if (correct) setScore((s) => s + 1)
    recordPractice(question.character, type === 'reading' ? 'reading' : 'meaning', correct)

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        const finalScore = correct ? score + 1 : score
        navigate(`/quiz/${type}/result`, { state: { score: finalScore, total: questions.length } })
      } else {
        setCurrentIndex((i) => i + 1)
        setSelected(null)
      }
    }, 1000)
  }

  if (!question) {
    return <div style={{ textAlign: 'center', paddingTop: 40, fontSize: 18 }}>もんだいをつくっています...</div>
  }

  const questionText = type === 'reading' ? 'この漢字の読みは？' : 'この漢字のいみは？'

  return (
    <div className="quiz-container fade-in">
      <button
        className="btn btn-outline"
        onClick={() => navigate('/quiz')}
        style={{ alignSelf: 'flex-start', padding: '8px 16px' }}
      >
        ← やめる
      </button>

      <div className="quiz-progress">
        {currentIndex + 1} / {questions.length}
      </div>

      <div className="quiz-kanji">{question.character}</div>
      <div className="quiz-question">{questionText}</div>

      <div className="quiz-options">
        {question.options.map((option, i) => {
          let cls = 'quiz-option'
          if (selected !== null) {
            if (option === question.correctAnswer) cls += ' correct'
            else if (option === selected) cls += ' incorrect'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
