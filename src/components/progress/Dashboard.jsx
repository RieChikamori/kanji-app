import { Link } from 'react-router'
import { useProgressStore } from '../../stores/progressStore'
import { grade3Kanji } from '../../data/grade3'

export default function Dashboard() {
  const { getTotalMastery, getPracticedCount, kanjiProgress } = useProgressStore()
  const totalMastery = getTotalMastery()
  const practicedCount = getPracticedCount()

  const weakKanji = grade3Kanji
    .filter((k) => {
      const p = kanjiProgress[k.character]
      return !p || (p.writingScore + p.readingScore + p.meaningScore) < 9
    })
    .slice(0, 5)

  return (
    <div className="dashboard fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 4 }}>
        かんじれんしゅう
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-light)', fontSize: 14 }}>
        小学3年生 ・ {grade3Kanji.length}字
      </p>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-value">{totalMastery}%</div>
          <div className="stat-label">ぜんたい</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{practicedCount}</div>
          <div className="stat-label">れんしゅうずみ</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{grade3Kanji.length - practicedCount}</div>
          <div className="stat-label">のこり</div>
        </div>
      </div>

      <div>
        <h2 className="section-title">きょうのれんしゅう</h2>
        <div className="quick-actions">
          <Link to="/browse" className="action-card">
            <div className="action-icon">📖</div>
            <div className="action-text">
              <h4>かんじをみる</h4>
              <p>かんじの書きじゅんや読みをたしかめよう</p>
            </div>
          </Link>
          <Link to="/quiz/reading" className="action-card">
            <div className="action-icon">🎯</div>
            <div className="action-text">
              <h4>よみクイズ</h4>
              <p>かんじの読みかたをテストしよう</p>
            </div>
          </Link>
          <Link to="/quiz/meaning" className="action-card">
            <div className="action-icon">💡</div>
            <div className="action-text">
              <h4>いみクイズ</h4>
              <p>かんじの意味をテストしよう</p>
            </div>
          </Link>
        </div>
      </div>

      {weakKanji.length > 0 && (
        <div>
          <h2 className="section-title">おすすめのかんじ</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {weakKanji.map((k) => (
              <Link
                key={k.character}
                to={`/kanji/${k.character}`}
                className="kanji-card"
                style={{ width: 64, height: 64, fontSize: 32 }}
              >
                {k.character}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
