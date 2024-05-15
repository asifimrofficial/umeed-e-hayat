const nodemailer = require('nodemailer');


// Configure nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with the email service you are using (e.g., Gmail, Outlook, etc.)
  auth: {
    user: 'umeed.e.hayat@gmail.com', // Replace with your email address
    pass: 'johwbfhhdjqquult', // Replace with your email password or an app-specific password if using Gmail
  },
});
module.exports = transporter;