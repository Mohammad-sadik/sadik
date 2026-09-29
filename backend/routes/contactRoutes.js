const express = require('express');
const router = express.Router();
const sendMail = require('../utils/mailer');

const requestsByIp = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function getClientIp(req) {
  return (req.ip || req.socket?.remoteAddress || 'unknown').replace(/^::ffff:/i, '');
}

function isRateLimited(ip, now = Date.now()) {
  const entry = requestsByIp.get(ip);
  if (!entry || now >= entry.resetAt) {
    requestsByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

router.post('/', async (req, res) => {
  if (isRateLimited(getClientIp(req))) {
    return res.status(429).json({ message: 'Too many messages. Please try again in a few minutes.' });
  }

  const { name, email, subject, message } = req.body || {};
  if ([name, email, subject, message].some(value => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ message: 'Please provide your name, email, subject, and message.' });
  }
  if (name.length > 100 || email.length > 254 || subject.length > 160 || message.length > 5000) {
    return res.status(400).json({ message: 'One or more fields are too long.' });
  }
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email.trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  const recipient = process.env.ADMIN_ALERT_EMAIL || process.env.SMTP_USER;
  if (!recipient) return res.status(503).json({ message: 'The contact form is temporarily unavailable.' });
  try {
    await sendMail({
      to: recipient,
      replyTo: email.trim(),
      subject: `Portfolio contact: ${subject.trim().slice(0, 160)}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${subject.trim()}\n\n${message.trim()}`
    });
    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending contact email:', error.message);
    return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
