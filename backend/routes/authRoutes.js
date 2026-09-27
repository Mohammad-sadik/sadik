const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const LoginGuard = require('../models/LoginGuard');
const AdminSession = require('../models/AdminSession');
const auth = require('../middleware/auth');

const ALERT_AFTER_FAILED_ATTEMPTS = 3;
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function getClientIp(req) {
    return (req.ip || req.socket?.remoteAddress || 'unknown').replace(/^::ffff:/i, '');
}

function describeDevice(userAgent = '') {
    const browser = /edg\//i.test(userAgent) ? 'Edge'
        : /firefox\//i.test(userAgent) ? 'Firefox'
            : /opr\//i.test(userAgent) || /opera/i.test(userAgent) ? 'Opera'
                : /chrome\//i.test(userAgent) && !/chromium/i.test(userAgent) ? 'Chrome'
                    : /safari\//i.test(userAgent) ? 'Safari' : 'Unknown browser';
    const platform = /android/i.test(userAgent) ? 'Android'
        : /iphone|ipad|ipod/i.test(userAgent) ? 'iOS'
            : /windows/i.test(userAgent) ? 'Windows'
                : /macintosh|mac os/i.test(userAgent) ? 'macOS'
                    : /linux/i.test(userAgent) ? 'Linux' : 'Unknown device';
    return `${browser} on ${platform}`;
}

async function sendLoginAlert(ip, failedAttempts, attemptedAt) {
    const recipient = process.env.ADMIN_ALERT_EMAIL || process.env.SMTP_USER;
    if (!recipient || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('Repeated login alert skipped: SMTP or ADMIN_ALERT_EMAIL is not configured.');
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
        subject: 'Repeated administrator login attempts',
        text: `More than ${ALERT_AFTER_FAILED_ATTEMPTS} failed administrator login attempts were made from the same IP address. The submitted usernames and passwords were not stored.\n\nIP address: ${ip}\nFailed attempts: ${failedAttempts}\nLast attempt: ${attemptedAt.toISOString()}`
    });
}

router.get('/status', async (req, res) => {
    try {
        await LoginGuard.findOne({ ip: getClientIp(req) }).select('_id').lean();
        res.json({ available: true });
    } catch (error) {
        console.error('Unable to check login service:', error.message);
        res.status(503).json({ error: 'Login access could not be verified. Please try again later.' });
    }
});

router.post('/login', async (req, res) => {
    const ip = getClientIp(req);
    const now = new Date();
    try {
        const { username, password } = req.body || {};
        const validCredentials = typeof username === 'string'
            && typeof password === 'string'
            && username === process.env.ADMIN_USERNAME
            && password === process.env.ADMIN_PASSWORD;

        if (validCredentials) {
            const userAgent = req.get('user-agent') || '';
            const session = await AdminSession.create({
                username,
                ip,
                device: describeDevice(userAgent),
                userAgent,
                expiresAt: new Date(now.getTime() + SESSION_DURATION_MS)
            });

            await LoginGuard.findOneAndUpdate(
                { ip },
                { $set: { failedAttempts: 0, firstFailedAt: now, lastFailedAt: now, alertSentAt: null } },
                { upsert: true, setDefaultsOnInsert: true }
            );

            const token = jwt.sign(
                { username, sessionId: session._id.toString() },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );
            return res.json({ token });
        }

        const updated = await LoginGuard.findOneAndUpdate(
            { ip },
            { $inc: { failedAttempts: 1 }, $set: { lastFailedAt: now }, $setOnInsert: { firstFailedAt: now } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (updated.failedAttempts > ALERT_AFTER_FAILED_ATTEMPTS) {
            const alertClaim = await LoginGuard.findOneAndUpdate(
                { ip, failedAttempts: { $gt: ALERT_AFTER_FAILED_ATTEMPTS }, alertSentAt: null },
                { $set: { alertSentAt: now } },
                { new: true }
            );
            if (alertClaim) {
                sendLoginAlert(ip, alertClaim.failedAttempts, now)
                    .catch(error => console.error('Unable to send repeated login alert:', error.message));
            }
        }

        return res.status(401).json({ error: 'Invalid username or password' });
    } catch (error) {
        console.error('Login request failed:', error.message);
        return res.status(503).json({ error: 'Sign-in is temporarily unavailable. Please try again later.' });
    }
});

router.get('/sessions', auth, async (req, res) => {
    try {
        const now = new Date();
        const sessions = await AdminSession.find({ revokedAt: null, expiresAt: { $gt: now } })
            .sort({ lastActiveAt: -1 })
            .select('username ip device createdAt lastActiveAt expiresAt');
        res.json(sessions.map(session => ({
            id: session._id,
            username: session.username,
            ip: session.ip,
            device: session.device,
            createdAt: session.createdAt,
            lastActiveAt: session.lastActiveAt,
            expiresAt: session.expiresAt,
            isCurrent: session._id.toString() === req.sessionId
        })));
    } catch (error) {
        console.error('Unable to load admin sessions:', error.message);
        res.status(500).json({ error: 'Unable to load signed-in devices.' });
    }
});

router.delete('/sessions/:sessionId', auth, async (req, res) => {
    try {
        const session = await AdminSession.findOneAndUpdate(
            { _id: req.params.sessionId, revokedAt: null, expiresAt: { $gt: new Date() } },
            { $set: { revokedAt: new Date() } },
            { new: true }
        );
        if (!session) return res.status(404).json({ error: 'Signed-in device not found.' });
        res.json({ message: 'Device signed out successfully.', wasCurrent: session._id.toString() === req.sessionId });
    } catch (error) {
        res.status(400).json({ error: 'Unable to sign out this device.' });
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        await AdminSession.findOneAndUpdate(
            { _id: req.sessionId, revokedAt: null },
            { $set: { revokedAt: new Date() } }
        );
        res.json({ message: 'Signed out successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to sign out this device.' });
    }
});

module.exports = router;
