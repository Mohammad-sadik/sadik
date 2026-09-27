const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', subjectSchema);

