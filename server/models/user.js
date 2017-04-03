const mongoose = require('mongoose');
const validator = require('validator');
var User = mongoose.model('User',{
  email:{
    type:String,
    required:[true,'Valid email is required!'],
    minlength: 1,
    unique: true,
    trim:true,
    validate:{
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password:{
    type:String,
    required:true,
    minlength:12
  },
  tokens: [
    {
      access: {
        type:String,
        required: true
      },
      token: {
        type:String,
        required:true
      }
    }
  ]
});
module.exports = {User}
// var user = new User({
//   email: 'steve@mintsocial.com     '
// });
//
// user.save().then((doc)=>{
//   console.log('saved user: ', doc);
// },(e)=>{
//   console.log('Unable to save user', e)
// });
