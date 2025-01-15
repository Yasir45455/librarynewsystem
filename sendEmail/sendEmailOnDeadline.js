const nodemailer = require('nodemailer');
const borrowService = require('../services/borrowService');
const bookRepository = require('../repositories/bookRepository');
const AdminbookRepository = require('../repositories/AdminbookRepository');

// Create a reusable nodemailer transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // or any other email service
        auth: {
            user: process.env.USER_EMAIL, // Your email address
            pass: process.env.USER_PASSWORD,
        },
    });
};

// Send email utility
const sendEmail = async (email, subject, text) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.USER_EMAIL, // Sender's address
        to: email, // Receiver's address
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email} with subject: "${subject}"`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
    }
};

// Process borrow requests and send reminders
async function logBorrowRequests() {
    try {
        const borrowRequests = await borrowService.getAllBorrowRequests();
        const todayDate = new Date().toISOString().split('T')[0];

        for (const request of borrowRequests) {
            if (request.status === 'approved') {
                const { returnDate, userId, bookId } = request;
                const email = userId?.email;
                // Skip if no email is associated with the user
                if (!email || !returnDate) continue;

                // Fetch book details
                const book =
                    (await bookRepository.getBookById(bookId)) ||
                    (await AdminbookRepository.getBookById(bookId)) ||
                    null;


                // Compose email text based on return date
                if (returnDate === todayDate) {
                    const emailText = `Dear Reader,\n\nPlease return the book "${book.name}" by ${book.author} by the end of the day (${returnDate}).\n\nThank you.`;
                    // await sendEmail(email, 'Book Return Date Reminder', emailText);
                } else if (returnDate < todayDate) {
                    const emailText = `Deadline is Passed! Please return the book as soon as possible. The Book Details: "${book.name}" by ${book.author}.`;
                    // await sendEmail(email, 'Book Return Date Passed', emailText);
                }
            }
        }
    } catch (error) {
        console.error('Error processing borrow requests:', error);
    }
}

// Set an interval for periodic reminders
const interval = 16 * 60 * 60 * 1000; // 16 hours
setInterval(logBorrowRequests, interval); // Uncomment to enable periodic execution
// logBorrowRequests(); // Execute once on startup
