var mongoose = require('mongoose');
//User
//email -required, trimmed, type string, minlength 1
var User = mongoose.model('User',{
  email:{
    type:String,
    required:true,
    minlength: 1,
    trim:true
  }
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
