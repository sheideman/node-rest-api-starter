var mongoose = require('mongoose');
var Todo = mongoose.model('Todo',{
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim:true,

  },
  completed:{
    type: Boolean,
    default: false
  },
  completedAt:{
    type: Number,
    default: null
  }
});
module.exports = {Todo}
// var newTodo = new Todo({
//   text: 'Remember the Milk'
// });
//
// newTodo.save().then((doc)=>{
//   console.log('saved todo: ', doc);
// },(e)=>{
//   console.log('Unable to save', e)
// });
