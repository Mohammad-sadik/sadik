import React, { useEffect } from 'react';

const Skills = () => {
  useEffect(() => {
    // Dynamically inject Devicon for brand icons if not already present
    if (!document.getElementById('devicon-css')) {
      const link = document.createElement('link');
      link.id = 'devicon-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css';
      document.head.appendChild(link);
    }
  }, []);

  const skillCategories = [
    {
      title: 'FRONTEND',
      skills: [
        { name: 'React.js', icon: 'devicon-react-original colored' },
        { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
        { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
        { name: 'HTML5', icon: 'devicon-html5-plain colored' },
        { name: 'CSS3', icon: 'devicon-css3-plain colored' },
        { name: 'Tailwind', icon: 'devicon-tailwindcss-original colored' },
        { name: 'Bootstrap', icon: 'devicon-bootstrap-plain colored' }
      ]
    },
    {
      title: 'BACKEND',
      skills: [
        { name: 'Python', icon: 'devicon-python-plain colored' },
        { name: 'FastAPI', icon: 'devicon-fastapi-plain colored' },
        { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
        { name: 'Express.js', icon: 'devicon-express-original', color: 'var(--title-color)' },
        { name: 'REST APIs', icon: 'bx bx-code-alt', color: '#38bdf8' }
      ]
    },
    {
      title: 'DATABASE',
      skills: [
        { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
        { name: 'MySQL', icon: 'devicon-mysql-plain colored' },
        { name: 'SQLite', icon: 'devicon-sqlite-plain colored' },
        { name: 'Redis', icon: 'devicon-redis-plain colored' }
      ]
    },
    {
      title: 'CLOUD & INTEGRATIONS',
      skills: [
        { name: 'AWS S3', icon: 'devicon-amazonwebservices-original colored' },
        { name: 'Firebase', icon: 'devicon-firebase-plain colored' },
        { name: 'Vercel', icon: 'devicon-vercel-original', color: 'var(--title-color)' },
        { name: 'Payment APIs', icon: 'bx bx-credit-card', color: '#10b981' },
        { name: 'SMS / OTP', icon: 'bx bx-message-rounded-dots', color: '#f59e0b' }
      ]
    },
    {
      title: 'DEVELOPMENT TOOLS',
      skills: [
        { name: 'Git', icon: 'devicon-git-plain colored' },
        { name: 'GitHub', icon: 'devicon-github-original', color: 'var(--title-color)' },
        { name: 'Postman', icon: 'devicon-postman-plain colored' },
        { name: 'VS Code', icon: 'devicon-vscode-plain colored' },
        { name: 'npm', icon: 'devicon-npm-original-wordmark colored' }
      ]
    }
  ];

  return (
    <section className="skills section" id="skills">
      
      <style>{`
        .skills-wrapper {
          background-color: transparent;
          padding: 1rem 0;
          margin-bottom: 2rem;
          width: 100%;
        }
        .skills-header {
          text-align: center;
          margin-bottom: 3rem;
          width: 100%;
        }
        .skills-subtitle {
          color: var(--text-color, #6b7280);
          font-size: 1rem;
          margin-top: -1.5rem;
        }
        .skills-category {
          margin-bottom: 3rem;
          width: 100%;
        }
        .category-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #8b5cf6;
          letter-spacing: 1.5px;
          margin-bottom: 1rem;
          text-transform: uppercase;
          text-align: center;
        }
        .category-line {
          width: min(100%, 900px);
          height: 1px;
          background-color: #e5e7eb;
          margin: 0 auto 2rem;
        }
        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
        }
        .skill-card {
          width: 120px;
          min-height: 120px;
          background-color: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--card-border);
          box-shadow: 0 4px 15px var(--shadow-color);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }
        .skill-card:hover {
          transform: translateY(-5px);
          border-color: #8b5cf6;
          box-shadow: 0 8px 25px rgba(0,0,0,0.25);
        }
        .skill-icon {
          font-size: 2.5rem;
        }
        .skill-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--title-color);
          text-align: center;
          letter-spacing: 0.5px;
          line-height: 1.35;
        }
        
        @media screen and (max-width: 576px) {
          .skills-grid {
            justify-content: center;
          }
          .skill-card {
            width: 110px;
            height: 110px;
            gap: 1rem;
          }
          .skill-icon {
            font-size: 3rem;
          }
        }
      `}</style>

      <h2 className="section-title">
        Skills & <span style={{ color: '#8b5cf6' }}>Abilities</span>
      </h2>
      
      <div className="skills-wrapper bd-grid">
        <div className="skills-header">
          <p className="skills-subtitle">Technologies I work with</p>
        </div>

        {skillCategories.map((cat, idx) => (
          <div key={idx} className="skills-category">
            <h3 className="category-title">{cat.title}</h3>
            <div className="category-line"></div>
            
            <div className="skills-grid">
              {cat.skills.map((skill, sIdx) => (
                <div key={sIdx} className="skill-card">
                  <div className="skill-icon" style={{ color: skill.color || 'inherit' }}>
                    <i className={skill.icon}></i>
                  </div>
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}

export default Skills;
