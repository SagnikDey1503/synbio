const jwt = require('jsonwebtoken');
const secret = 'hello123'; // store this securely

const token = jwt.sign(
  { role: 'admin' },
  secret,
  { expiresIn: '4m' } // valid for 10 minutes
);

console.log("Secure access link:");
console.log(`https://quizzicles-contest.onrender.com/login?token=${token}`);
