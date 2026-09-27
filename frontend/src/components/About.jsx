import React from 'react';
import { motion } from 'framer-motion';
import { LayoutTemplate, Braces, Lightbulb, BookOpen } from 'lucide-react';

const About = () => {
  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
  };

  const imageReveal = {
    hidden: { opacity: 0, scale: 0.9, rotate: -2 },
    show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.8, type: 'spring' } }
  };

  const cards = [
    {
      title: 'Full Stack Development',
      desc: 'Building applications across frontend and backend.',
      icon: LayoutTemplate,
      number: '01'
    },
    {
      title: 'API Development',
      desc: 'Designing and integrating robust REST APIs.',
      icon: Braces,
      number: '02'
    },
    {
      title: 'Problem Solving',
      desc: 'Debugging and solving real-world challenges.',
      icon: Lightbulb,
      number: '03'
    },
    {
      title: 'Continuous Learning',
      desc: 'Exploring new technologies and best practices.',
      icon: BookOpen,
      number: '04'
    }
  ];

  return (
    <section className="about section" id="about" style={{ paddingBlock: '8rem 4rem' }}>
      <motion.h2 
        className="section-title about__title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        About Me
      </motion.h2>

      <div className="about__container bd-grid about__grid" >
        
        {/* Left Side: Image / Visual Element */}
        <motion.div 
          className="about__img"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          variants={imageReveal}
          style={{ position: 'relative' }}
        >
          {/* Decorative backdrop */}
          <div style={{ position: 'absolute', inset: '-15px', background: 'linear-gradient(135deg, var(--first-color), #8B5CF6)', borderRadius: '24px', opacity: 0.3, filter: 'blur(20px)', zIndex: -1 }}></div>
          
          <img 
            src="/assets/img/about.jpg" 
            alt="Sadik Mohammad" 
            style={{ width: '100%', borderRadius: '24px', objectFit: 'cover', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.1)' }} 
          />
          
          <motion.div 
            className="about__experience-badge"
            style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
            whileHover={{ y: -5, scale: 1.05 }}
          >
            <p style={{ fontWeight: 800, fontSize: '2rem', color: 'var(--first-color)', lineHeight: 1 }}>1+</p>
            <p style={{ fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>Years of Code</p>
          </motion.div>
        </motion.div>
        
        {/* Right Side: Text & Cards */}
        <motion.div
          className="about__copy"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          <motion.h2 variants={fadeUp} className="about__subtitle" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--title-color)', lineHeight: 1.3 }}>
            Building Software That Solves <span style={{ color: 'var(--first-color)' }}>Real Problems.</span>
          </motion.h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-color)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '3rem' }}>
            <motion.p variants={fadeUp}>
              I am an Associate Software Engineer passionate about building modern, reliable, and user-focused software applications.
            </motion.p>
            <motion.p variants={fadeUp}>
              My current work involves both frontend and backend development, where I build features, develop REST APIs, integrate third-party services, work with databases, and solve real-world application challenges.
            </motion.p>
            <motion.p variants={fadeUp}>
              I primarily work with <strong>Python, FastAPI, React, TypeScript, JavaScript, PostgreSQL,</strong> and REST APIs. I enjoy understanding how different parts of an application work together, from the user interface to the backend logic and database.
            </motion.p>
            <motion.p variants={fadeUp}>
              I have hands-on experience working on production applications, including marketplace platforms and service-based applications. My work includes payment integrations, authentication, notifications, SMS/OTP services, logistics integrations, admin portals, seller workflows, and API development.
            </motion.p>
          </div>

          <motion.div 
            className="about__services"
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}
          >
            {cards.map((card, idx) => (
              <motion.div 
                key={idx}
                variants={fadeUp}
                className="premium-card"
                whileHover={{ y: -5 }}
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  padding: '1.5rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(124, 58, 237, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', fontWeight: 900, color: 'rgba(124, 58, 237, 0.05)', zIndex: 0 }}>
                  {card.number}
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <card.icon size={24} color="var(--first-color)" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--title-color)', fontWeight: 700, marginBottom: '0.5rem' }}>{card.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', lineHeight: 1.5 }}>{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>                                   
      </div>
    </section>
  )
}

export default About;

