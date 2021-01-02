const express = require('express');
const app = express();
const PORT = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./models/User');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
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

app.post('/login', (req, res) => {
  // 요청된 이메일이 DB에 존재하는지 확인
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당되는 유저가 없습니다.',
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });
      }

      // 비밀번호가 맞다면 토큰을 생성
      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }

        // 토큰을 쿠키에 저장한다
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });

  // 요청 된 이메일이 DB에 존재한다면 비밀번호가 일치하는지 확인
});

app.listen(PORT, () => console.log(`localhost:${PORT} now running🏃‍`));
