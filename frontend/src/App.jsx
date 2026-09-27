import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Skills from './components/Skills'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Timeline from './components/Timeline'
import MyLearning from './components/MyLearning'
import Dashboard from './components/Dashboard'
import Login from './components/Login'

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      const scrollY = window.pageYOffset
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50
        const sectionId = current.getAttribute('id')
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} activeSection={activeSection} onNavLinkClick={() => setMenuOpen(false)} />
      <main className="l-main" id="main-content">
        <Home />
        <About />
        <Skills />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <RouteMeta />
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/learning" element={<MyLearning />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const pages = {
      '/': ['Sadik Mohammad | Associate Software Engineer', 'Portfolio of Sadik Mohammad, Associate Software Engineer building reliable full-stack applications with React, Python, FastAPI, and PostgreSQL.', 'index, follow'],
      '/learning': ['Knowledge Hub | Sadik Mohammad', 'Practical software engineering notes, technical guides, and learning resources by Sadik Mohammad.', 'index, follow'],
      '/timeline': ['Experience | Sadik Mohammad', 'Professional experience and software engineering journey of Sadik Mohammad.', 'index, follow'],
      '/login': ['Admin Login | Sadik Mohammad', 'Private administrator sign-in.', 'noindex, nofollow'],
      '/dashboard': ['Admin Dashboard | Sadik Mohammad', 'Private portfolio administration.', 'noindex, nofollow']
    }
    const [title, description, robots] = pages[pathname] || ['Sadik Mohammad | Associate Software Engineer', 'Portfolio of Sadik Mohammad, Associate Software Engineer.', 'index, follow']
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="robots"]')?.setAttribute('content', robots)
  }, [pathname])

  return null
}

export default App

