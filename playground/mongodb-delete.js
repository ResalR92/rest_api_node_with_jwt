const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  // deleteMany
  // db.collection('Todos').deleteMany({text:'Here some text'})
  //   .then((result) => {
  //     console.log(result);
    // });

  // deleteOne
  // db.collection('Todos').deleteOne({text:'Some text here'})
  //   .then((result) => {
  //     console.log(result);
  //   });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed:false})
  //   .then(result => {
  //     console.log(result);
  //   });

  // Users
  // db.collection('Users').deleteMany({name:'Lewat Aja'});
  db.collection("Users")
    .findOneAndDelete({ _id: new ObjectID("5a1d6928a68d611e8cbfa1b3") })
    .then(result => {
      console.log(JSON.stringify(result, undefined, 2));
    });

  // db.close();
});
