const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const checkJwt = require('express-jwt');

// const server = require('http').Server(express);
// const io = require('socket.io')(server);

/**** App modules ****/
const db = require('./db');
const ObjectID = require('mongodb').ObjectID;

/**** Configuration ****/
const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../dist/CrustPirate'));

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
    .unless({
      path: [
        '/',
        '/login',
        '/register',
        '/questions',
        /\/restaurant\//,
        '/api/restaurants',
        /\/api\/restaurant\//,
        /\/api\/reviews\//,
        '/api/authenticate/',
        '/api/new_user',
        '/api/questions',
        /\/api\/question\//,
        /\/api\/answers\//]
    })
);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error: err.message});
  }
});

let mockUsers = [
  {username: "kristian", hash: ""},
  {username: "skb", hash: ""}
];

bcrypt.hash("password123", 10, function (err, hash) {
  mockUsers[0].hash = hash;
  console.log("Mock hash generated");
});

bcrypt.hash("password456", 10, function (err, hash) {
  mockUsers[1].hash = hash;
  console.log("Mock hash generated");
});

/**** Old in-memory data from template ****/
// Mock data
let data = [
  {id: 1, text: "This is some text 1.", details: "Some more details 1"},
  {id: 2, text: "This is some text 2.", details: "Some more details 2"},
  {id: 3, text: "This is some text 3.", details: "Some more details 3"},
];

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

/**** Connect to MongoDB and Start! ****/
db.connect().then(() => {
  /**** Empty collections and insert fresh mock data ****/
  db.insertMockQuestions();
  db.insertMockRestaurants();
  db.insertMockUsers(mockUsers);

  /**** User administration ****/
  // Remember trailing slash when calling!
  app.post('/api/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username + ", " + password);

    db.getCollection("users", {"username": username}).then(
      users => {
        if (users.length === 1) {
          const [user] = users;
          bcrypt.compare(password, user.hash, (err, result) => {
            if (result) {
              const payload = {
                username: username,
                admin: false
              };
              const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

              res.json({
                message: 'User authenticated successfully.',
                token: token,
                username: user.username,
                id: user._id
              });
            } else res.status(401).json({message: "Password mismatch!"})
          });
        } else {
          res.status(404).json({message: "User not found!"});
        }
      }
    );
  });

  app.post('/api/new_user', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    db.getDocument("users", {"username": username})
      .then(() => {
        throw new Error("Username exists.");
      }, () => {
        bcrypt.hash(password, 10, (err, hash) => {
            db.insertUser(username, hash).then(() => {
              res.json({message: "User created"});
            });
          }
        )
      }).catch(e => res.status(409).send(e.message));
  });

  /**** Restaurants and reviews ****/
  app.get('/api/restaurants', (req, res) => {
    db.getCollection('restaurants', {})
      .then(restaurants => res.json(restaurants));
  });

  app.get('/api/restaurant/:restaurantId', (req, res) => {
    const query = {'_id': ObjectID(req.params.restaurantId)};
    db.getDocument("restaurants", query)
      .then(restaurant => res.status(200).send(restaurant));
  });

  app.get('/api/reviews/:restaurantId', (req, res) => {
    const restaurantId = ObjectID(req.params.restaurantId);
    db.getCollection("reviews", {'restaurantId': restaurantId})
      .then(reviews => res.status(200).send(reviews));
  });

  app.get('/api/reviews/recent/:limit', (req, res) => {
    const limit = Number(req.params.limit);

    db.getLatestReviews(limit).then(reviews => res.status(200).send(reviews));
  });

  app.post('/api/review', (req, res) => {
    const restaurantId = ObjectID(req.body.restaurantId);
    const userId = ObjectID(req.body.userId)
    const query = {
      'restaurantId': restaurantId,
      'userId': userId,
      'rating': req.body.rating,
      'title': req.body.title,
      'text': req.body.text,
      'createTime': new Date()
    };
    db.insertReview(query).then(() => res.status(200).json({message: "Review submitted."}));
  });

  /**** QA-Engine stuff ****/
  // GET a question.
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

  // POST new question.
  app.post('/api/question', (req, res) => {
    db.insertQuestion(req.body.question, req.body.title)
      .then(newId => res.json(newId));
  });

  // POST new answer and add label question "answered".
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
      .then(answers => res.status(200).json(answers));
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
    console.log("This is an unknown request.");
    res.sendFile(path.join(__dirname, '../dist/CrustPirate/index.html'));
  });
});

/**** Start ****/
app.listen(port, () => console.log(`Mandatory exercise API running on port ${port}!`));
