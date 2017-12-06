const {ObjectID} = require("mongodb");
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');

const {User} = require('../server/models/user');

// let id = "5a278fec05a2d353385b3957";

// if(! ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }
// Todo.find({_id : id})
//   .then((todos) => {
//     console.log('Todos', todos);
//   });

// Todo.findOne({_id:id})
//   .then((todo) => {
//     console.log('Todo', todo);
//   });

// Todo.findById(id) // findById(id)
//   .then(todo => {
//     if(!todo) {
//       return console.log('ID not found');
//     }
//     console.log("Todo by ID", todo);
//   })
//   .catch((e) => console.log(e));

// User
User.findById("5a1e556de765c31a87ae4324")
  .then((user) => {
    if(!user) {
      return console.log('Unable to find user');
    }
    console.log(JSON.stringify(user, undefined, 2));
  })
  .catch((e) => {
    console.log(e);
  });
