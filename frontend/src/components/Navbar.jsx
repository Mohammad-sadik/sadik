import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const Navbar = ({ menuOpen, setMenuOpen, activeSection, onNavLinkClick }) => {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const isLearning = location.pathname === '/learning'
  
  const handleLogoClick = (e) => {
    let clicks = JSON.parse(sessionStorage.getItem('adminClicks') || '[]')
    const now = Date.now()
    clicks.push(now)
    if (clicks.length > 3) clicks.shift()
    sessionStorage.setItem('adminClicks', JSON.stringify(clicks))
    if (clicks.length === 3 && (clicks[2] - clicks[0] <= 10000)) {
      e.preventDefault()
      navigate('/dashboard')
      navigate('/login')
      sessionStorage.removeItem('adminClicks')
    }
  }

  return (
    <header className="l-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="nav bd-grid" aria-label="Main navigation">
        <div>
          <Link to="/" className="nav__logo" onClick={handleLogoClick}>Sadik Mohammad</Link>
        </div>

        <div className={`nav__menu ${menuOpen ? 'show' : ''}`} id="nav-menu">
          <ul className="nav__list">
            {isHome && (
              <>
                <li className="nav__item"><a href="#home" className={`nav__link ${activeSection === 'home' ? 'active-link' : ''}`} onClick={onNavLinkClick}>Home</a></li>
                <li className="nav__item"><a href="#about" className={`nav__link ${activeSection === 'about' ? 'active-link' : ''}`} onClick={onNavLinkClick}>About</a></li>
                <li className="nav__item"><a href="#skills" className={`nav__link ${activeSection === 'skills' ? 'active-link' : ''}`} onClick={onNavLinkClick}>Skills</a></li>
                <li className="nav__item"><a href="#work" className={`nav__link ${activeSection === 'work' ? 'active-link' : ''}`} onClick={onNavLinkClick}>Work</a></li>
                <li className="nav__item"><a href="#contact" className={`nav__link ${activeSection === 'contact' ? 'active-link' : ''}`} onClick={onNavLinkClick}>Contact</a></li>
              </>
            )}
            <li className="nav__item">
              <Link to="/learning" className={`nav__link ${isLearning ? 'active-link' : ''}`} onClick={onNavLinkClick}>
                Knowledge Hub
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav__controls">
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'bright' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'bright' : 'dark'} mode`}>
            <i className={theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon'}></i>
          </button>
          <button type="button" className="nav__toggle" id="nav-toggle" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="nav-menu" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`bx ${menuOpen ? 'bx-x' : 'bx-menu'}`} aria-hidden="true"></i>
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar

