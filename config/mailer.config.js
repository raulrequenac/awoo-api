const nodemailer = require('nodemailer');
const { PORT_ORIGIN } = require('../constants')

const APP_HOST = process.env.APP_HOST || PORT_ORIGIN

const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user,
    pass
  }
});

module.exports.sendValidateEmail = (targetUser) => {
  transporter.sendMail({
      from: `"Awoo" <${user}>`,
      to: targetUser.email,
      subject: 'Bienvenido a Awoo!',
      html: `
      <h1>Bienvenido</h1>
      <a href='${APP_HOST}/users/validate/${targetUser.validateToken}'>Confirm account</a>
    `
    })
    .then(info => console.log(info))
    .catch(error => console.log(error))
}