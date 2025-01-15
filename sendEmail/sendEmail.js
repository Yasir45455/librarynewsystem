const nodemailer = require('nodemailer');
const authServices = require("../services/authService")
const bookService = require('../services/bookService');
const userRepository = require('../repositories/userRepository');
const bookRepository = require('../repositories/bookRepository');
const AdminBook = require('../models/AdminBooks');
const Admin = require('../models/adminModel');
const dotenv = require('dotenv');
const BorrowRequest = require('../models/BorrowRequest');
const notificationRepository = require('../repositories/notificationRepository');

dotenv.config();

// Register a new user
const sendConfirmationEmail = async (email, username, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD,
        },
    });

    // const verificationLink = `http://localhost:3000/user/api/verify-email?token=${verificationToken}`;
    const verificationLink = `http://138.68.154.74:3004/user/api/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: 'Email Verification',
        text: `Hello ${username},\n\nPlease verify your email by clicking the link below:\n\n${verificationLink}\n\nThank you!`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};



// Borrow Request Email Send
const SendEmailBorrowRequest = async (userId, bookId, LibrarianId) => {
    try {
        // Retrieve user details
        const user = await userRepository.findUserById(userId);
        let Librarian = await userRepository.findUserById(LibrarianId);

        if (!Librarian) {
            Librarian = await Admin.findById(LibrarianId);
        }

        if (!Librarian) {
            console.log("Librarian not found (404)");
            return;
        }

        if (!user) {
            console.log("User not found (404)");
            return;
        }

        const { email: userEmail, username } = user; // Extract user's email and username
        const { email: librarianEmail } = Librarian; // Extract librarian's email

        // Retrieve book details
        let book = await bookRepository.getBookById(bookId);
        if (!book) {
            book = await AdminBook.findById(bookId); // Fallback to another repository
        }

        if (!book) {
            console.log("Book not found (404)");
            return;
        }

        const bookDetails = `
        Book Details:
        - Name: ${book.name}
        - ISBN: ${book.isbn}
        - Author: ${book.author}
        - Category: ${book.category}
        - Generation: ${book.generation}
        - Language: ${book.language}
        - Publisher: ${book.publisher}
        - Number of Pages: ${book.noOfPages}
        - Publish Year: ${book.publishYear}
        `;

        // Email content
        const userEmailText = `Dear ${username},\n\nYou have requested the following book:\n\n${bookDetails}\n\nPlease visit our library to proceed with the borrowing process.\n\nThank you!`;

        const librarianEmailText = `Dear Librarian,\n\nThe following book has been requested by the user ${username} (${userEmail}):\n\n${bookDetails}\n\nPlease ensure the process is completed smoothly.\n\nThank you!`;

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your preferred email service
            auth: {
                user: process.env.USER_EMAIL, // Your email
                pass: process.env.USER_PASSWORD, // Your app-specific password
            },
        });

        // Email options for user
        const userMailOptions = {
            from: process.env.USER_EMAIL, // Sender's email
            to: userEmail, // Receiver's email
            subject: 'Book Borrow Request Confirmation',
            text: userEmailText,
        };

        // Email options for librarian
        const librarianMailOptions = {
            from: process.env.USER_EMAIL, // Sender's email
            to: librarianEmail, // Receiver's email
            subject: 'Book Borrow Request Notification',
            text: librarianEmailText,
        };

        // Send emails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(librarianMailOptions);

        console.log("Emails sent successfully!");

    } catch (error) {
        console.error("Error:", error);
    }
};

// Send Emails After Approval
const SendEmailOnApproveRequest = async (userId, bookId, LibrarianId, requestId) => {
    try {
        // Retrieve user details
        const user = await userRepository.findUserById(userId);
        let Librarian = await userRepository.findUserById(LibrarianId);
        const request = await BorrowRequest.findById(requestId);

        if (!request) {
            console.log("Librarian not found (404)");
            return;
        }
        console.log(request)
        if (!Librarian) {
            Librarian = await Admin.findById(LibrarianId);
        }

        if (!Librarian) {
            console.log("Librarian not found (404)");
            return;
        }

        if (!user) {
            console.log("User not found (404)");
            return;
        }

        const { email: userEmail, username } = user; // Extract user's email and username
        const { email: librarianEmail } = Librarian; // Extract librarian's email
        const { returnDate } = request; // Extract librarian's email
     
        // Retrieve book details
        let book = await bookRepository.getBookById(bookId);
        if (!book) {
            book = await AdminBook.findById(bookId); // Fallback to another repository
        }

        if (!book) {
            console.log("Book not found (404)");
            return;
        }

        const bookDetails = `
        <h3>Book Details:</h3>
        <ul>
            <li><strong>Name:</strong> ${book.name}</li>
            <li><strong>ISBN:</strong> ${book.isbn}</li>
            <li><strong>Author:</strong> ${book.author}</li>
            <li><strong>Category:</strong> ${book.category}</li>
            <li><strong>Generation:</strong> ${book.generation}</li>
            <li><strong>Language:</strong> ${book.language}</li>
            <li><strong>Publisher:</strong> ${book.publisher}</li>
            <li><strong>Number of Pages:</strong> ${book.noOfPages}</li>
            <li><strong>Publish Year:</strong> ${book.publishYear}</li>
        </ul>
        `;

        // Email content for user
        const userEmailText = `
        <p>Dear <strong>${username}</strong>,</p>
        <p>Your request has been approved for the following book:</p>
        ${bookDetails}
        <p>The Reutrn Data is :  <strong> ${returnDate} </strong></p>
        <p>Please visit our library for more books.</p>
        <p>Thank you!</p>
        `;

        // Email content for librarian
        const librarianEmailText = `
        <p>Dear Librarian,</p>
        <p>You have approved the request for the user <strong>${username}</strong> (${userEmail}):</p>
        ${bookDetails}
        <p>Please ensure the process is completed smoothly.</p>
        <p>Thank you!</p>
        `;

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your preferred email service
            auth: {
                user: process.env.USER_EMAIL, // Your email
                pass: process.env.USER_PASSWORD, // Your app-specific password
            },
        });

        // Email options for user
        const userMailOptions = {
            from: process.env.USER_EMAIL, // Sender's email
            to: userEmail, // Receiver's email
            subject: 'Book Borrow Request Approval Confirmation',
            html: userEmailText, // Send HTML formatted email
        };

        // Email options for librarian
        const librarianMailOptions = {
            from: process.env.USER_EMAIL, // Sender's email
            to: librarianEmail, // Receiver's email
            subject: 'Book Borrow Request Approval Notification',
            html: librarianEmailText, // Send HTML formatted email
        };

        // For Saving Notification
        const notificationData = {
            message: `You have Approved Request of ${username} for ${book.name}`,
            userId: LibrarianId,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        await notificationRepository.createNotification(notificationData);

        // Send emails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(librarianMailOptions);




    } catch (error) {
        console.error("Error:", error);
    }
};


// Send Emails After Rejection
const SendEmailOnRejectRequest = async (userId, bookId, LibrarianId) => {
    try {
        // Retrieve user details
        const user = await userRepository.findUserById(userId);
        let Librarian = await userRepository.findUserById(LibrarianId);

        if (!Librarian) {
            Librarian = await Admin.findById(LibrarianId);
        }

        if (!Librarian) {
            console.log("Librarian not found (404)");
            return;
        }

        if (!user) {
            console.log("User not found (404)");
            return;
        }

        const { email: userEmail, username } = user; // Extract user's email and username
        const { email: librarianEmail } = Librarian; // Extract librarian's email

        // Retrieve book details
        let book = await bookRepository.getBookById(bookId);
        if (!book) {
            book = await AdminBook.findById(bookId); // Fallback to another repository
        }

        if (!book) {
            console.log("Book not found (404)");
            return;
        }

        const bookDetails = `
        Book Details:
        - Name: ${book.name}
        - ISBN: ${book.isbn}
        - Author: ${book.author}
        - Category: ${book.category}
        - Generation: ${book.generation}
        - Language: ${book.language}
        - Publisher: ${book.publisher}
        - Number of Pages: ${book.noOfPages}
        - Publish Year: ${book.publishYear}
        `;

        // Email content
        const userEmailText = `Dear ${username},\n\nYour request has been Rejected for the following book:\n\n${bookDetails}\n\nPlease visit our library for more books.\n\nThank you!`;

        const librarianEmailText = `Dear Librarian,\n\nYou have Rejected the request for the user ${username} (${userEmail}):\n\n${bookDetails}\n\nPlease ensure the process is completed smoothly.\n\nThank you!`;

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your preferred email service
            auth: {
                user: process.env.USER_EMAIL, // Your email
                pass: process.env.USER_PASSWORD, // Your app-specific password
            },
        });

        // Email options for user
        const userMailOptions = {
            from: process.env.USER_EMAIL, // Sender's email
            to: userEmail, // Receiver's email
            subject: 'Book Borrow Request Rejection',
            text: userEmailText,
        };

        // Email options for librarian
        const librarianMailOptions = {
            from: process.env.USER_EMAIL, // Sender's email
            to: librarianEmail, // Receiver's email
            subject: 'Book Borrow Request Reject Notification',
            text: librarianEmailText,
        };
        // Notifications Save
        const notificationData = {
            message: `You have Rjected Request of ${username} for ${book.name}`,
            userId: LibrarianId,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        await notificationRepository.createNotification(notificationData);
        // Send emails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(librarianMailOptions);

    } catch (error) {
        console.error("Error:", error);
    }
};

const SendEmailOnReturnedRequest = async (userId, bookId, LibrarianId, requestId) => {
    try {
        // Retrieve user details
        const user = await userRepository.findUserById(userId);
        let Librarian = await userRepository.findUserById(LibrarianId);
        const request = await BorrowRequest.findById(requestId);

        if (!request) {
            console.log("Request not found (404)");
            return;
        }
        if (!Librarian) {
            Librarian = await Admin.findById(LibrarianId);
        }

        if (!Librarian) {
            console.log("Librarian not found (404)");
            return;
        }

        if (!user) {
            console.log("User not found (404)");
            return;
        }

        const { email: userEmail, username } = user; // Extract user's email and username
        const { email: librarianEmail } = Librarian; // Extract librarian's email
        const { returnDate, returnedDate } = request; // Extract librarian's email
        // Retrieve book details
        let book = await bookRepository.getBookById(bookId);
        if (!book) {
            book = await AdminBook.findById(bookId); // Fallback to another repository
        }

        if (!book) {
            console.log("Book not found (404)");
            return;
        }

        const bookDetails = `
        <h3>Book Details:</h3>
        <ul>
            <li><strong>Name:</strong> ${book.name}</li>
            <li><strong>ISBN:</strong> ${book.isbn}</li>
            <li><strong>Author:</strong> ${book.author}</li>
            <li><strong>Category:</strong> ${book.category}</li>
            <li><strong>Generation:</strong> ${book.generation}</li>
            <li><strong>Language:</strong> ${book.language}</li>
            <li><strong>Publisher:</strong> ${book.publisher}</li>
            <li><strong>Number of Pages:</strong> ${book.noOfPages}</li>
            <li><strong>Publish Year:</strong> ${book.publishYear}</li>
        </ul>
        `;

        // Email content for user
        const userEmailText = `
        <p>Dear <strong>${username}</strong>,</p>
        <p>You have Returned the following book:</p>
        ${bookDetails}
        <p>The Expected Reutrn Data was :  <strong> ${returnDate} </strong></p>
        <p>You Returned on Date :  <strong> ${returnedDate} </strong></p>
        <p>Please visit our library for more books.</p>
        <p>Thank you!</p>
        `;

        // Email content for librarian
        const librarianEmailText = `
        <p>Dear Librarian,</p>
        <p>You have approved the request for the user <strong>${username}</strong> (${userEmail}):</p>
        ${bookDetails}
        <p>Please ensure the process is completed smoothly.</p>
        <p>Thank you!</p>
        `;

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your preferred email service
            auth: {
                user: process.env.USER_EMAIL, // Your email
                pass: process.env.USER_PASSWORD, // Your app-specific password
            },
        });

        // Email options for user
        const userMailOptions = {
            from: process.env.USER_EMAIL, // Sender's email
            to: userEmail, // Receiver's email
            subject: 'Book Returned Confirmation',
            html: userEmailText, // Send HTML formatted email
        };

        // Email options for librarian
        const librarianMailOptions = {
            from: process.env.USER_EMAIL, // Sender's email
            to: librarianEmail, // Receiver's email
            subject: 'Book Returned Notification',
            html: librarianEmailText, // Send HTML formatted email
        };
        // Notifications Save
        const notificationData = {
            message: `The ${book.name} has been successfully returned by ${username}`,
            userId: LibrarianId,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        await notificationRepository.createNotification(notificationData);
        // Send emails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(librarianMailOptions);

    } catch (error) {
        console.error("Error:", error);
    }
};


module.exports = {
    sendConfirmationEmail,
    SendEmailBorrowRequest,
    SendEmailOnApproveRequest,
    SendEmailOnRejectRequest,
    SendEmailOnReturnedRequest
}