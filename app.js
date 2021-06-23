const express = require("express");
const session = require('express-session');
const bcrypt = require('bcryptjs');
var path = require('path');
const port = 3000;
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client

const app = express();

const mongoose = require("./mongoose")
mongoose();

const User = require('./models/user')
const Task = require('./models/task')



// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname,"/public")));
app.use("/list/css", express.static(__dirname + '/public/css'));
app.use("/list/js", express.static(__dirname + '/public/js'));
app.use("/list/fonts", express.static(__dirname + '/public/fonts'));

app.use(session({
  secret: 'shhsecret',
  saveUninitialized: false,
  resave: false
}));


app.get('/list/:userId', (req, res) => {
  if (req.session.user){
    res.sendFile(__dirname + '/public/list.html');
  } else {
    res.redirect('/login');
  }
});

app.get('/userInfo', (req, res) => {
  res.json({
    user: req.session.user
  })
});

app.post('/add', async (req, res) => {
  console.log('adding');

  const text = req.body.text;
  const u = await User.findOne({username: req.session.user});

  const task = new Task({
    text: text,
    done: false,
    userId: u._id
  })

  task.save().then((result) => {
    res.redirect("/list/" + req.session.user)
  }, (error) => {
    res.status(400).send(error) // 400 for bad request
  })
})

app.put('/edit/:id', async (req, res) => {

  const id = req.params.id

  const task = await Task.findById(id);
  console.log('changing state of "done": '+task.text);
  task.updateOne({done: !task.done}).then((result) => {
    res.sendFile(__dirname + '/public/list.html');
  }, (error) => {
    console.log(error);
  });
  // res.redirect('/list/' + req.session.user)
})

app.delete('/edit/:id', async (req, res) => {
  const id = req.params.id

  const task = await Task.findByIdAndRemove(id);
  res.end()

})

app.get('/tasks', async (req, res) => {
  console.log('getting tasks')
  const u = await User.findOne({username: req.session.user});
  const tasks = await Task.find({userId: u._id});
  res.json(tasks);
})


// login

app.get('/login', (req, res) => {

  if (req.session.user) {
    res.redirect("/list/" + req.session.user)
  }

  res.sendFile(__dirname + '/public/login.html');
})

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({username: username});
  if (!user){
    console.log('user does not exist');
    return res.status(400).json({error: 'User does not exist'});
  }

  const pwMatch = await bcrypt.compare(password, user.password);
  if (!pwMatch) {
    console.log('incorrect password');
    return res.status(400).json({error: 'Incorrect password'});
  }

  req.session.user = username;
  return res.redirect(`/list/${username}`);
})

// signup

app.get('/signup', (req, res) => {
  if (req.session.user) {
    res.redirect("/list/" + req.session.user)
  }

  res.sendFile(__dirname + '/public/signup.html')
})

app.post('/signup', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const salt = await bcrypt.genSalt();
  const encrypted = await bcrypt.hash(password, salt)

  const user = new User({
    username: username,
    password: encrypted
  })

  user.save().then((result) => {
    req.session.user = username
    res.redirect("/list/"+username)
  }, (error) => {
    res.status(400).send(error) // 400 for bad request
  })
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/')
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});




app.listen(process.env.PORT || port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
