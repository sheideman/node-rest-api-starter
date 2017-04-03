const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  text: 'First test todo'
},{
  text: 'Second test todo'
},{
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
