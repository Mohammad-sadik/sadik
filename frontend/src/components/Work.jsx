import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { experiences } from './experienceData';

const Work = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          } else {
            entry.target.classList.remove('animate-in');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  // Show only first 3 items on home page
  const displayedExperiences = experiences.slice(0, 3);

  return (
    <section className="work section" id="work">
      <style>{`
        .experience-wrapper {
          background-color: transparent;
          padding: 1rem 1rem 2rem;
          margin-bottom: 1rem;
          color: var(--second-color);
        }
        .experience-title {
          text-align: center;
          font-size: var(--h2-font-size);
          font-weight: var(--font-semi);
          color: var(--first-color);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
          position: relative;
        }
        .experience-title::after {
          position: absolute;
          content: '';
          width: 64px;
          height: 0.18rem;
          left: 0;
          right: 0;
          margin: auto;
          bottom: -10px; top: auto;
          background-color: var(--first-color);
        }
        .timeline-container {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }
        .timeline-container::after {
          content: '';
          position: absolute;
          width: 2px;
          background: var(--card-border);
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        .timeline-row {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        .timeline-row:nth-child(even) {
          flex-direction: row-reverse;
        }
        
        .timeline-card {
          width: 45%;
          background: var(--card-bg);
          padding: 1.2rem;
          border-radius: 12px;
          position: relative;
          border: 1px solid var(--card-border);
          box-shadow: 0 4px 15px var(--shadow-color);
          text-align: left;
          opacity: 0;
          transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .timeline-row:nth-child(odd) .timeline-card { transform: translateX(-60px); }
        .timeline-row:nth-child(even) .timeline-card { transform: translateX(60px); }

        .timeline-icon {
          position: absolute;
          left: 50%;
          top: 1.5rem;
          width: 40px;
          height: 40px;
          background: var(--card-bg);
          border: 2px solid var(--first-color);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
          color: var(--first-color);
          font-size: 1.2rem;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.3);
          transition: opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transition-delay: 0.2s;
        }

        .timeline-row:nth-child(odd) .timeline-card.animate-in,
        .timeline-row:nth-child(even) .timeline-card.animate-in {
          opacity: 1;
          transform: translateX(0);
        }
        
        .timeline-card.animate-in:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px var(--shadow-color);
          border-color: var(--first-color);
        }
        .timeline-icon.animate-in {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .timeline-row:nth-child(odd) .timeline-card::after {
          content: ''; position: absolute; top: 1.5rem; right: -10px; width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 10px solid var(--card-bg); filter: drop-shadow(2px 0px 1px var(--shadow-color));
        }
        .timeline-row:nth-child(even) .timeline-card::after {
          content: ''; position: absolute; top: 1.5rem; left: -10px; width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-right: 10px solid var(--card-bg); filter: drop-shadow(-2px 0px 1px var(--shadow-color));
        }
        
        .btn-view-timeline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.8rem;
          background-color: var(--first-color);
          color: #fff;
          border-radius: 8px;
          font-weight: 600;
          transition: 0.3s;
          box-shadow: 0 4px 15px var(--shadow-color);
        }
        .btn-view-timeline:hover {
          background-color: var(--first-color);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px var(--shadow-color);
        }

        @media screen and (max-width: 768px) {
          .timeline-container::after { left: 20px; }
          .timeline-row, .timeline-row:nth-child(even) { flex-direction: column; align-items: flex-end; }
          .timeline-card { width: calc(100% - 60px); }
          .timeline-row:nth-child(odd) .timeline-card, .timeline-row:nth-child(even) .timeline-card { transform: translateY(40px); }
          .timeline-row:nth-child(odd) .timeline-card.animate-in, .timeline-row:nth-child(even) .timeline-card.animate-in { transform: translateY(0); }
          .timeline-icon { left: 20px; }
          .timeline-icon.animate-in { transform: translate(-50%, -50%) scale(1); }
          .timeline-row:nth-child(odd) .timeline-card::after, .timeline-row:nth-child(even) .timeline-card::after {
            right: auto; left: -10px; top: 1.5rem; border-right: 10px solid var(--card-bg); border-left: none; filter: drop-shadow(-2px 0px 1px var(--shadow-color));
          }
        }
      `}</style>

      <div className="experience-wrapper bd-grid">
        <h2 className="experience-title">Experience</h2>
        <div className="timeline-container">
          {displayedExperiences.map((exp, idx) => (
            <div className="timeline-row" key={idx}>
              <div className="timeline-card scroll-animate">
                <h3 style={{ color: 'var(--first-color)', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.2rem' }}>{exp.company}</h3>
                <p style={{ color: 'var(--title-color)', fontWeight: '600', marginBottom: '0.2rem', fontSize: '1.05rem' }}>{exp.role}</p>
                <p style={{ color: 'var(--text-color)', fontSize: '0.85rem', marginBottom: '1rem' }}>{exp.duration}</p>
                <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', lineHeight: '1.6' }}>{exp.description}</p>
              </div>
              <div className="timeline-icon scroll-animate">
                <i className={exp.icon}></i>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/timeline" className="btn-view-timeline">
            View Full Timeline <i className='bx bx-right-arrow-alt'></i>
          </Link>
        </div>
      </div>

      <h2 className="section-title featured-work-title">Featured Work</h2>
      <div className="bd-grid project-card-grid">
        
        {/* ScrollMe */}
        <div className="project-card" style={{ padding: '1.2rem', borderRadius: '0.5rem', border: '1px solid var(--card-border)', boxShadow: '0 4px 15px var(--shadow-color)', backgroundColor: 'var(--card-bg)' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--title-color)', marginBottom: '0.2rem' }}>ScrollMe</h3>
          <p style={{ fontWeight: '600', color: 'var(--first-color)', marginBottom: '0.75rem' }}>A Full-Stack Marketplace Platform</p>
          <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>A marketplace platform connecting sellers, users, and creators through a complete digital shopping experience.</p>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>My Contributions</p>
          <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-color)' }}>
            <li>Developed and integrated backend APIs.</li>
            <li>Worked on seller and admin portal features.</li>
            <li>Implemented product uploading and product attributes.</li>
            <li>Developed categories and dynamic categories.</li>
            <li>Implemented coupons and offers.</li>
            <li>Worked on payment integration and verification.</li>
            <li>Implemented push notifications and notification grouping.</li>
            <li>Worked on authentication and role-based access.</li>
            <li>Worked on refund, return, and replacement workflows.</li>
            <li>Integrated logistics services.</li>
            <li>Fixed bugs and improved existing functionality.</li>
          </ul>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--title-color)' }}>Technology: React, TypeScript, Tailwind CSS, React Native, FastAPI, PostgreSQL, AWS S3, Firebase</p>
        </div>

        {/* WellWisher */}
        <div className="project-card" style={{ padding: '1.2rem', borderRadius: '0.5rem', border: '1px solid var(--card-border)', boxShadow: '0 4px 15px var(--shadow-color)', backgroundColor: 'var(--card-bg)' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--title-color)', marginBottom: '0.2rem' }}>WellWisher</h3>
          <p style={{ fontWeight: '600', color: 'var(--first-color)', marginBottom: '0.75rem' }}>A Service-Based Application</p>
          <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Worked on backend services and application features for a service-based platform, with a focus on APIs, payments, notifications, and user workflows.</p>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>My Contributions</p>
          <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-color)' }}>
            <li>Developed backend logic and services.</li>
            <li>Worked on payment integration and user verification.</li>
            <li>Implemented booking and service workflows.</li>
            <li>Integrated push notifications.</li>
            <li>Worked on authentication.</li>
            <li>Fixed issues across multiple feature areas.</li>
          </ul>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--title-color)' }}>Technology: React, Node.js, Express.js, PostgreSQL, Redux, React Native</p>
        </div>
        
      </div>
    </section>
  );
};

export default Work;


