require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//POST /v1/todos
app.post('/v1/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET /v1/todos
app.get('/v1/todos', authenticate, (req, res) => {
    Todo.find({
      _creator: req.user._id
    }).then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});
//GET /v1/todos/:id
app.get('/v1/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    Todo.findOne({
      _id: id,
      _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }
        res.send({
            todo
        })
    }).catch((e) => console.log(e));
});

//DELETE TODO BY ID
app.delete('/v1/todos/:id',authenticate, (req, res) => {
    //get the id
    var id = req.params.id;
    //valid id using isValid

    //remove todo by id

    Todo.findOneAndRemove({
      _id: id,
    _creator: req.user._id
  }).then((todo) => {
        //success
        if (!todo) {
            //if no doc, send 404
            return res.status(404).send()
        }
        //if doc, send doc with 200
        res.send({
            todo
        })
    }).catch((e) => res.status(400).send()); //400 with empty body
});

//UPDATE TODO BY ID
app.patch('/v1/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id:id, _creator:req.user._id}, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    })
});

//POST /v1/users
app.post('/v1/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send();
    });
});
//POST /v1/users/login
app.post('/v1/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user)=>{
      return user.generateAuthToken().then((token)=>{
        res.header('x-auth', token).send(user);
      })
    }).catch((e)=>{
      res.status(400).send();
    });
});
//PRIVATE ROUTES

app.get('/v1/users/me', authenticate, (req, res) => {
    res.send(req.user);
});
app.delete('/v1/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(()=>{
      res.status(200).send();
    }, ()=>{
      res.status(400).send();
    })
});
app.listen(port, () => {
    console.log(`Started on Port ${port}`)
});
module.exports = {
    app
};
