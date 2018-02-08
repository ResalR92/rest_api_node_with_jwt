const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

let password = '123abc';

// Hashing password
// =================
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

// compare hash to real password
// ===================
var hashedPassword = '$2a$10$LMqlBZ/vY2lnd6Em3bTYz.M15m5mDeB0Y1nAQftM902MD.jK3frES';
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
