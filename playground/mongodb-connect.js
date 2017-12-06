// const MongoClient = require('mongodb').MongoClient; // https://github.com/mongodb/node-mongodb-native

const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID(); // new instance of objectID
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { // db - read/write
  if(err) {
    return console.log('Unable to connect to MongoDB server.');
  }
  console.log('Connected to MongoDB server');

  // insert collection
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo', err);
  //   }

  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // Insert new doc into Users (name, age, location)

  // db.collection('Users').insertOne({
  //   name: 'Lewat Aja',
  //   age: 24,
  //   location: 'UNJ'
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp()); // result - 2017-11-28T14:57:09.000Z
  //                                                  // that was objectID created from
  // });

  // close connection
  db.close();
});
