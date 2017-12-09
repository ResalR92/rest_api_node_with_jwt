const express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require("mongodb");
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;
// middleware bodyParser
app.use(bodyParser.json());

app.post('/todos', (req,res) => {
  // console.log(req.body);
  let todo = new Todo({
    text:req.body.text
  });

  todo.save()
    .then((doc) => {
      res.send(doc);
    })
    .catch((e) => {
      res.send(e);
    });
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({
        todos
      });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

// GET /todo/123123123
app.get('/todos/:id', (req,res) => {
  let id = req.params.id;

  // validate ID using isValid
  if(!ObjectID.isValid(id)) {
    // 404 - send back empty send
    return res.status(404).send();
  }
  // findById
  Todo.findById(id)
    .then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }
      // success
      res.send({todo});
    })
    // error
    .catch((e) => {
      // 400
      res.status(400).send();
    });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app}; // for testing