const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
require('dotenv').config(); // Good to keep this if using .env


exports.sendEmailConfirmation = functions.database.ref('/users/{uid}/email').onCreate((snapshot, context) => {
    const email = snapshot.val();

    if(!email) {
        console.log('No email found in snapshot');
        return null;
    }

    // Initialize Mailgun INSIDE the function
    const mailTransport = nodemailer.createTransport(mg({
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      }
    }));

    const mailOptions = {
        from: 'notify@virginiacourtdata.org',
        to: 'info@virginiacourtdata.org',
        subject: 'New User',
        text: email + ' is requesting access to the full data set'
    };

    return mailTransport.sendMail(mailOptions)
        .then(() => {
            console.log('New user notification sent for ', email);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
});