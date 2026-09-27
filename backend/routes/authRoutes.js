const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const LoginGuard = require('../models/LoginGuard');
const auth = require('../middleware/auth');

const MAX_FAILED_ATTEMPTS = 5;

function getClientIp(req) {
    return (req.ip || req.socket?.remoteAddress || 'unknown').replace(/^::ffff:/i, '');
}

async function sendBlockAlert(ip, blockedAt) {
    const recipient = process.env.ADMIN_ALERT_EMAIL || process.env.SMTP_USER;
    if (!recipient || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('Login block alert email skipped: SMTP or ADMIN_ALERT_EMAIL is not configured.');
        return;
    }

    const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
        from: `Portfolio Security <${process.env.SMTP_USER}>`,
        to: recipient,
        subject: 'Portfolio admin login blocked an IP address',
        text: `An IP address was blocked after more than ${MAX_FAILED_ATTEMPTS} incorrect administrator login attempts.\n\nIP address: ${ip}\nBlocked at: ${blockedAt.toISOString()}\n\nYou can review or unblock this address from the admin dashboard.`
    });
}

router.get('/status', async (req, res) => {
    try {
        const ip = getClientIp(req);
        const record = await LoginGuard.findOne({ ip, isBlocked: true }).select('blockedAt');
        res.json({ blocked: Boolean(record), blockedAt: record?.blockedAt || null });
    } catch (error) {
        console.error('Unable to check login access:', error.message);
        res.status(503).json({ error: 'Login access could not be verified. Please try again later.' });
    }
});

router.post('/login', async (req, res) => {
    const ip = getClientIp(req);
    try {
        const existingGuard = await LoginGuard.findOne({ ip }).select('isBlocked');
        if (existingGuard?.isBlocked) {
            return res.status(403).json({ blocked: true, error: 'Administrator sign-in is blocked for this network. Contact the site owner.' });
        }

        const { username, password } = req.body || {};
        const validCredentials = typeof username === 'string'
            && typeof password === 'string'
            && username === process.env.ADMIN_USERNAME
            && password === process.env.ADMIN_PASSWORD;

        if (validCredentials) {
            await LoginGuard.findOneAndUpdate(
                { ip, isBlocked: false },
                { $set: { failedAttempts: 0, firstFailedAt: new Date(), lastFailedAt: new Date() } }
            );
            const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token });
        }

        const now = new Date();
        const updated = await LoginGuard.findOneAndUpdate(
            { ip, isBlocked: false },
            { $inc: { failedAttempts: 1 }, $set: { lastFailedAt: now }, $setOnInsert: { firstFailedAt: now } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (updated.failedAttempts > MAX_FAILED_ATTEMPTS) {
            const newlyBlocked = await LoginGuard.findOneAndUpdate(
                { ip, isBlocked: false, failedAttempts: { $gt: MAX_FAILED_ATTEMPTS } },
                { $set: { isBlocked: true, blockedAt: now } },
                { new: true }
            );

            if (newlyBlocked) {
                sendBlockAlert(ip, now).catch(error => console.error('Unable to send login block alert:', error.message));
            }
            return res.status(403).json({ blocked: true, error: 'Too many incorrect attempts. Administrator sign-in is now blocked for this network.' });
        }

        return res.status(401).json({ error: 'Invalid username or password' });
    } catch (error) {
        console.error('Login request failed:', error.message);
        return res.status(503).json({ error: 'Sign-in is temporarily unavailable. Please try again later.' });
    }
});

router.get('/blocked-ips', auth, async (req, res) => {
    try {
        const blocked = await LoginGuard.find({ isBlocked: true })
            .sort({ blockedAt: -1 })
            .select('ip failedAttempts blockedAt lastFailedAt');
        res.json(blocked.map(record => ({
            ip: record.ip,
            failedAttempts: record.failedAttempts,
            blockedAt: record.blockedAt,
            lastFailedAt: record.lastFailedAt
        })));
    } catch (error) {
        res.status(500).json({ error: 'Unable to load blocked addresses.' });
    }
});

router.delete('/blocked-ips/:ip', auth, async (req, res) => {
    try {
        const ip = decodeURIComponent(req.params.ip).replace(/^::ffff:/i, '');
        const updated = await LoginGuard.findOneAndUpdate(
            { ip, isBlocked: true },
            { $set: { isBlocked: false, failedAttempts: 0, blockedAt: null, firstFailedAt: new Date(), lastFailedAt: new Date() } },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Blocked address not found.' });
        res.json({ message: 'Address unblocked successfully.' });
    } catch (error) {
        res.status(400).json({ error: 'Unable to unblock this address.' });
    }
});

module.exports = router;
