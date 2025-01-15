const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "yasirkh261@gmail.com",
    pass: "yasirkh261",
  },
});

// Email endpoint
router.post('/sendemail', async (req, res) => {
  const { email, username } = req.body;
console.log("SDFDASFASDFAFAFAF")
  if (!email || !username) {
    return res.status(400).json({ message: 'Email and username are required.' });
  }

  // Generate secure verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const mailOptions = {
    from: "yasirkh261@gmail.com",
    to: email,
    subject: 'Email Verification',
    html: `<p>Hi ${username},</p>
           <p>Please verify your email by clicking the link below:</p>
           <a href="http://localhost:3000/verify-email/${verificationToken}">Verify Email</a>`,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification email sent!', token: verificationToken });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
});


router.get('/verifyEmail/:token', async (req, res) => {
    const { token } = req.params;
    // Validate the token against the database
    // Update the user's verification status if valid
    res.status(200).json({ message: 'Email verified successfully!' });
  });
  

module.exports = router;
