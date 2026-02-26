import { Link } from 'react-router'

export default function QuizSelect() {
  return (
    <div className="quiz-type-select fade-in">
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>クイズをえらぼう</h2>
      <Link to="/quiz/reading" className="quiz-type-btn">
        <span className="icon">🎯</span>
        よみかたクイズ
      </Link>
      <Link to="/quiz/meaning" className="quiz-type-btn">
        <span className="icon">💡</span>
        いみクイズ
      </Link>
    </div>
  )
}
