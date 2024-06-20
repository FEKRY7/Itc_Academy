"use strict"

const nodemailer = require('nodemailer')

const sendEmail =async ({to , subject , html , attachments = []})=>{


const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 465,
  service:'gmail',
  secure: true,
  tls:{
    rejectUnauthorized:false
  },
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: " 👻<E-commerce WebSite>", // sender address
    to, // list of receivers
    subject, // Subject line
    html, // plain text body
    attachments,
  });

  console.log("Email is sent");
  if (info.accepted.length > 0)  return true ;
  return false
}

module.exports = sendEmail