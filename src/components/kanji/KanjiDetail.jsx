import { useParams, Link, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { grade3Kanji } from '../../data/grade3'
import { useProgressStore } from '../../stores/progressStore'
import StrokeOrderViewer from './StrokeOrderViewer'

export default function KanjiDetail() {
  const { char } = useParams()
  const navigate = useNavigate()
  const { getMastery } = useProgressStore()
  const kanji = grade3Kanji.find((k) => k.character === char)

  if (!kanji) {
    return <div style={{ textAlign: 'center', paddingTop: 40 }}>かんじがみつかりません</div>
  }

  const mastery = getMastery(kanji.character)

  return (
    <div className="kanji-detail fade-in">
      <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ alignSelf: 'flex-start', flex: 'none', padding: '8px 16px' }}>
        ← もどる
      </button>

      <div className="kanji-display">{kanji.character}</div>

      <StrokeOrderViewer character={kanji.character} />

      <div style={{ fontSize: 14, color: 'var(--color-text-light)' }}>
        マスター度: {mastery}%
      </div>

      <div className="detail-section">
        <h3>よみかた</h3>
        <div className="readings">
          {kanji.onYomi.length > 0 && (
            <div className="reading-group">
              <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>音読み</div>
              {kanji.onYomi.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
          )}
          {kanji.kunYomi.length > 0 && (
            <div className="reading-group">
              <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>訓読み</div>
              {kanji.kunYomi.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="detail-section">
        <h3>いみ</h3>
        <p style={{ fontSize: 18 }}>{kanji.meanings.join('、')}</p>
      </div>

      <div className="detail-section">
        <h3>れいのことば</h3>
        {kanji.exampleWords.map((ex) => (
          <div key={ex.word} className="example-word">
            <div className="word">{ex.word}</div>
            <div className="reading">{ex.reading}</div>
            <div className="meaning">{ex.meaning}</div>
          </div>
        ))}
      </div>

      <div className="detail-actions">
        <Link to={`/practice/${kanji.character}`} className="btn btn-primary">
          ✏️ れんしゅう
        </Link>
        <Link to="/quiz/reading" className="btn btn-success">
          🎯 クイズ
        </Link>
      </div>
    </div>
  )
}
