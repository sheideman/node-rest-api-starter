//const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server')
    // db.collection('Todos').findOneAndUpdate({
    //   _id: new ObjectID('58e188b2d14f672012a5d2a0')
    // }, {
    //   $set:{
    //     completed:true
    //   }
    // },{
    //   returnOriginal:false
    // }).then((result)=>{
    //   console.log(result);
    // }, (err)=>{
    //   console.log('Unable to update todo', err)
    // });
    //========== FIND ONE USER, UPDATE NAME & INCREMENT AGE BY 1
    // db.collection('Users').findOneAndUpdate({
    //   _id: new ObjectID('58e17f82b7219e1e2991e28a')
    // }, {
    //   $set:{
    //     name:'Steve Heideman'
    //   },
    //   $inc:{
    //     age: 1 //decrement -1
    //   }
    // },{
    //   returnOriginal:false
    // }).then((result)=>{
    //   console.log(result);
    // }, (err)=>{
    //   console.log('Unable to update todo', err)
    // });
    //db.close();
});
