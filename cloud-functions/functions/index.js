const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const sendgridUser = process.env.SENDGRID_USERNAME;
const sendgridPass = process.env.SENDGRID_PASSWORD;

const mailTransport = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: sendgridUser,
    pass: sendgridPass
  }
});

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailConfirmation = functions.database.ref('/users/{uid}/email').onCreate((snapshot, context) => {
    const email = snapshot.val();

    if(!email) return;

    const mailOptions = {
        from: 'notify@virginiacourtdata.org',
        to: 'info@virginiacourtdata.org',
        subject: 'New User',
        text: email + ' is requesting access to the full data set'
    };
    return mailTransport.sendMail(mailOptions).then(() => {
        console.log('New user notification sent for ', email);
    });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
