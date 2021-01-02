const express = require('express');
const app = express();
const PORT = 5000;

const mongoose = require('mongoose');
const MONGO_DB_KEY = require('./key/mongo.js');
console.log(MONGO_DB_KEY);

mongoose
  .connect(
    `mongodb+srv://yujo:${MONGO_DB_KEY}@boiler-plate.c5ep7.mongodb.net/<dbname>?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  )
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`localhost:${PORT} now running🏃‍`));
