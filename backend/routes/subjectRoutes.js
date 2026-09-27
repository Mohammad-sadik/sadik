const express = require('express');
const router = express.Router();
const multer = require('multer');
const Subject = require('../models/Subject');
const LearningContent = require('../models/LearningContent');
const auth = require('../middleware/auth'); // Add auth middleware

// Set up multer for PDF uploads (local storage for dev)
// In production on Vercel, you'd use something like Cloudinary or AWS S3
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- SUBJECT ROUTES ---

// Get all subjects
router.get('/subjects', async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ createdAt: -1 });
        // Map to match the frontend expected format (id instead of _id)
        const formatted = subjects.map(s => ({
            id: s._id,
            title: s.title,
            description: s.description,
            created_at: s.createdAt
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single subject and its contents
router.get('/subjects/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        
        const contents = await LearningContent.find({ subject: subject._id }).sort({ createdAt: -1 });
        
        res.json({
            id: subject._id,
            title: subject.title,
            description: subject.description,
            contents: contents.map(c => ({
                id: c._id,
                title: c.title,
                body: c.body,
                sections: (c.sections || []).sort((a, b) => a.order - b.order).map(section => ({
                    title: section.title,
                    body: section.body,
                    order: section.order
                })),
                pdf_file: c.pdf_file ? `/uploads/${c.pdf_file}` : null,
                created_at: c.createdAt
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a subject (Protected)
router.post('/subjects', auth, async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json(subject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- CONTENT ROUTES ---

// Create content (Protected)
router.post('/subjects/:id/contents', auth, upload.single('pdf'), async (req, res) => {
    try {
        const sections = req.body.sections ? JSON.parse(req.body.sections) : [];
        const content = new LearningContent({
            subject: req.params.id,
            title: req.body.title,
            body: req.body.body,
            sections: sections.map((section, order) => ({ title: section.title, body: section.body, order })),
            pdf_file: req.file ? req.file.filename : null
        });
        await content.save();
        res.status(201).json({
            id: content._id,
            title: content.title,
            body: content.body,
            sections: content.sections,
            pdf_file: content.pdf_file ? `/uploads/${content.pdf_file}` : null
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update an article and its ordered Knowledge Hub sections (Protected)
router.put('/contents/:id', auth, upload.single('pdf'), async (req, res) => {
    try {
        const updates = { title: req.body.title, body: req.body.body };
        if (req.body.sections !== undefined) {
            const sections = JSON.parse(req.body.sections);
            updates.sections = sections.map((section, order) => ({ title: section.title, body: section.body, order }));
        }
        if (req.file) updates.pdf_file = req.file.filename;

        const content = await LearningContent.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!content) return res.status(404).json({ error: 'Content not found.' });
        res.json({
            id: content._id,
            title: content.title,
            body: content.body,
            sections: content.sections,
            pdf_file: content.pdf_file ? `/uploads/${content.pdf_file}` : null
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a subject and all its contents (Protected)
router.delete('/subjects/:id', auth, async (req, res) => {
    try {
        await LearningContent.deleteMany({ subject: req.params.id });
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject and contents deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete specific learning content (Protected)
router.delete('/contents/:id', auth, async (req, res) => {
    try {
        await LearningContent.findByIdAndDelete(req.params.id);
        res.json({ message: 'Content deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
