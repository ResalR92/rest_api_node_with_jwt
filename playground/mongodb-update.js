const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  // findOneAndDelete
  // db.collection("Todos")
  //   .findOneAndUpdate({
  //     _id: new ObjectID("5a1e24c8d53c8b7d2cd7fcdf"), // filter
  //     },
  //     {
  //       $set: { // set
  //         text:'Some text here'
  //       }
  //     },
  //     {
  //       returnOriginal: false
  //     }
  //   )
  //   .then(result => {
  //     console.log(result);
  //   });

  // challenge - User update
  db.collection("Users")
    .findOneAndUpdate({
      _id: new ObjectID("5a1d6872e650711e331d62b1")
    },
    {
      $set: {
        name:'Resal'
      },
      $inc: {// increment
        age:1
      }
    },
    {
      returnOriginal:false
    }
  )
  .then(result => {
    console.log(result);
  });

  // db.close();
});
