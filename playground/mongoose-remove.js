const { ObjectID } = require("mongodb");
const { mongoose } = require("../server/db/mongoose");
const { Todo } = require("../server/models/todo");
const { User } = require("../server/models/user");

// Todo.remove({})
// ================
// Todo.remove({})
//   .then((result) => {
//     console.log(result);
//   });

// Todo.findOneAndRemove()
// =========================
Todo.findOneAndRemove({
  _id: "5a2df2064f000b0d5fa4dc6f"
})
  .then((todo) => {
    console.log(todo);
  });

// Todo.findByIdAndRemove()
// =========================
// Todo.findByIdAndRemove("5a2df2064f000b0d5fa4dc6f")
//   .then(todo => {
//     console.log(todo);
//   });
