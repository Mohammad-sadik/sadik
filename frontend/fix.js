const fs = require('fs');

let homeJsx = fs.readFileSync('src/components/Home.jsx', 'utf8');

// The replacement logic to re-structure Home.jsx
homeJsx = import React from 'react';

const Home = () => {
  return (
    <section className="home bd-grid" id="home" style={{ alignItems: 'center' }}>
      <div className="home__data">
        <p className="home__greeting">Hi there,</p>
        <h1 className="home__title" style={{ fontWeight: 800, color: 'var(--title-color)' }}>
          Sadik Mohammad
        </h1>
        <p style={{ fontWeight: 500, color: '#555', marginTop: '10px', marginBottom: '2rem' }} className="home__subtitle">
          Associate Software Engineer
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
          <a href="#work" className="button">View My Work</a>
          <a href="#contact" className="button button-outline">Get In Touch</a>
        </div>
      </div>

      <div className="home__img">
        <svg className="home__blob" viewBox="0 0 479 467" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <mask id="mask0" mask-type="alpha">
            <path d="M9.19024 145.964C34.0253 76.5814 114.865 54.7299 184.111 29.4823C245.804 6.98884 311.86 -14.9503 370.735 14.143C431.207 44.026 467.948 107.508 477.191 174.311C485.897 237.229 454.931 294.377 416.506 344.954C373.74 401.245 326.068 462.801 255.442 466.189C179.416 469.835 111.552 422.137 65.1576 361.805C17.4835 299.81 -17.1617 219.583 9.19024 145.964Z"/>
          </mask>
          <g mask="url(#mask0)">
            <path d="M9.19024 145.964C34.0253 76.5814 114.865 54.7299 184.111 29.4823C245.804 6.98884 311.86 -14.9503 370.735 14.143C431.207 44.026 467.948 107.508 477.191 174.311C485.897 237.229 454.931 294.377 416.506 344.954C373.74 401.245 326.068 462.801 255.442 466.189C179.416 469.835 111.552 422.137 65.1576 361.805C17.4835 299.81 -17.1617 219.583 9.19024 145.964Z"/>
            <image className="home__blob-img" x="25" y="40" width="420" href="/assets/img/perfil.png"/>
          </g>
        </svg>
      </div>

      <div className="home__stats-grid">
        <div className="stat-card">
          <i className='bx bx-line-chart stat-icon'></i>
          <h3>1+ Years</h3>
          <p>Experience in Development</p>
        </div>
        <div className="stat-card">
          <i className='bx bx-server stat-icon'></i>
          <h3>Full Stack</h3>
          <p>End-to-end Application Development</p>
        </div>
        <div className="stat-card">
          <i className='bx bx-network-chart stat-icon'></i>
          <h3>REST APIs</h3>
          <p>Scalable Backend Systems</p>
        </div>
        <div className="stat-card">
          <i className='bx bx-cloud stat-icon'></i>
          <h3>Production</h3>
          <p>Reliable, Cloud-Based Applications</p>
        </div>
      </div>

      <p className="home__footer-text">
        Turning ideas and requirements into reliable, real-world software.
      </p>

    </section>
  )
}

export default Home
\;
fs.writeFileSync('src/components/Home.jsx', homeJsx, 'utf8');

let css = fs.readFileSync('src/styles/styles.css', 'utf8');
if (!css.includes('.home__stats-grid')) {
  css += \\n
/* Stats Grid */
.home__stats-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
}

.stat-card {
  background: #fff;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 2rem;
  color: var(--title-color, #333);
  margin-bottom: 0.5rem;
}

.stat-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--title-color);
  margin-bottom: 0.25rem;
}

.stat-card p {
  font-size: 0.8rem;
  color: #777;
}

.home__footer-text {
  grid-column: 1 / -1;
  font-size: 0.85rem;
  font-style: italic;
  color: #666;
  margin-top: 1rem;
}

@media screen and (max-width: 992px) {
  .home__stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 576px) {
  .home__stats-grid {
    grid-template-columns: 1fr;
  }
}
\;
  fs.writeFileSync('src/styles/styles.css', css, 'utf8');
}
