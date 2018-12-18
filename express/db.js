const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbName = 'qa-engine';
let client = {};

module.exports = {
  connect: connect,
  getData: getData,
  getCollection: getCollection,
  removeData: removeData,
  generateTestData: generateTestData,
  countData: countData,
  insertData: insertData,
  insertMockQuestions: insertMockQuestions,
  insertMockAnswers: insertMockAnswers,
  insertQuestion: insertQuestion,
  insertAnswer: insertAnswer,
  upVote: upVote,
  downVote: downVote
};

function connect() {
  console.log("attempting connect!");
  return new Promise((resolve, reject) => {
    mongoClient.connect(dbUrl, {useNewUrlParser: true}).then(
      (c) => {
        client = c;
        console.log("Connected successfully to mongodb server");
        resolve();
      }).catch((error) => console.error(error));
  });
}

function getData(query) {
  return new Promise((resolve, reject) => {
    client.db(dbName).collection("data").find(query).toArray().then(
      (documents) => {
        console.log("Got data");
        resolve(documents);
      }).catch((error) => console.error(error));
  });
}

function getCollection(collectionName, query) {
  console.log(query);
  return new Promise((resolve, reject) => {
    client.db(dbName).collection(collectionName).find(query).toArray().then(
      (documents) => {
        console.log(`Retrieved ${collectionName} from db.`);
        resolve(documents);
      }).catch((error) => console.error(error));
  });
}

function insertData(text, details) {
  return new Promise((resolve, reject) => {
    let data = {text: text, details: details};
    client.db(dbName).collection("data").insertOne(data).then(
      (result) => {
        console.log("Inserted data");
        resolve(result.insertedId);
      }).catch((error) => console.error(error));
  });
}

function insertQuestion(text, title) {
  return new Promise((resolve, reject) => {
    let question = {
      createTime: new Date(),
      updateTime: null,
      title: title,
      question: text,
      answered: false
    };
    client.db(dbName).collection("questions").insertOne(question).then(
      (result) => {
        console.log("Inserted question");
        resolve(result.insertedId);
      }).catch((error) => console.error(error));
  });
}

// Increments votesFor/decrements if cancel flag is set.
function upVote(answerId, cancel) {
  client.db(dbName).collection('answers')
    .update(
      {'_id': ObjectID(answerId)},
      {$inc: {votesFor: cancel ? 1 : -1}}
    );
}

// Increments votesAgainst/decrements if cancel flag is set.
function downVote(answerId, cancel) {
  client.db(dbName).collection('answers')
    .update(
      {'_id': ObjectID(answerId)},
      {$inc: {votesAgainst: cancel ? 1 : -1}}
    );
}

function insertAnswer(text, questionId) {
  return new Promise((resolve, reject) => {
    let answer = {
      createTime: new Date(),
      updateTime: null,
      answer: text,
      questionId: questionId,
      votesFor: 0,
      votesAgainst: 0
    };
    client.db(dbName).collection("answers").insertOne(answer).then(
      (result) => {
        console.log("Inserted answer");
        resolve(result.insertedId);
      }).catch((error) => console.error(error));
  });
}

function countData(query) {
  return new Promise((resolve, reject) => {
    client.db(dbName).collection("data").countDocuments(query).then(
      (count) => {
        console.log("Counted data");
        resolve(count);
      }).catch((error) => console.error(error));
  });
}

function removeData(query) {
  return new Promise((resolve, reject) => {
    client.db(dbName).collection("data").remove(query).then(
      (documents) => {
        console.log("Removed data");
      }).catch((error) => console.error(error));
  });
}

function generateTestData(count) {
  return new Promise((resolve, reject) => {
    const data = client.db(dbName).collection("data");

    let insertData = [];
    for (let i = 1; i <= count; i++) {
      insertData.push({
        text: "This is some text " + i,
        details: "Some more details " + i
      });
    }
    data.insertMany(insertData).then((result) => {
      console.log(`Generated ${count} pieces of data`);
      resolve(result);
    }).catch((error) => console.error(error));
  });
}

/**** Mock questions ****/
const mockQuestions = [{
  "title": "Have trouble",
  "question": "What do?",
  "createTime": 0,
  "updateTime": null,
  "answered": true
}, {
  "title": "Stupid thing",
  "question": "How make work?",
  "createTime": 10000000,
  "updateTime": null,
  "answered": false
}];

function insertMockQuestions() {
  return new Promise((resolve, reject) => {
    const questions = client.db(dbName).collection("questions");

    questions.insertMany(mockQuestions).then((result) => {
      console.log(`Inserted mock questions.`);
      resolve(result);
    }).catch((error) => console.error(error));
  });
}

/**** Mock answers ****/
const mockAnswers = [{
  "questionId": "-",
  "answer": "read the docs",
  "createTime": 5000,
  "updateTime": null,
  "votesFor": 0,
  "votesAgainst": 0
}];

// Will not work without knowing the _id of the question.
function insertMockAnswers() {
  return new Promise((resolve, reject) => {
    const answers = client.db(dbName).collection("answers");

    answers.insertMany(mockAnswers).then((result) => {
      console.log(`Inserted mock answers.`);
      resolve(result);
    }).catch((error) => console.error(error));
  });
}
