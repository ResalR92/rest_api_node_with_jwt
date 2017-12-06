const mongoose = require('mongoose');

const Todo = mongoose.model("Todo", {
  text: {
    type: String,
    required: true, // validator - required
    minlength: 1,
    trim: true // remove leading and trailing spaces
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {Todo};
