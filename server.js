require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sendMail = require('./utils/sendMail');
const connectDB = require('./lib/db');
const User = require('./models/User');
const Query = require('./models/Query');

const app = express();
const templatePath = path.join(__dirname, 'templates/registrationEmail.html');

const DRIVE_LINK =
  'https://drive.google.com/file/d/1P-BhX7OMTeTkTJ7fMZJiJMk-E8E_UzT5/view?usp=sharing';

const WHATSAPP_LINK =
  'https://chat.whatsapp.com/IuiKpXX7IkwGE8Aq2RATHw';
/* =====================
   Middleware
===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   Static & Views
===================== */
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



/* =====================
   Routes
===================== */

// Home
app.get('/', (req, res) => {
  res.render('index');
});


// Signup page
app.get('/signup', (req, res) => {
  res.render('signiup_land', {
    fullName: '',
    email: '',
    phoneNumber: '',
    institute: '',
    degree: '',
    expectations: '',
    error: null,
    success: null
  });
});


// Signup submit
// app.post('/signup', async (req, res) => {
//   const {
//     email,
//     fullName,
//     phoneNumber,
//     institute,
//     degree,
//     expectations
//   } = req.body;

//   try {
//     // 🔒 Required field check
//     if (!email || !fullName || !phoneNumber || !institute || !degree) {
//       return res.render('signiup_land', {
//         error: 'Please fill all required fields.',
//         success: null,
//         ...req.body
//       });
//     }

//     // 🔁 Duplicate check
//     const existingUser = await User.findOne({
//       $or: [{ email }, { phoneNumber }]
//     });

//     if (existingUser) {
//       return res.render('signiup_land', {
//         error:
//           existingUser.email === email
//             ? 'Email already registered.'
//             : 'Phone number already registered.',
//         success: null,
//         ...req.body
//       });
//     }

//     // 💾 Save user
//     await new User({
//       email,
//       fullName,
//       phoneNumber,
//       institute,
//       degree,
//       expectations
//     }).save();

//     // ✅ Success response (clear form)
//     res.render('signiup_land', {
//       error: null,
//       success: 'Registered successfully! Check your email for details.',
//       fullName: '',
//       email: '',
//       phoneNumber: '',
//       institute: '',
//       degree: '',
//       expectations: ''
//     });

//   } catch (err) {
//     console.error(err);
//     res.render('signiup_land', {
//       error: 'Something went wrong. Please try again.',
//       success: null,
//       ...req.body
//     });
//   }
// });

// app.post('/signup', async (req, res) => {
//   const {
//     email,
//     fullName,
//     phoneNumber,
//     institute,
//     degree,
//     expectations
//   } = req.body;

//   try {
//     // 🔒 Required field check
//     if (!email || !fullName || !phoneNumber || !institute || !degree) {
//       return res.render('signiup_land', {
//         error: 'Please fill all required fields.',
//         success: null,
//         ...req.body
//       });
//     }

//     // 🔁 Duplicate check
//     const existingUser = await User.findOne({
//       $or: [{ email }, { phoneNumber }]
//     });

//     if (existingUser) {
//       return res.render('signiup_land', {
//         error:
//           existingUser.email === email
//             ? 'Email already registered.'
//             : 'Phone number already registered.',
//         success: null,
//         ...req.body
//       });
//     }

//     // 💾 Save user
//     await new User({
//       email,
//       fullName,
//       phoneNumber,
//       institute,
//       degree,
//       expectations
//     }).save();

//     // 📧 SEND CONFIRMATION EMAIL (Gmail API)



//     // ✅ Success response (clear form)
//     res.render('signiup_land', {
//       error: null,
//       success: 'Registered successfully!',
//       fullName: '',
//       email: '',
//       phoneNumber: '',
//       institute: '',
//       degree: '',
//       expectations: ''
//     });
// //     await sendMail(
// //   email,
// //   ' SynBioCon 2026 Registration Successful',
// //   `
// //     <h2>Hello ${fullName},</h2>

// //     <p>✅ Your registration for <b>SynBioCon 2026</b> has been successfully confirmed.</p>

// //     <p> The conference will be held on <b>7–8 March 2026</b>.</p>

// //     <p><strong>Details you submitted:</strong></p>
// //     <ul>
// //       <li><b>Institute:</b> ${institute}</li>
// //       <li><b>Degree:</b> ${degree}</li>
// //       <li><b>Phone:</b> ${phoneNumber}</li>
// //     </ul>

// //     <p>
// //       📢 Updates will be shared via <b>email</b> and the official
// //       <b>WhatsApp group</b>.
// //     </p>

// //     <p>
// //       👉 Please join the WhatsApp group:<br/>
// //       <a href="https://chat.whatsapp.com/IuiKpXX7IkwGE8Aq2RATHw">Join WhatsApp Group</a>
// //     </p>

// //     <p>
// //       The <b>detailed conference schedule</b> is attached with this email
// //       as a PDF.
// //     </p>

// //     <br/>
// //     <p>
// //       Regards,<br/>
// //       <b>SynBioCon Organizing Team</b>
// //     </p>
// //   `,
// //   path.join(__dirname, 'assets', 'SynBioCon_2026_Schedule.pdf')
// // );
//   } catch (err) {
//     console.error(err);

//     res.render('signiup_land', {
//       error: 'Something went wrong. Please try again.',
//       success: null,
//       ...req.body
//     });
//   }
// });

app.post('/signup', async (req, res) => {
  await connectDB();
  const {
    email,
    fullName,
    phoneNumber,
    institute,
    degree,
    expectations
  } = req.body;

  try {
    // 🔒 Required field check
    if (!email || !fullName || !phoneNumber || !institute || !degree) {
      return res.render('signiup_land', {
        error: 'Please fill all required fields.',
        success: null,
        ...req.body
      });
    }

    // 🔁 Duplicate check
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return res.render('signiup_land', {
        error:
          existingUser.email === email
            ? 'Email already registered.'
            : 'Phone number already registered.',
        success: null,
        ...req.body
      });
    }

    // 💾 Save user
    await new User({
      email,
      fullName,
      phoneNumber,
      institute,
      degree,
      expectations
    }).save();

    // ✅ Respond immediately (NO waiting for email)
    res.render('signiup_land', {
      error: null,
      success: 'Registered successfully! Please join the whatsapp group for updates.',
      fullName: '',
      email: '',
      phoneNumber: '',
      institute: '',
      degree: '',
      expectations: ''
    });

//    setImmediate(async () => {
//   try {
//     let html = fs.readFileSync(templatePath, 'utf8');

//     html = html
//       .replace('{{FULL_NAME}}', fullName)
//       .replace('{{INSTITUTE}}', institute)
//       .replace('{{DEGREE}}', degree)
//       .replace('{{PHONE}}', phoneNumber)
//       .replace('{{DRIVE_LINK}}', DRIVE_LINK)
//       .replace('{{WHATSAPP_LINK}}', WHATSAPP_LINK);

//     await sendMail(
//       email,
//       'SynBioCon 2026 Registration Successful',
//       html
//     );

//   } catch (err) {
//     console.error('Email failed:', err.message);
//   }
// });
const html = fs.readFileSync(templatePath, 'utf8');

try {
  await sendMail(
    email,
    'SynBioCon 2026 Registration Successful',
    html
  );
} catch (err) {
  console.error('Email failed:', err.message);
}


  } catch (err) {
    console.error(err);
    res.render('signiup_land', {
      error: 'Something went wrong. Please try again.',
      success: null,
      ...req.body
    });
  }
});

// Query form
app.post('/query', async (req, res) => {
  try {
    await connectDB();
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.json({ success: false, message: 'All fields are required.' });
    }

    await new Query({ name, email, subject, message }).save();
    res.json({ success: true, message: 'Form submitted successfully!' });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Submission failed.' });
  }
});
//mailer test route


// app.get('/test-mail', async (req, res) => {
//   try {
//     await sendMail(
//       process.env.GMAIL_USER,
//       'FINALLY WORKS 🎉',
//       '<h2>This email was sent using Gmail API (no SMTP)</h2>'
//     );

//     res.send('Email sent ✅ Check inbox');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send(err.message);
//   }
// });



/* =====================
   Error Handling
===================== */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
// console.log("GMAIL_USER:", process.env.GMAIL_USER);
// console.log("GMAIL_APP_PASS:", process.env.GMAIL_APP_PASS ? "LOADED ✅" : "MISSING ❌");
// console.log('REFRESH TOKEN:', process.env.GMAIL_REFRESH_TOKEN ? 'LOADED ✅' : 'MISSING ❌');

/* =====================
   Local Development Only
===================== */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
