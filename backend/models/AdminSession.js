const mongoose = require('mongoose');

const adminSessionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    ip: { type: String, required: true },
    device: { type: String, required: true },
    userAgent: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    lastActiveAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null }
}, { bufferCommands: false });

adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('AdminSession', adminSessionSchema);
