import { Routes, Route } from 'react-router'
import './App.css'
import BottomNav from './components/layout/BottomNav'
import Dashboard from './components/progress/Dashboard'
import KanjiGrid from './components/kanji/KanjiGrid'
import KanjiDetail from './components/kanji/KanjiDetail'
import WritingPractice from './components/practice/WritingPractice'
import QuizSelect from './components/quiz/QuizSelect'
import QuizContainer from './components/quiz/QuizContainer'
import QuizResult from './components/quiz/QuizResult'

function App() {
  return (
    <div className="app-shell">
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/browse" element={<KanjiGrid />} />
          <Route path="/kanji/:char" element={<KanjiDetail />} />
          <Route path="/practice/:char" element={<WritingPractice />} />
          <Route path="/quiz" element={<QuizSelect />} />
          <Route path="/quiz/:type" element={<QuizContainer />} />
          <Route path="/quiz/:type/result" element={<QuizResult />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

export default App
