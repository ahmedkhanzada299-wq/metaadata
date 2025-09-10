const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-mail', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send({ error: 'All fields are required!' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'khanhome7275@gmail.com', 
                pass: 'csmq qghk ikry dozf', 
            },
        });
        const mailOptions = {
            from: email, 
            to: 'mehmoodnadeemkhan@gmail.com', 
            subject: `Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to send email. Please try again later.' });
    }
});

module.exports = router; 
