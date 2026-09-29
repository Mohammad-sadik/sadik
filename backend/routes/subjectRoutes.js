const express = require('express');
const router = express.Router();
const multer = require('multer');
const Subject = require('../models/Subject');
const LearningContent = require('../models/LearningContent');
const auth = require('../middleware/auth'); // Add auth middleware

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Automatically configure using CLOUDINARY_URL from .env
cloudinary.config();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio_pdfs',
        allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'csv', 'txt', 'md', 'jpg', 'jpeg', 'png', 'webp', 'gif'],
        resource_type: 'auto'
    }
});
const allowedFiles = new Map([
    ['pdf', new Set(['application/pdf'])],
    ['doc', new Set(['application/msword', 'application/octet-stream'])],
    ['docx', new Set(['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/octet-stream'])],
    ['ppt', new Set(['application/vnd.ms-powerpoint', 'application/octet-stream'])],
    ['pptx', new Set(['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/octet-stream'])],
    ['xls', new Set(['application/vnd.ms-excel', 'application/octet-stream'])],
    ['xlsx', new Set(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/octet-stream'])],
    ['csv', new Set(['text/csv', 'application/vnd.ms-excel', 'application/octet-stream'])],
    ['txt', new Set(['text/plain', 'application/octet-stream'])],
    ['md', new Set(['text/markdown', 'text/plain', 'application/octet-stream'])],
    ['jpg', new Set(['image/jpeg'])], ['jpeg', new Set(['image/jpeg'])],
    ['png', new Set(['image/png'])], ['webp', new Set(['image/webp'])], ['gif', new Set(['image/gif'])]
]);
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, callback) => {
        if (!['file', 'pdf'].includes(file.fieldname)) return callback(new Error('Use the file upload field.'));
        const extension = file.originalname.split('.').pop()?.toLowerCase();
        const mimeTypes = allowedFiles.get(extension);
        if (!mimeTypes || !mimeTypes.has(file.mimetype)) return callback(new Error('Unsupported file type.'));
        callback(null, true);
    }
});
const parseContentUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]);
function uploadContentFile(req, res, next) {
    parseContentUpload(req, res, error => {
        if (!error) {
            if (req.files?.file?.length && req.files?.pdf?.length) return res.status(400).json({ error: 'Upload only one attachment.' });
            return next();
        }
        const tooLarge = error.code === 'LIMIT_FILE_SIZE';
        return res.status(tooLarge ? 413 : 400).json({ error: tooLarge ? 'Files must be 10 MB or smaller.' : error.message });
    });
}

function uploadedContentFile(req) {
    return req.files?.file?.[0] || req.files?.pdf?.[0] || null;
}

function contentAttachment(content) {
    if (!content.pdf_file) return { url: null, type: null, name: null };
    const url = /^https?:\/\//i.test(content.pdf_file) ? content.pdf_file : `/uploads/${content.pdf_file}`;
    return { url, type: content.media_type || null, name: content.media_name || null };
}

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
        console.error('Unable to list subjects:', err.message);
        res.status(503).json({ error: 'Subjects are temporarily unavailable.' });
    }
});

// Get a single subject and its contents
router.get('/subjects/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        
        // Keep older notes first so newly added notes append to the end of the list and flow onto later pages.
        const contents = await LearningContent.find({ subject: subject._id }).sort({ createdAt: 1, _id: 1 });
        
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
                pdf_file: contentAttachment(c).url,
                media_type: c.media_type || null,
                media_name: c.media_name || null,
                created_at: c.createdAt
            }))
        });
    } catch (err) {
        console.error('Unable to load subject:', err.message);
        res.status(503).json({ error: 'Subject content is temporarily unavailable.' });
    }
});

// Create a subject (Protected)
router.post('/subjects', auth, async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json(subject);
    } catch (err) {
        console.error('Unable to create subject:', err.message);
        res.status(400).json({ error: 'Unable to create subject. Check the title and description.' });
    }
});

// --- CONTENT ROUTES ---

// Create content (Protected)
router.post('/subjects/:id/contents', auth, uploadContentFile, async (req, res) => {
    try {
        const file = uploadedContentFile(req);
        const sections = req.body.sections ? JSON.parse(req.body.sections) : [];
        const content = new LearningContent({
            subject: req.params.id,
            title: req.body.title,
            body: req.body.body,
            sections: sections.map((section, order) => ({ title: section.title, body: section.body, order })),
            pdf_file: file ? file.path : null,
            media_type: file ? file.mimetype : null,
            media_name: file ? file.originalname : null
        });
        await content.save();
        res.status(201).json({
            id: content._id,
            title: content.title,
            body: content.body,
            sections: content.sections,
            pdf_file: contentAttachment(content).url,
            media_type: content.media_type,
            media_name: content.media_name
        });
    } catch (err) {
        console.error('Unable to save content:', err.message);
        res.status(400).json({ error: 'Unable to save content. Check the title, text, and attachment.' });
    }
});

// Update an article and its ordered Knowledge Hub sections (Protected)
router.put('/contents/:id', auth, uploadContentFile, async (req, res) => {
    try {
        const file = uploadedContentFile(req);
        const updates = { title: req.body.title, body: req.body.body };
        if (req.body.sections !== undefined) {
            const sections = JSON.parse(req.body.sections);
            updates.sections = sections.map((section, order) => ({ title: section.title, body: section.body, order }));
        }
        if (file) {
            updates.pdf_file = file.path;
            updates.media_type = file.mimetype;
            updates.media_name = file.originalname;
        }

        const content = await LearningContent.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!content) return res.status(404).json({ error: 'Content not found.' });
        res.json({
            id: content._id,
            title: content.title,
            body: content.body,
            sections: content.sections,
            pdf_file: contentAttachment(content).url,
            media_type: content.media_type,
            media_name: content.media_name
        });
    } catch (err) {
        console.error('Unable to update content:', err.message);
        res.status(400).json({ error: 'Unable to update content. Check the title, text, and attachment.' });
    }
});

// Delete a subject and all its contents (Protected)
router.delete('/subjects/:id', auth, async (req, res) => {
    try {
        await LearningContent.deleteMany({ subject: req.params.id });
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject and contents deleted successfully' });
    } catch (err) {
        console.error('Unable to delete subject:', err.message);
        res.status(500).json({ error: 'Unable to delete subject right now.' });
    }
});

// Delete specific learning content (Protected)
router.delete('/contents/:id', auth, async (req, res) => {
    try {
        await LearningContent.findByIdAndDelete(req.params.id);
        res.json({ message: 'Content deleted successfully' });
    } catch (err) {
        console.error('Unable to delete content:', err.message);
        res.status(500).json({ error: 'Unable to delete content right now.' });
    }
});

module.exports = router;
