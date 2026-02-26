import { NavLink } from 'react-router'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <span className="nav-icon">🏠</span>
        <span>ホーム</span>
      </NavLink>
      <NavLink to="/browse" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">📖</span>
        <span>かんじ</span>
      </NavLink>
      <NavLink to="/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">⭐</span>
        <span>クイズ</span>
      </NavLink>
    </nav>
  )
}
