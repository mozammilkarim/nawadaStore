const nodeMailer = require("nodemailer")

const sendEmail = async (options) => {
    // sender details
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: process.env.SMTP_SERVICE,//mailing service
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })
    // email details
    console.log("error occurs here2", options.message)
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        // error here
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    console.log("error occurs here3")
    // wait for the transporter to send email 
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail