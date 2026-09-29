const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  'https://moh-sadik.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean));
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.has(origin)) return callback(null, true);
  return callback(new Error('Origin is not allowed by CORS.'));
} }));
app.use(express.json({ limit: '100kb' }));

// Set TRUST_PROXY_HOPS to the number of trusted reverse proxies in production.
const trustedProxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS || (process.env.NODE_ENV === 'production' ? '1' : '0'), 10);
if (trustedProxyHops > 0) app.set('trust proxy', trustedProxyHops);

// Serve static files for PDF uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.name, err.code || ''));

const subjectRoutes = require('./routes/subjectRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api', subjectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request is too large.' });
  if (err.message === 'Origin is not allowed by CORS.') return res.status(403).json({ error: 'This website is not allowed to access the API.' });
  console.error('Request failed:', err.message);
  return res.status(400).json({ error: 'Invalid request.' });
});

const PORT = process.env.PORT || 5000;
// Render runs this Express app as a long-lived web service in production.
// Vercel imports the exported app as a serverless function instead.
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;


