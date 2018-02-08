const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


let data = {
  id:10
};
// jwt.sign
// ==========
let token = jwt.sign(data, '123abc');
console.log(token);

// jwt.verify
// ===========
let decoded = jwt.verify(token, '123abc'); // decoded
console.log('decoded', decoded);

// let message = 'I am user number 3';
// let hash = SHA256(message).toString(); // result is object so we change into string

// console.log(`Message : ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
//   id: 4
// };
// let token = {
//   data:data,
//   hash:SHA256(JSON.stringify(data)+'somesecret').toString()
// }

// SALT - JWT Token
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();

// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }
