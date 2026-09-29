const mongoose = require('mongoose');

const learningContentSchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    sections: [{
        title: { type: String, required: true, trim: true },
        body: { type: String, required: true },
        order: { type: Number, default: 0 }
    }],
    pdf_file: { type: String, default: null }, // Legacy field; stores the uploaded Cloudinary URL
    media_type: { type: String, default: null },
    media_name: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LearningContent', learningContentSchema);
