const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

/**** Configuration ****/
const port = (process.env.PORT || 8080);
const app = express();

app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../dist/mandatory_exercise'));

// Additional headers for the response to avoid trigger CORS security
// errors in the browser
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

/**** Mock questions ****/
questions = [{
  "id": 1,
  "title": "Have trouble",
  "question": "What do?",
  "createTime": 0,
  "updateTime": null
}, {
  "id": 2,
  "title": "Stupid thing",
  "question": "How make work?",
  "createTime": 1000000,
  "updateTime": null
}];

/**** Mock answers ****/
answers = [{
  "id": 1,
  "questionId": 1,
  "answer": "read the docs",
  "createTime": 5000,
  "updateTime": null,
  "votesFor": 0,
  "votesAgainst": 0
}];

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

app.get('/api/questions', (req, res) => res.json(questions));

app.get('/api/question/:questionId', (req, res) => {
  const id = Number(req.params.questionId);
  const question = questions
    .find(q => q.id === id);
  res.json(question);
});

// POST new question and add it to the array.
app.post('/api/question', (req, res) => {
  const newId = questions.reduce((a, c) => c.id > a ? c.id : a, 0) + 1;
  questions.push({
    createTime: new Date(),
    updateTime: null,
    title: req.body.title,
    question: req.body.question,
    id: newId
  });
  res.json(newId);
});

// POST new question and add it to the array.
app.post('/api/answer', (req, res) => {
  const newId = answers.reduce((a, c) => c.id > a ? c.id : a, 0) + 1;
  answers.push({
    createTime: new Date(),
    updateTime: null,
    answer: req.body.answer,
    questionId: req.body.questionId,
    id: newId,
    votesFor: 0,
    votesAgainst: 0
  });
  res.json(newId);
});

// GET answers to a question.
app.get('/api/answers/:questionId', (req, res) => res.json(answers
  .filter(a => a.questionId === Number(req.params.questionId))));

app.get('/api/upVote/:id/:operation', (req, res) => {
  const id = Number(req.params.id);
  const operation = req.params.operation;
  const answer = answers.find(a => a.id === id);
  switch (operation) {
    case "increment":
      answer.votesFor++;
      break;
    case "decrement":
      answer.votesFor--;
      break;
  }
});

app.get('/api/downVote/:id/:operation', (req, res) => {
  const id = Number(req.params.id);
  const operation = req.params.operation;
  const answer = answers.find(a => a.id === id);
  switch (operation) {
    case "increment":
      answer.votesAgainst++;
      break;
    case "decrement":
      answer.votesAgainst--;
      break;
  }
});

/**** Reroute all unknown requests to angular index.html ****/
app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../dist/mandatory_exercise/index.html'));
});


/**** Start ****/
app.listen(port, () => console.log(`Mandatory exercise API running on port ${port}!`));

