const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Set TRUST_PROXY_HOPS to the number of trusted reverse proxies in production.
const trustedProxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS || '0', 10);
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

const PORT = process.env.PORT || 5000;
// Render runs this Express app as a long-lived web service in production.
// Vercel imports the exported app as a serverless function instead.
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;


