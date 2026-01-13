// utils/sendMail.js
console.log('KEY VALUE:', process.env.SENDGRID_API_KEY);
console.log('KEY TYPE:', typeof process.env.SENDGRID_API_KEY);
console.log(
  'STARTS WITH SG:',
  process.env.SENDGRID_API_KEY?.startsWith('SG.')
);

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(to, subject, html) {
  const msg = {
    to,
    from: {
      email: 'contact@synbiocon2026.in',
      name: 'SynBioCon 2026'
    },
    subject,
    html
  };

  await sgMail.send(msg);
}

module.exports = sendMail;
