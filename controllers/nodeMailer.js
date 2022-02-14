const nodemailer = require("nodemailer");

var email;
var otp = Math.floor(1000 + Math.random() * 9000);
otp = parseInt(otp);

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PWD,
  },
});

Mailer = async (email) => {
  var mailOptions = {
    to: email,
    subject: "Otp for sign up manager",
    html:
      "<h3>OTP for account verification is </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otp +
      "</h1>",
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    } else {
      return true;
    }
  });
  return otp;
};

inviteMail = async (token, email) => {
  var mailOptions = {
    to: email,
    subject: "Invitation to project",
    html:
      '<p>Click <a href="http://localhost:3000/invite/'+
      token +
      '">here</a> to join to project</p>',
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error);
    } else {
      return true;
    }
  });
};

module.exports = { Mailer, inviteMail };
