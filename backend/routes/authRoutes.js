const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendMail = require('../utils/mailer');
const LoginGuard = require('../models/LoginGuard');
const AdminSession = require('../models/AdminSession');
const LoginChallenge = require('../models/LoginChallenge');
const auth = require('../middleware/auth');

const ALERT_AFTER_FAILED_ATTEMPTS = 3;
const LOGIN_PIN_LIFETIME_MS = 5 * 60 * 1000;
const MAX_LOGIN_PIN_ATTEMPTS = 5;
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const PIN_REQUEST_COOLDOWN_MS = 60 * 1000;

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
    if (!recipient) {
        console.error('Repeated login alert skipped: ADMIN_ALERT_EMAIL is not configured.');
        return;
    }
    await sendMail({
        to: recipient,
        subject: 'Repeated administrator login attempts',
        text: `More than ${ALERT_AFTER_FAILED_ATTEMPTS} failed administrator login attempts were made from the same IP address. The submitted usernames and passwords were not stored.\n\nIP address: ${ip}\nFailed attempts: ${failedAttempts}\nLast attempt: ${attemptedAt.toISOString()}`
    });
}

function hashLoginPin(challengeId, pin) {
    return crypto.createHmac('sha256', process.env.JWT_SECRET)
        .update(`${challengeId}:${pin}`)
        .digest('hex');
}

async function sendLoginPin(pin) {
    const recipient = process.env.ADMIN_ALERT_EMAIL || process.env.SMTP_USER;
    if (!recipient) throw new Error('ADMIN_ALERT_EMAIL is not configured.');
    await sendMail({
        to: recipient,
        subject: 'Your administrator sign-in PIN',
        text: `Your four-digit administrator sign-in PIN is ${pin}. It expires in 5 minutes and can only be used once. If you did not just try to sign in, ignore this email.`
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

router.get('/session-status', auth.withoutActivity, (req, res) => {
    res.json({ active: true });
});

router.post('/activity', auth, (req, res) => {
    res.json({ active: true });
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
            const previousGuard = await LoginGuard.findOne({ ip }).select('pinRequestedAt').lean();
            if (previousGuard?.pinRequestedAt && now - previousGuard.pinRequestedAt < PIN_REQUEST_COOLDOWN_MS) {
                return res.status(429).json({ error: 'Please wait one minute before requesting another PIN.' });
            }
            const pinGateFilter = previousGuard
                ? { ip, pinRequestedAt: previousGuard.pinRequestedAt ?? null }
                : { ip };
            const pinGate = await LoginGuard.findOneAndUpdate(
                pinGateFilter,
                { $set: { pinRequestedAt: now, failedAttempts: 0, firstFailedAt: now, lastFailedAt: now, alertSentAt: null } },
                { upsert: !previousGuard, new: true, setDefaultsOnInsert: true }
            );
            if (!pinGate) return res.status(429).json({ error: 'Please wait one minute before requesting another PIN.' });
            const userAgent = req.get('user-agent') || '';

            const challengeId = crypto.randomBytes(24).toString('hex');
            const pin = String(crypto.randomInt(0, 10000)).padStart(4, '0');
            await LoginChallenge.updateMany(
                { username, consumedAt: null },
                { $set: { consumedAt: now } }
            );
            const challenge = new LoginChallenge({
                _id: challengeId,
                username,
                ip,
                device: describeDevice(userAgent),
                userAgent,
                pinHash: hashLoginPin(challengeId, pin),
                expiresAt: new Date(now.getTime() + LOGIN_PIN_LIFETIME_MS)
            });
            await challenge.save();
            try {
                await sendLoginPin(pin);
            } catch (emailError) {
                await LoginChallenge.deleteOne({ _id: challengeId });
                console.error('Unable to send administrator login PIN:', emailError.message);
                return res.status(503).json({ error: 'Could not send the verification PIN. Check the mail settings and try again.' });
            }
            return res.json({
                requiresPin: true,
                challengeId,
                expiresAt: challenge.expiresAt
            });
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

router.post('/verify-pin', async (req, res) => {
    const { challengeId, pin } = req.body || {};
    if (typeof challengeId !== 'string' || typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
        return res.status(400).json({ error: 'Enter the four-digit PIN from your email.' });
    }

    try {
        const now = new Date();
        const challenge = await LoginChallenge.findOne({
            _id: challengeId,
            consumedAt: null,
            expiresAt: { $gt: now },
            attempts: { $lt: MAX_LOGIN_PIN_ATTEMPTS }
        });
        if (!challenge) {
            return res.status(400).json({ error: 'This PIN has expired or has already been used. Sign in again to get a new one.' });
        }

        const submittedHash = Buffer.from(hashLoginPin(challengeId, pin), 'hex');
        const expectedHash = Buffer.from(challenge.pinHash, 'hex');
        if (submittedHash.length !== expectedHash.length || !crypto.timingSafeEqual(submittedHash, expectedHash)) {
            const updated = await LoginChallenge.findOneAndUpdate(
                { _id: challengeId, consumedAt: null, expiresAt: { $gt: now }, attempts: { $lt: MAX_LOGIN_PIN_ATTEMPTS } },
                { $inc: { attempts: 1 } },
                { new: true }
            );
            const remaining = updated ? Math.max(0, MAX_LOGIN_PIN_ATTEMPTS - updated.attempts) : 0;
            return res.status(401).json(remaining
                ? { error: `Incorrect PIN. ${remaining} attempts remaining.` }
                : { code: 'PIN_ATTEMPTS_EXCEEDED', error: 'Too many incorrect PINs. This sign-in attempt is locked. Start again to request a new PIN.' });
        }

        const consumed = await LoginChallenge.findOneAndUpdate(
            { _id: challengeId, pinHash: challenge.pinHash, consumedAt: null, expiresAt: { $gt: now }, attempts: { $lt: MAX_LOGIN_PIN_ATTEMPTS } },
            { $set: { consumedAt: now } },
            { new: true }
        );
        if (!consumed) {
            return res.status(400).json({ error: 'This PIN has expired or has already been used. Sign in again to get a new one.' });
        }

        const session = await AdminSession.create({
            username: consumed.username,
            ip: consumed.ip,
            device: consumed.device,
            userAgent: consumed.userAgent,
            expiresAt: new Date(now.getTime() + SESSION_DURATION_MS)
        });
        const token = jwt.sign(
            { username: consumed.username, sessionId: session._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        return res.json({ token });
    } catch (error) {
        console.error('Login PIN verification failed:', error.message);
        return res.status(503).json({ error: 'PIN verification is temporarily unavailable. Please try again.' });
    }
});

router.get('/sessions', auth, async (req, res) => {
    try {
        const now = new Date();
        const idleCutoff = new Date(now.getTime() - 10 * 60 * 60 * 1000);
        const sessions = await AdminSession.find({
            revokedAt: null,
            expiresAt: { $gt: now },
            lastActiveAt: { $gt: idleCutoff }
        })
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
