import { useLocation, useNavigate, useParams } from 'react-router'

function getMessage(score, total) {
  const ratio = score / total
  if (ratio === 1) return 'パーフェクト！すごい！'
  if (ratio >= 0.8) return 'とてもよくできました！'
  if (ratio >= 0.6) return 'よくがんばったね！'
  if (ratio >= 0.4) return 'もうすこし がんばろう！'
  return 'つぎはもっとできるよ！'
}

export default function QuizResult() {
  const { type } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { score = 0, total = 10 } = location.state || {}

  return (
    <div className="quiz-result fade-in">
      <div className="celebration" style={{ fontSize: 64 }}>
        {score === total ? '🏆' : score >= total * 0.6 ? '🎉' : '💪'}
      </div>
      <div className="result-score">{score} / {total}</div>
      <div className="result-message">{getMessage(score, total)}</div>
      <div className="result-details">
        {type === 'reading' ? 'よみかたクイズ' : 'いみクイズ'}のけっか
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 20, width: '100%', maxWidth: 320 }}>
        <button className="btn btn-primary" onClick={() => navigate(`/quiz/${type}`, { replace: true })} style={{ flex: 1 }}>
          もういちど
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/')} style={{ flex: 1 }}>
          ホームへ
        </button>
      </div>
    </div>
  )
}
