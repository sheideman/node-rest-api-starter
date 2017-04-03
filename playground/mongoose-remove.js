const {ObjectID} = require('mongodb');
var {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
var id = '58e2876d61a79740dbb4bc94'
if (!ObjectID.isValid(id)){
  console.log('Id not valid');
}
// Todo.remove({}).then((result)=>{
//   console.log(result);
// })//no records returned back.
//
// Todo.findOneAndRemove({}).then(()=>{
//
// })//returns record back for use or recovery. query by more than id if needed.

Todo.findByIdAndRemove('58e2b49b27b5694a1224953f').then((todo)=>{
  console.log(todo);
});//returns record back. query by id only
