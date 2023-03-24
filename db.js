const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/users-data';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
const client = new MongoClient(url, options);
client.connect((err) => {
  if (err) throw err;
  console.log('Connected successfully to MongoDB server.');
});
let db = client.db("heroes");
module.exports = db;