const mongoose = require('mongoose');

const loginChallengeSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    ip: { type: String, required: true },
    device: { type: String, required: true },
    userAgent: { type: String, default: '' },
    pinHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date, default: null }
}, { bufferCommands: false });

loginChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('LoginChallenge', loginChallengeSchema);
