//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB Server');
  }
  console.log('Connected to MongoDB Server')
  // db.collection('Todos').insertOne({
  //   text: 'Get more Todos',
  //   completed: true
  // },(err, result)=>{
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })


//========Insert a new doc into Users (name, age, location)
  db.collection('Users').insertOne({
    name: 'Steve Heideman',
    age: 41,
    location:'Mesa, AZ'
  },(err, result)=>{
    if(err){
      return console.log('Unable to insert user', err);
    }
    console.log(JSON.stringify(result.ops[0]._id.getTimestamp()))
  })
  db.close();
});
