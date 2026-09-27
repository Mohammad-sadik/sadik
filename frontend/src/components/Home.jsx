import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Server, Network, Cloud } from 'lucide-react';

const Home = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  return (
    <section className="home bd-grid" id="home">
      
      {/* LEFT COLUMN: TEXT */}
      <motion.div 
        className="home__data"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        
      >
        <motion.p variants={itemVariants} className="home__greeting">
          Hi there,
        </motion.p>
        
        <motion.h1 variants={itemVariants} className="home__title">
          I'm <span style={{ background: 'linear-gradient(90deg, var(--first-color), #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sadik Mohammad</span>
        </motion.h1>
        
        <motion.h2 variants={itemVariants} className="home__subtitle">
          Associate Software Engineer building modern, scalable digital experiences.
        </motion.h2>
        
        <motion.div variants={itemVariants} className="home__actions">
          <motion.a 
            href="#work" 
            className="button"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
          <motion.a 
            href="#contact" 
            className="button button-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>
      </motion.div>

      {/* RIGHT COLUMN: IMAGE */}
      <motion.div 
        className="home__img"
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring', delay: 0.15 }}
        aria-hidden="true"
      >
        <svg className="home__blob" viewBox="0 0 479 467" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0" mask-type="alpha">
            <path d="M9.19024 145.964C34.0253 76.5814 114.865 54.7299 184.111 29.4823C245.804 6.98884 311.86 -14.9503 370.735 14.143C431.207 44.026 467.948 107.508 477.191 174.311C485.897 237.229 454.931 294.377 416.506 344.954C373.74 401.245 326.068 462.801 255.442 466.189C179.416 469.835 111.552 422.137 65.1576 361.805C17.4835 299.81 -17.1617 219.583 9.19024 145.964Z"/>
          </mask>
          <g mask="url(#mask0)">
            <path d="M9.19024 145.964C34.0253 76.5814 114.865 54.7299 184.111 29.4823C245.804 6.98884 311.86 -14.9503 370.735 14.143C431.207 44.026 467.948 107.508 477.191 174.311C485.897 237.229 454.931 294.377 416.506 344.954C373.74 401.245 326.068 462.801 255.442 466.189C179.416 469.835 111.552 422.137 65.1576 361.805C17.4835 299.81 -17.1617 219.583 9.19024 145.964Z" fill="var(--first-color)"/>
            <image className="home__blob-img" x="25" y="40" width="420" href="/assets/img/perfil.png"/>
          </g>
        </svg>
      </motion.div>

      {/* FULL WIDTH COLUMN: CARDS */}
      <motion.div 
        className="home__stats-grid"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.45 }}
        
      >
        {[
          { icon: TrendingUp, title: '1+ Years', desc: 'Experience in Development' },
          { icon: Server, title: 'Full Stack', desc: 'End-to-end Application Development' },
          { icon: Network, title: 'REST APIs', desc: 'Scalable Backend Systems' },
          { icon: Cloud, title: 'Production', desc: 'Reliable, Cloud-Based Applications' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            className="stat-card premium-card"
            whileHover={{ y: -10 }}
            style={{ transition: 'box-shadow 220ms ease, border-color 220ms ease' }}
          >
            <div className="stat-card__icon">
              <stat.icon size={28} color="var(--first-color)" strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--title-color)' }}>{stat.title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.5 }}>{stat.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      
      <p className="home__footer-text">
        Turning ideas and requirements into reliable, real-world software.
      </p>
    </section>
  )
}

export default Home;

