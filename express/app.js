const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const checkJwt = require('express-jwt');

const server = require('http').Server(express);
const io = require('socket.io')(server);

/**** App modules ****/
const db = require('./db');
const ObjectID = require('mongodb').ObjectID;

/**** Configuration ****/
const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../dist/mandatory_exercise'));

// Additional headers for the response to avoid trigger CORS security
// errors in the browser.
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Check JWT
app.use(
  checkJwt({secret: process.env.JWT_SECRET})
    .unless({path: ['/api/authenticate/', '/api/questions']})
);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error: err.message});
  }
});

/**** Mock data ****/
let data = [
  {id: 1, text: "This is some text 1.", details: "Some more details 1"},
  {id: 2, text: "This is some text 2.", details: "Some more details 2"},
  {id: 3, text: "This is some text 3.", details: "Some more details 3"},
];

let users = [
  {name: "kristian", hash: ""},
  {name: "skb", hash: ""}
];

bcrypt.hash("password123", 10, function (err, hash) {
  users[0].hash = hash;
  console.log("Mock hash generated");
});

bcrypt.hash("password456", 10, function (err, hash) {
  users[1].hash = hash;
  console.log("Mock hash generated");
});

/**** Routes ****/
app.get('/api/my_data', (req, res) => res.json(data));

app.post('/api/my_data', (req, res) => {
  let text = req.body.text;
  let details = req.body.details;
  let nextId = data.reduce((acc, curr) => curr.id > acc.id ? curr : acc).id + 1;
  let newData = {
    id: nextId,
    text: text,
    details: details
  };
  data.push(newData);
  res.json(newData);
});

// Remember trailing slash when calling!
app.post('/api/authenticate', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(username + ", " + password);

  const user = users.find((user) => user.name === username);
  if (user) {
    bcrypt.compare(password, user.hash, (err, result) => {
      if (result) {
        const payload = {
          username: username,
          admin: false
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.json({
          message: 'User authenticated successfully.',
          token: token
        });
      }
      else res.status(401).json({message: "Password mismatch!"})
    });
  } else {
    res.status(404).json({message: "User not found!"});
  }
});

/**** Connect to MongoDB and Start! ****/
db.connect().then(() => {
  /// Insert mock data. Need only run once.
  // db.insertMockQuestions();
  // db.insertMockAnswers();

  // Insert mock users.

  /// Get a question.
  app.get('/api/question/:questionId', (req, res) => {
    const query = {'_id': ObjectID(req.params.questionId)};
    db.getCollection('questions', query)
      .then(
        question => {
          console.log(question);
          res.json(question[0]);
        }
      );
  });

  // GET all questions.
  app.get('/api/questions', (req, res) => {
    db.getCollection('questions', {})
      .then(questions => res.json(questions));
  });

  // POST new question and add it to the array.
  app.post('/api/question', (req, res) => {
    db.insertQuestion(req.body.question, req.body.title)
      .then(newId => res.json(newId));
  });

  // POST new answer and add it to the array.
  app.post('/api/answer', (req, res) => {
    const questionId = ObjectID(req.body.questionId);
    db.getCollection('questions', {'_id': questionId}).then(q => {
      if (!q.answered) {
        q.answered = true;
      }
      db.insertAnswer(req.body.answer, questionId)
        .then(newId => res.json(newId));
    });
  });

  // GET answers to a question.
  app.get('/api/answers/:questionId', (req, res) => {
    const questionId = ObjectID(req.params.questionId);
    db.getCollection('answers', {'questionId': questionId})
      .then(answers => res.json(answers));
  });

  app.put('/api/upVote', (req, res) => {
    const operation = req.body.operation;
    db.upVote(req.body.id, operation !== 'decrement'); // rename decrement to 'cancel'.
  });

  app.put('/api/downVote', (req, res) => {
    db.downVote(req.body.id, req.body.operation !== 'decrement'); // rename decrement to 'cancel'.
  });

  /**** Reroute all unknown requests to angular index.html ****/
  app.get('/*', (req, res, next) => {
    console.log("This is an unknown request.")
    res.sendFile(path.join(__dirname, '../dist/mandatory_exercise/index.html'));
  });
});

/**** Start ****/
app.listen(port, () => console.log(`Mandatory exercise API running on port ${port}!`));
