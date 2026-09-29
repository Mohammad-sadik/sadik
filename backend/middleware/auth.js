const jwt = require('jsonwebtoken');
const AdminSession = require('../models/AdminSession');

const IDLE_SESSION_DURATION_MS = 10 * 60 * 60 * 1000;

function createAuthMiddleware({ touchActivity = true } = {}) {
  return async function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const token = authHeader.slice('Bearer '.length);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.sessionId) {
            return res.status(401).json({ error: 'Session expired. Please sign in again.' });
        }

        const now = new Date();
        const session = await AdminSession.findOne({
            _id: decoded.sessionId,
            revokedAt: null,
            expiresAt: { $gt: now }
        });
        if (!session) return res.status(401).json({ error: 'Session ended. Please sign in again.' });

        if (now.getTime() - session.lastActiveAt.getTime() >= IDLE_SESSION_DURATION_MS) {
            await AdminSession.updateOne(
                { _id: session._id, revokedAt: null },
                { $set: { revokedAt: now } }
            );
            return res.status(401).json({ error: 'You were signed out after 10 hours of inactivity. Please sign in again.' });
        }

        req.user = decoded;
        req.sessionId = session._id.toString();

        const activityUpdateCutoff = new Date(now.getTime() - 5 * 60 * 1000);
        if (touchActivity && session.lastActiveAt < activityUpdateCutoff) {
            await AdminSession.updateOne(
                { _id: session._id, lastActiveAt: { $lt: activityUpdateCutoff } },
                { $set: { lastActiveAt: now } }
            );
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
        }
        console.error('Unable to verify admin session:', error.message);
        return res.status(503).json({ error: 'Session verification is temporarily unavailable.' });
    }
  };
}

module.exports = createAuthMiddleware();
module.exports.withoutActivity = createAuthMiddleware({ touchActivity: false });
