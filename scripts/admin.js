const jwt = require('jsonwebtoken');
const secret = 'hello123'; // store this securely

const token = jwt.sign(
  { role: 'admin' },
  secret,
  { expiresIn: '40m' } // valid for 40 minutes
);

console.log("Secure access link:");
console.log(`https://quizzicles-contest.onrender.com/login?token=${token}`);
console.log(`http://localhost:3000/login?token=${token}`);