const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.listen(port, () => console.log(`Listening on port ${port}`));

MongoClient.connect(db.url, (err, database) => {
  if (err) {
    return console.log(err);
  }

  require('./routes')(app, database);
  app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
  });
});
