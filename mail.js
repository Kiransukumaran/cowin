const mail = require('nodemailer');

let transporter = mail.createTransport({
    "service": "Gmail",
    "auth": {
        "user": "prathidhwanijp@gmail.com",
        "pass": "Pr@thidhwaniJP"
    }
});

module.exports = transporter;
