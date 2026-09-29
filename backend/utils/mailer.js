const nodemailer = require('nodemailer');

async function sendMail({ to, subject, text, replyTo }) {
    const from = process.env.EMAIL_FROM || (process.env.NODE_ENV === 'production' ? null : process.env.SMTP_USER);
    if (!from) throw new Error('EMAIL_FROM is not configured.');

    if (process.env.RESEND_API_KEY) {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from, to: [to], subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) {
            const detail = await response.text();
            throw new Error(`Email provider rejected request (${response.status}): ${detail.slice(0, 300)}`);
        }
        return response.json();
    }

    // SMTP remains convenient for local development. Render free blocks SMTP egress.
    if (process.env.NODE_ENV === 'production') throw new Error('RESEND_API_KEY is required for production email.');
    const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    return transporter.sendMail({ from, to, subject, text, ...(replyTo ? { replyTo } : {}) });
}

module.exports = sendMail;
