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
    // ====== FIND ALL RECORDS IN COLLECTION =======
    // db.collection('Todos').find().toArray().then((docs)=>{
    //   console.log('Todos:');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err)=>{
    //   console.log('Unable to fetch todos', err)
    // });

    //=========== FIND ONE SPECIFIC RECORD WITH ID=========
    // db.collection('Todos').find({
    //   _id: new ObjectID('58e17e0c2f05ae1dddb3f4ab')
    // }).toArray().then((docs)=>{
    //   console.log('Todos:');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err)=>{
    //   console.log('Unable to fetch todos', err)
    // });

  //======== COUNT RECORDS ===============
    db.collection('Todos').find().count().then((count)=>{
      console.log(`Todos Count: ${count}`);
    }, (err)=>{
      console.log('Unable to fetch todos', err)
    });
//========= FIND USER WITH NAME ============
    db.collection('Users').find({
    name: 'Steve Heideman'
    }).toArray().then((docs)=>{
      console.log('Todos:');
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err)=>{
      console.log('Unable to fetch todos', err)
    });
    //db.close();
});
