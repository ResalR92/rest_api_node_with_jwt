const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require("mongodb");

const {app} = require('../server'); // server
const {Todo} = require('../models/todo');  // model
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed'); // seed

beforeEach(populateUsers);
beforeEach(populateTodos); // refactoring - seed/seed.js

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200) // status
      .expect((res) => {
        expect(res.body.text).toBe(text); // toBe
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find({text}) // make sure todos is saved
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch((e) => done(e));
      });
  });
  // Invalid data testing
  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token) // making todo private (authenticated user)
      .send({})
      // .expect(400) // invalid - bad request
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

// list resource
describe("GET /todos", () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});
// ObjectID
describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token) // making todo private (authenticated user)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  // new test for making route private (not authorize)
  it("should not return todo doc by other user", done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)// second todo _id
      .set("x-auth", users[0].tokens[0].token) // login as first user
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    // make sure you get a 404 back
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set("x-auth", users[0].tokens[0].token) // making todo private (authenticated user)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    // /todos/123
    request(app)
      .get("/todos/123abc")
      .set("x-auth", users[0].tokens[0].token) // making todo private (authenticated user)
      .expect(404)
      .end(done);
    });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token) // make user only CURRENT User delete their todos
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // query database using findById
        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toNotExist();
            done();
            // expect(null).toNotExist();
          })
          .catch(e => done(3));
      });
  });

  it("should not remove todo by other user", done => {
    let hexId = todos[0]._id.toHexString(); // try to delete FIRST todo

    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token) // try to delete FIRST todo as SECOND USER
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // query database using findById
        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toExist(); // should exit as unauthorited user try to delete someone else todo
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    // make sure you get a 404 back
    let hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if objectID is invalid', (done) => {
    // // /todos/123
    request(app)
      .delete("/todos/123abc")
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    // grab id of first item
    let hexId = todos[0]._id.toHexString();
    let text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        // update text, set completed true
        completed:true,
        text: text
      })
      // 200
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        // text is changed, completed is true, completedAt is a number .toBeA()
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it("should not update the todo by other user", done => {
    // grab id of first item
    let hexId = todos[0]._id.toHexString();
    let text = "This should be the new text";

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ // update text, set completed true
        completed: true, text: text })
      // 200
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    // grab id of second todo item
    let hexId = todos[1]._id.toHexString();
    let text = "This should be the new text!!!";

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ // update text, set completed to false
        completed: false, text: text })
      // 200
      .set("x-auth", users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        // text is changed, completed is false, completedAt is NULL .toNotExist()
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token) // for pass middleware - authenticated
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString()); // make sure _id is valid
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'example@example.com';
    let password = '123abcd';

    request(app)
      .post('/users')
      .send({
        email, password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }
        User.findOne({ email })
          .then(user => {
            expect(user).toExist();
            expect(user.password).toNotBe(password); // make sure password hashing working
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email:'and',
        password:'123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'test123'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens[1]).toInclude({ // making todo route private from 0 to 1 (array)
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post("/users/login")
      .send({ email: users[1].email, password: users[1].password+'yes' })
      .expect(400)
      .expect(res => {
        expect(res.headers["x-auth"]).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1); // making todo route private from 0 to 1 (array) - reality
            done();
          })
          .catch(e => done(e));
      });
  });
});


describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    // DELETE  /users/me/token

    request(app)
    .delete('/users/me/token')
    // Set x-auth equal to token
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    // 200
    .end((err, res) => {
      if(err) {
        return done(err);
      }

      User.findById(users[0]._id)
      .then((user) => {
        expect(user.tokens.length).toBe(0);
        // Find user, verify that tokens array has length of zero
            done();
          })
          .catch((e) => done(e));
      });
    });
});
