const express = require('express');
const app = express();
const PORT = 5000;
const bodyParser = require('body-parser');
const { User } = require('./models/User');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require('mongoose');
const MONGO_DB_KEY = require('./key/mongo');
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

app.post('/register', (req, res) => {
  // 회원 가입시 필요한 정보를 client에서 가져오면 그것들을 DB에 넣어준다.
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(PORT, () => console.log(`localhost:${PORT} now running🏃‍`));
