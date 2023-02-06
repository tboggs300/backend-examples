const mongoose = require('mongoose');
const db = mongoose.connection;

const credentials = require('./config.json');
const { connectionString } = credentials.mongo;

if (!connectionString) {
  console.error('Database connection string missing!');
  process.exit(1);
}

mongoose.connect(connectionString);
mongoose.set('strictQuery', false);


db.on('error', err => {
  console.error('Database error: ' + err);
  process.exit(1);
});

db.once('open', () => console.log('Connection to database achieved.'));
