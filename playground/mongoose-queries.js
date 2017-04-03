const {ObjectID} = require('mongodb');
var {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
var id = '58e2876d61a79740dbb4bc94'
if (!ObjectID.isValid(id)){
  console.log('Id not valid');
}

// Todo.find().then((todos)=>{
//   console.log('mongoose find() query with no args passed. returns all', todos)
// }) //gets all sends back an array of objects.
// Todo.find({
//   _id: id
// }).then((todos)=>{
//     console.log('Todos mongoose find() query with params.', todos);
// });//Sends back an Array with an object.
//
// Todo.findOne({
//   _id: id
// }).then((todo)=>{
//   if(!todo){
//     return console.log('todo not found.')
//   }
//   console.log('Todo mongoose findOne() query', todo);
// });//sends back an object--better for just one record

// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log('Id not found.')
//   }
//   console.log('mongoose findById',todo)
// }).catch((e)=>console.log(e));

User.findById(id).then((user)=>{
  if(!user){
    return console.log('User not found.')
  }
  console.log(JSON.stringify(user, undefined, 2))
}).catch((e)=>console.log(e));
