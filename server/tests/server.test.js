const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},{
  _id: new ObjectID(),
  text: 'Second test todo'
},{
  _id: new ObjectID(),
  text: 'Third test todo'
}]
beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
});

describe('POST /v1/todos', () =>{
  it('should create a new todo', (done)=>{
    var text = 'Test todo text'

    request(app)
      .post('/v1/todos')
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
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(3);
    })
    .end(done);
  });
});

describe('GET /v1/todos/:id',()=>{
  it('should return todo doc', (done)=>{
    request(app)
    .get(`/v1/todos/${todos[0]._id.toHexString()}`)
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
    .expect(404)
    .end(done);
  });
  it('should return 404 for non-object ids', (done)=>{
    request(app)
    .get('/v1/todos/123')
    .expect(404)
    .end(done);
  })
});
describe('DELETE /v1/todos/:id',()=>{
  it('should remove a todo', (done)=>{
  var hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/v1/todos/${hexId}`)
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
    .expect(404)
    .end(done);
  });
  it('should return 404 for non-object ids', (done)=>{
    request(app)
    .get('/v1/todos/123')
    .expect(404)
    .end(done);
  })
});
