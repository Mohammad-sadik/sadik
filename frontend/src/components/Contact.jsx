import { useState } from 'react'
import { motion } from 'framer-motion'

import { API_URL } from '../config/api'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('Sending...')
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setStatus('Message sent successfully!')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('Failed to send message. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setStatus('Failed to send message. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 60 } }
  }

  const inputStyle = {
    width: '100%',
    padding: '1.2rem',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    background: 'var(--card-bg)',
    color: 'var(--text-color)',
    fontSize: '1rem',
    outline: 'none',
    transition: '0.3s',
    fontFamily: 'inherit'
  }

  return (
    <section className="contact section" id="contact">
      <style>{`
        .contact__input-group {
          margin-bottom: 1.5rem;
        }
        .contact__input:focus {
          border-color: var(--first-color);
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
        }
        .contact__social-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          transition: 0.3s;
          background: transparent;
          color: var(--title-color);
          border: 1px solid var(--card-border);
        }
        .contact__social-btn:hover {
          background: rgba(124, 58, 237, 0.05);
          border-color: var(--first-color);
          color: var(--first-color);
          transform: translateY(-3px);
        }
        .contact__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          max-width: 1120px;
          margin: 0 auto;
        }
        @media screen and (min-width: 768px) {
          .contact__grid {
            grid-template-columns: 1fr 1.2fr;
          }
        }
      `}</style>

      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Get In <span style={{ color: 'var(--first-color)' }}>Touch</span>
      </motion.h2>

      <motion.div 
        className="contact__grid bd-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        
        {/* Left Side: Info */}
        <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--title-color)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Let's Build Something <br/><span style={{ color: 'var(--first-color)' }}>Great Together.</span>
          </h3>
          <p style={{ color: 'var(--text-color)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Have a project, opportunity, or idea you'd like to discuss? I'm always interested in connecting with people, exploring new opportunities, and building robust software solutions.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <a href="mailto:moh.sadik2k01@gmail.com" className="contact__social-btn">
              <i className='bx bx-envelope' style={{ fontSize: '1.25rem' }}></i> Email Me
            </a>
            <a href="https://www.linkedin.com/in/sadik-mohammad-a340a2262/" target="_blank" rel="noreferrer" className="contact__social-btn">
              <i className='bx bxl-linkedin' style={{ fontSize: '1.25rem' }}></i> LinkedIn
            </a>
            <a href="https://github.com/Mohammad-sadik" target="_blank" rel="noreferrer" className="contact__social-btn">
              <i className='bx bxl-github' style={{ fontSize: '1.25rem' }}></i> GitHub
            </a>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          variants={itemVariants} 
          className="premium-card"
          style={{ padding: '2.5rem 2rem', background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)', boxShadow: '0 20px 40px var(--shadow-color)' }}
        >
          <form onSubmit={handleSubmit}>
            {status && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  marginBottom: '1.5rem', 
                  background: status.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: status.includes('success') ? '#16a34a' : '#dc2626',
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              >
                {status}
              </motion.div>
            )}
            
            <div className="contact__input-group">
              <input 
                type="text" 
                name="name"
                aria-label="Your name"
                placeholder="Your Name" 
                className="contact__input"
                style={inputStyle}
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact__input-group">
              <input 
                type="email" 
                name="email"
                aria-label="Your email"
                placeholder="Your Email" 
                className="contact__input"
                style={inputStyle}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact__input-group">
              <input 
                type="text" 
                name="subject"
                aria-label="Subject"
                placeholder="Subject" 
                className="contact__input"
                style={inputStyle}
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact__input-group">
              <textarea 
                name="message" 
                aria-label="Your message"
                rows="5" 
                placeholder="Your Message"
                className="contact__input"
                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <motion.button 
              type="submit" 
              disabled={isSubmitting}
              className="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, padding: '1.2rem' }}
            >
              {isSubmitting ? 'Sending...' : (
                <>Send Message <i className='bx bx-send' style={{ fontSize: '1.2rem' }}></i></>
              )}
            </motion.button>
          </form>
        </motion.div>

      </motion.div>
    </section>
  )
}

export default Contact


