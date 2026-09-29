import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Skills from './components/Skills'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'

const Timeline = lazy(() => import('./components/Timeline'))
const MyLearning = lazy(() => import('./components/MyLearning'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const Login = lazy(() => import('./components/Login'))

function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname !== '/') return undefined
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
  }, [pathname])

  return (
    <>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} activeSection={pathname === '/' ? activeSection : ''} onNavLinkClick={() => setMenuOpen(false)} />
      <Suspense fallback={<main id="main-content" className="page-loading" role="status">Loading page…</main>}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  )
}

function MainLayout() {
  return (
    <main className="l-main" id="main-content">
      <Home />
      <About />
      <Skills />
      <Work />
      <Contact />
    </main>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <RouteMeta />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<MainLayout />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/learning" element={<MyLearning />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
          </Route>
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

