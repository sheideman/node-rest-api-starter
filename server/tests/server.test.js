const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /v1/todos', () =>{
  it('should create a new todo', (done)=>{
    var text = 'Test todo text'

    request(app)
      .post('/v1/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res)=>{

        expect(res.body.text).toBe(text);
      })
      .end((err, res)=>{
        if(err){
        return  done(err);
      }
      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=> done(e));
    });
  });

  it('should not create todo with invalid body data', (done)=>{
    request(app)
      .post('/v1/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res)=>{
        if(err){
        return  done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(3);
        done();
      }).catch((e)=> done(e));
    });
  });
});

describe('GET /v1/todos',()=>{
  it('should get all todos', (done)=>{
    request(app)
    .get('/v1/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /v1/todos/:id',()=>{
  it('should return todo doc', (done)=>{
    request(app)
    .get(`/v1/todos/${todos[0]._id.toHexString()}`)
   .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done);
  });
  it('should return 404 if todo not found',(done)=>{
    var hexId = new ObjectID().toHexString();
    request(app)
    .get(`/v1/todos/${hexId}}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
  it('should return 404 for non-object ids', (done)=>{
    request(app)
    .get('/v1/todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  })
  it('should not return todo doc created by other user', (done)=>{
    request(app)
    .get(`/v1/todos/${todos[0]._id.toHexString()}`)
   .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

});
describe('DELETE /v1/todos/:id',()=>{
  it('should remove a todo', (done)=>{
  var hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/v1/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(hexId)
    })
    .end((err, res)=>{
      if(err) {
        return done(err);
      }
      Todo.findById(hexId).then((todo)=>{
        expect(todo).toNotExist()
        done();
      }).catch((e)=> done(e));
    });
  });
  it('should return 404 if todo not found',(done)=>{
    var hexId = new ObjectID().toHexString();
    request(app)
    .get(`/v1/todos/${hexId}}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });
  it('should return 404 for non-object ids', (done)=>{
    request(app)
    .get('/v1/todos/123')
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  })
  it('should not remove a todo', (done)=>{
  var hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/v1/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end((err, res)=>{
      if(err) {
        return done(err);
      }
      Todo.findById(hexId).then((todo)=>{
        expect(todo).toExist()
        done();
      }).catch((e)=> done(e));
    });
  });
});
describe('PATCH /v1/todos/:id',()=>{

  it('should update a todo', (done)=>{
  var hexId = todos[0]._id.toHexString();
  var text =  'Testing PATCH route /v1/todos/:id';
    request(app)
    .patch(`/v1/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      text,
      completed:true
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done);
  });
  it('should no5 update a todo', (done)=>{
  var hexId = todos[0]._id.toHexString();
  var text =  'Testing PATCH route /v1/todos/:id';
    request(app)
    .patch(`/v1/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      text,
      completed:true
    })
    .expect(404)

    .end(done);
  });
  it('should clear completedAt when todo is not completed',(done)=>{
    var hexId = todos[2]._id.toHexString();
    var text =  'Upating PATCH route /v1/todos/:id!!!';
      request(app)
      .patch(`/v1/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed:false
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});
describe('GET /v1/users/me',()=>{
  it('should require user to be authenticated', (done)=>{
    request(app)
    .get('/v1/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect (res.body.email).toBe(users[0].email);
    })
    .end(done);
  });
  it('should return a 401 if not authenticated', (done)=>{
    request(app)
    .get('/v1/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  })
});
describe('POST /v1/users', () =>{
  var email = 'testingemail@testing.com';
  var password = 'testingUserPassword123!';
  it('should create a new user', (done)=>{

    request(app)
      .post('/v1/users')
      .send({email,password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect (res.body._id).toExist();
        expect (res.body.email).toBe(email);
      })
      .end((err, res)=>{
        if(err){
        return  done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).toExist();
        expect(user.password).toNotBe(password)
        done();
      });
    });
  });
  it('should return a validation error if request invalid',(done)=>{
  request(app)
  .post('/v1/users')
  .send({email: 'and',password:'123'})
  .expect(400);
  done();
  });
  it('should not create a user if email is in use',(done)=>{
    request(app)
    .post('/v1/users')
    .send({email: users[0].email, password:'123abc12234l'})
    .expect(400);
   done();
  });
});
describe('POST /v1/users/login', () =>{
  it('should login user and return auth token',(done)=>{
    request(app)
    .post('/v1/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist();
    })
    .end((err, res)=> {
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens[1]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e)=>done(e))
    });
  });
  it('should reject invalid login',(done)=>{
    request(app)
    .post('/v1/users/login')
    .send({
      email: users[1].email,
      password: users[1].password+'1'
    })
    .expect(400)
    .expect((res)=>{
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err, res)=> {
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e)=>done(e));
    });
  })
});
describe('DELETE /v1/users/me/token', () =>{
  it('should remove auth token on logout', (done)=>{
    request(app)
    .delete('/v1/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res)=> {
      if(err){
        return done(err);
      }
    User.findById(users[0]._id).then((user)=>{
      expect(user.tokens.length).toBe(0);
      done();
    }).catch((e)=>done(e));
    })
  })
});
