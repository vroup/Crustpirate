const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

/**** App modules ****/
const db = require('./db');
const ObjectID = require('mongodb').ObjectID;

/**** Configuration ****/
const port = (process.env.PORT || 8080);
const app = express();

app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../dist/mandatory_exercise'));

// Additional headers for the response to avoid trigger CORS security
// errors in the browser.
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

/**** Mock data ****/
let data = [
  {id: 1, text: "This is some text 1.", details: "Some more details 1"},
  {id: 2, text: "This is some text 2.", details: "Some more details 2"},
  {id: 3, text: "This is some text 3.", details: "Some more details 3"},
];

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

/**** Connect to MongoDB and Start! ****/
db.connect().then(() => {
  /// Insert mock data.
//  db.insertMockQuestions();
//  db.insertMockAnswers();

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
    res.sendFile(path.join(__dirname, '../dist/mandatory_exercise/index.html'));
  });

});

/**** Start ****/
app.listen(port, () => console.log(`Mandatory exercise API running on port ${port}!`));
