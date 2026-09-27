const mongoose = require('mongoose');

const loginGuardSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true, index: true },
    failedAttempts: { type: Number, default: 0 },
    firstFailedAt: { type: Date, default: Date.now },
    lastFailedAt: { type: Date, default: Date.now },
    alertSentAt: { type: Date, default: null }
}, { timestamps: true, bufferCommands: false });

module.exports = mongoose.model('LoginGuard', loginGuardSchema);
