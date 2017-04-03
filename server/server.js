require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//POST /v1/todos
app.post('/v1/todos', (req, res)=>{
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc)=>{
    res.send(doc);
  }, (e)=>{
    res.status(400).send(e);
  });
});

//GET /v1/todos
app.get('/v1/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (e)=>{
    res.status(400).send(e);
  });
});
//GET /v1/todos/:id
app.get('/v1/todos/:id',(req,res)=>{
  var id = req.params.id;
  //valid id using isValid
  if (!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send()
    }
    res.send({todo})
  }).catch((e)=>console.log(e));
});

//DELETE TODO BY ID
app.delete('/v1/todos/:id', (req, res)=>{
  //get the id
  var id = req.params.id;
  //valid id using isValid

  //remove todo by id

  Todo.findByIdAndRemove(id).then((todo)=>{
    //success
    if(!todo){
      //if no doc, send 404
      return res.status(404).send()
    }
    //if doc, send doc with 200
    res.send({todo})
  }).catch((e)=>res.status(400).send());//400 with empty body
});

//UPDATE TODO BY ID
app.patch('/v1/todos/:id',(req,res)=>{
  var id = req.params.id;
  var body = _.pick(req.body,['text', 'completed']);
  if (!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  if(_.isBoolean(body.completed)&& body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
});

app.listen(port,()=>{
  console.log(`Started on Port ${port}`)
});
module.exports = {app};
