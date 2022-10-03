const nodemailer = require('../configs/nodemailer');


exports.resetPassword = (userWithAT) => {
    let htmlResetPassword = nodemailer.renderTemplate({userWithAT: userWithAT}, '/reset_password_temp.ejs');

    nodemailer.transporter.sendMail({
        from: 'ayush3032@gmail.com',
        to: userWithAT.user.email,
        subject: 'Reset Password ',
        html: htmlResetPassword
    }, (err, info) => {
        if(err) {console.log('error at mailer ', err); return; }

        console.log('Message Sent');

        return;

    })
}