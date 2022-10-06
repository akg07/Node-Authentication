//  This Config is written by Aayush Kumar Gupta


// NodeMailer is being used for send mail to user

// get an instance of nodemailer
const nodemailer = require('nodemailer');
const ejs = require('ejs'); // get an instance of ejs -> for Detailed Mail
const path = require('path'); // get path of the file and folder regardless of the System or OS

// Transporter : The GUY who delivers the mail
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'ayush3032@gmail.com',
        pass: 'bozvmjiiabvniqmw'
    }
});

// Template : The mail template
let renderTemplate = (data, relativePath) => {
    let mailHTML;

    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template) {
            if(err) {console.log('err: nodemailer config: ', err); return;}

            mailHTML = template;
        }
    )

    return mailHTML;
}

// export current module
module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}