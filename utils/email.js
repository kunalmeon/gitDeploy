const nodemailer = require("nodemailer");

const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    (this.to = user.email),
      (this.firstName = user.name.split(" ")[0]),
      (this.url = url),
      (this.from = `Karan Budha Air <${process.env.EMAIL_FROM}>`);
  }

  Transporter() {
    if (process.env.NODE_EVN === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    console.log("code reached to send function");
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject: subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,

      text: htmlToText.fromString(html),
    };
    await this.Transporter().sendMail(mailOptions);
    console.log("Mail starting to sent");
  }

  async sendWelcome() {
    await this.send("welcome", "welcome to budhaair and sons.");
    
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "welcome to budhaair and sons.");
  }
};
