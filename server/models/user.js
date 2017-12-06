const mongoose = require('mongoose');
// User
// email -require it - trim it - set type - min length of 1
const User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

module.exports = {User};
