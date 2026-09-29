import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false)
  const { pathname } = useLocation()
  const sectionHref = (section) => `${pathname === '/' ? '' : '/'}#${section}`

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const checkScrollTop = () => setShowScroll(window.pageYOffset > 400)
    window.addEventListener('scroll', checkScrollTop)
    return () => window.removeEventListener('scroll', checkScrollTop)
  }, [])

  return (
    <footer className="portfolio-footer">
      <div className="bd-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Column 1 */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#fff' }}>Sadik Mohammad</h3>
          <h4 style={{ fontSize: '1rem', color: '#7C3AED', marginBottom: '1rem' }}>Associate Software Engineer</h4>
          <p style={{ color: '#8A8A93', lineHeight: '1.6', fontSize: '0.9rem' }}>
            Building software. Solving problems. Learning continuously.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#fff' }}>Quick Links</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li><a href={sectionHref('home')} style={{ color: '#8A8A93', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#7C3AED'} onMouseOut={e => e.target.style.color = '#8A8A93'}><i className='bx bx-chevron-right' style={{ color: '#7C3AED' }}></i> Home</a></li>
            <li><a href={sectionHref('about')} style={{ color: '#8A8A93', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#7C3AED'} onMouseOut={e => e.target.style.color = '#8A8A93'}><i className='bx bx-chevron-right' style={{ color: '#7C3AED' }}></i> About</a></li>
            <li><a href={sectionHref('skills')} style={{ color: '#8A8A93', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#7C3AED'} onMouseOut={e => e.target.style.color = '#8A8A93'}><i className='bx bx-chevron-right' style={{ color: '#7C3AED' }}></i> Skills</a></li>
            <li><a href={sectionHref('work')} style={{ color: '#8A8A93', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#7C3AED'} onMouseOut={e => e.target.style.color = '#8A8A93'}><i className='bx bx-chevron-right' style={{ color: '#7C3AED' }}></i> Experience</a></li>
            <li><a href={sectionHref('work')} style={{ color: '#8A8A93', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#7C3AED'} onMouseOut={e => e.target.style.color = '#8A8A93'}><i className='bx bx-chevron-right' style={{ color: '#7C3AED' }}></i> Work</a></li>
            <li><Link to="/learning" style={{ color: '#8A8A93', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#7C3AED'} onMouseOut={e => e.target.style.color = '#8A8A93'}><i className='bx bx-chevron-right' style={{ color: '#7C3AED' }}></i> My Learning</Link></li>
            <li><a href={sectionHref('contact')} style={{ color: '#8A8A93', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#7C3AED'} onMouseOut={e => e.target.style.color = '#8A8A93'}><i className='bx bx-chevron-right' style={{ color: '#7C3AED' }}></i> Contact</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#fff' }}>Contact Info</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <li style={{ color: '#8A8A93', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><i className='bx bx-envelope' style={{ color: '#7C3AED', fontSize: '1.1rem' }}></i> moh.sadik2k01@gmail.com</li>
            <li style={{ color: '#8A8A93', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><i className='bx bx-map' style={{ color: '#7C3AED', fontSize: '1.1rem' }}></i> India</li>
          </ul>
          
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <a href="https://www.linkedin.com/in/sadik-mohammad-a340a2262/" target="_blank" rel="noreferrer" style={{ width: '35px', height: '35px', backgroundColor: '#1C1C24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A8A93', transition: '0.3s' }} onMouseOver={e => {e.currentTarget.style.backgroundColor='#7C3AED'; e.currentTarget.style.color='#fff'}} onMouseOut={e => {e.currentTarget.style.backgroundColor='#1C1C24'; e.currentTarget.style.color='#8A8A93'}}><i className='bx bxl-linkedin'></i></a>
            <a href="https://github.com/Mohammad-sadik" target="_blank" rel="noreferrer" style={{ width: '35px', height: '35px', backgroundColor: '#1C1C24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A8A93', transition: '0.3s' }} onMouseOver={e => {e.currentTarget.style.backgroundColor='#7C3AED'; e.currentTarget.style.color='#fff'}} onMouseOut={e => {e.currentTarget.style.backgroundColor='#1C1C24'; e.currentTarget.style.color='#8A8A93'}}><i className='bx bxl-github'></i></a>
            <a href="mailto:moh.sadik2k01@gmail.com" style={{ width: '35px', height: '35px', backgroundColor: '#1C1C24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A8A93', transition: '0.3s' }} onMouseOver={e => {e.currentTarget.style.backgroundColor='#7C3AED'; e.currentTarget.style.color='#fff'}} onMouseOut={e => {e.currentTarget.style.backgroundColor='#1C1C24'; e.currentTarget.style.color='#8A8A93'}}><i className='bx bx-envelope'></i></a>
            <a href="https://x.com/SadiqMo82770177" target="_blank" rel="noreferrer" style={{ width: '35px', height: '35px', backgroundColor: '#1C1C24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A8A93', transition: '0.3s' }} onMouseOver={e => {e.currentTarget.style.backgroundColor='#7C3AED'; e.currentTarget.style.color='#fff'}} onMouseOut={e => {e.currentTarget.style.backgroundColor='#1C1C24'; e.currentTarget.style.color='#8A8A93'}}><i className='bx bxl-twitter'></i></a>
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', borderTop: '1px solid #1C1C24', paddingTop: '2rem', marginTop: '2rem' }}>
        <p style={{ color: '#8A8A93', fontSize: '0.9rem' }}>
          © 2026 Sadik Mohammad. All rights reserved.
        </p>
      </div>

      <a className="floating-whatsapp" aria-label="Contact Sadik on WhatsApp" href="https://wa.me/" target="_blank" rel="noreferrer" style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        width: '50px',
        height: '50px',
        backgroundColor: '#25D366',
        color: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        boxShadow: '0 4px 10px rgba(37, 211, 102, 0.4)',
        zIndex: 100,
        transition: 'transform 0.3s ease'
      }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
        <i className='bx bxl-whatsapp'></i>
      </a>

      <button className="scroll-top-button" aria-label="Back to top" onClick={scrollTop} style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '45px',
        height: '45px',
        backgroundColor: '#7C3AED',
        color: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(124, 58, 237, 0.4)',
        zIndex: 100,
        opacity: showScroll ? 1 : 0,
        visibility: showScroll ? 'visible' : 'hidden',
        transform: showScroll ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.3s ease'
      }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
        <i className='bx bx-chevron-up'></i>
      </button>
    </footer>
  )
}

export default Footer

