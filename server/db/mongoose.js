const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  // .connect("mongodb://resal:resal@ds135156.mlab.com:35156/rest-api-nodejss", {
  // .connect("mongodb://localhost:27017/TodoApp", {
  .connect(process.env.MONGODB_URI, {
    useMongoClient: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

  module.exports = {mongoose}
