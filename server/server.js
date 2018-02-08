require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require("mongodb");
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
// auth middleware
const {authenticate} = require('../server/middleware/authenticate');

const app = express();
const port = process.env.PORT; // no need to set default port
// middleware bodyParser
app.use(bodyParser.json());

app.post('/todos', authenticate, (req,res) => { // making todo private (authenticated user)
  // console.log(req.body);
  let todo = new Todo({
    text:req.body.text,
    _creator: req.user._id
  });

  todo.save()
    .then((doc) => {
      res.send(doc);
    })
    .catch((e) => {
      res.send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id })
    .then(todos => {
      res.send({ todos });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

// GET /todos/123123123
app.get('/todos/:id', authenticate, (req,res) => { // making todo private (authenticated user)
  let id = req.params.id;

  // validate ID using isValid
  if(!ObjectID.isValid(id)) {
    // 404 - send back empty send
    return res.status(404).send();
  }
  // findById
  // Todo.findById(id)
  Todo.findOne({
    _id:id,
    _creator: req.user._id
    }) // making todo private (authenticated user)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      // success
      res.send({ todo });
    })
    // error
    .catch(e => {
      // 400
      res.status(400).send();
    });
});

// DELETE /todos/1341234321
app.delete('/todos/:id', authenticate, (req, res) => { // making todo private (authenticated user)
  let id = req.params.id;

  // validate ID using isValid
  if (!ObjectID.isValid(id)) {
    // 404 - send back empty send
    return res.status(404).send();
  }

  // remove todo by id
  // Todo.findByIdAndRemove(id)
  Todo.findOneAndRemove({
      _id: id,
      _creator:req.user._id
    })
    .then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    })
    .catch((e) => res.status(400).send());
});

// PATCH /todos/1314312432
app.patch('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body,['text', 'completed']);

  // validate ID using isValid
  if (!ObjectID.isValid(id)) {
    // 404 - send back empty send
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime(); // getTime() return javascript date
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // Todo.findByIdAndUpdate(id,
  Todo.findOneAndUpdate({
        _id:id,
        _creator:req.user._id
      },
      {
        $set: body
      },
      {
        new: true // returnOriginal: false
      })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

// ==============
// POST /users
// ==============
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body); // object -> email, password

  user.save()
    .then((user) => {
      // res.send(user);
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth',token).send(user); // custom header - x-auth
    })
    .catch((e) => res.status(400).send());
});

app.get('/users/me', authenticate, (req, res) => { // middleware - authenticate
  res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req,res) => {
  let body = _.pick(req.body, ["email", "password"]);

  User.findByCredentials(body.email, body.password)
  .then((user) => {
      // res.send(user);
      user.generateAuthToken()
        .then((token) => {
          res.header('x-auth',token).send(user);
        });
    })
    .catch((e) => {
      res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch((e) => {
      res.status(400).send();
    })
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app}; // for testing
