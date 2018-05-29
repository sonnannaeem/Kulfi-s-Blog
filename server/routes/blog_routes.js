var ObjectID = require('mongodb').ObjectID;

const COLLECTION = "blogs";

module.exports = function(app, db) {
  app.get('/api/blog', (req, res) => {
    db.collection(COLLECTION).find({}).sort({ _id: -1 }).toArray((err, items) => {
      if (err) {
        res.send({ "error": `${COLLECTION}: An error getting has occurred. ${err}` });
      } else {
        res.send(items);
      }
    });
  });

  app.post('/api/blog', (req, res) => {
    const blog = {
      title: req.body.title,
      description: req.body.description,
      body: req.body.body,
      userId: req.body.userId,
    };
    db.collection(COLLECTION).insert(blog, (err, result) => {
      if (err) {
        res.send({ "error": `${COLLECTION}: An error creating has occurred. ${err}` });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  app.get('/api/blog/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection(COLLECTION).findOne(details, (err, item) => {
      if (err) {
        res.send({ "error": `${COLLECTION}: An error getting has occurred. ${err}` });
      } else {
        res.send(item);
      }
    });
  });

  app.put('/api/blog/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const blog = { $set:{
      title: req.body.title,
      description: req.body.description,
      body: req.body.body,
      // updateAt: {"$date": new Date().toISOString()},
    }};
    db.collection(COLLECTION).update(details, blog, (err, result) => {
      if (err) {
        res.send({ "error": `${COLLECTION}: An error updating has occurred. ${err}` });
      } else {
        res.send(blog);
      }
    });
  });

  app.delete('/api/blog/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection(COLLECTION).remove(details, (err, item) => {
      if (err) {
        res.send({ "error": `${COLLECTION}: An error deleting has occurred. ${err}` });
      } else {
        res.send('Blog ' + id + ' deleted!');
      }
    });
  });
};
