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

  //======== DELETE MANY TODOS===============
    // db.collection('Todos').deleteMany({
    //   text:'Eat Lunch'
    // }).then((result)=>{
    //   console.log(result);
    // }, (err)=>{
    //   console.log('Unable to delete todos', err)
    // });
    //======== DELETE ONE TODO===============
      // db.collection('Todos').deleteOne({
      //   text:'Free Willy'
      // }).then((result)=>{
      //   console.log(result);
      // }, (err)=>{
      //   console.log('Unable to delete todos', err)
      // });
    //======== FIND ONE TODO & DELETE ============
    // db.collection('Todos').findOneAndDelete({
    //   text:'Walk the dog'
    // }).then((result)=>{
    //   console.log(result);
    // }, (err)=>{
    //   console.log('Unable to delete todos', err)
    // });

    //======== DELETE MANY USERS===============
      // db.collection('Users').deleteMany({
      //   name:'Steve Heideman'
      // }).then((result)=>{
      //   console.log(result);
      // }, (err)=>{
      //   console.log('Unable to delete todos', err)
      // });
      //======== FIND ONE USER & DELETE ============
      // db.collection('Users').findOneAndDelete({
      //   _id: new ObjectID('58e17eccd0216a1e008b65b7')
      // }).then((result)=>{
      //   console.log(result);
      // }, (err)=>{
      //   console.log('Unable to delete todos', err)
      // });
    //db.close();
});
