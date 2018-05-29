var ObjectID = require("mongodb").ObjectID;

const COLLECTION = "comments";

module.exports = function(app, db) {
  app.get('/api/comment', (req, res) => {
    const blogId = req.query.blogId;
    db.collection(COLLECTION).find({blogId}).sort({ _id: -1 }).toArray((err, items) => {
      if (err) {
        res.send({ "error": `${COLLECTION}: An error getting index has occurred. ${err}` });
      } else {
        res.send(items);
      }
    });
  });

  app.post("/api/comment", (req, res) => {
    const comment = {
      body: req.body.body,
      userName: req.body.userName,
      userId: req.body.userId,
      blogId: req.body.blogId,
    };
    db.collection(COLLECTION).insert(comment, (err, result) => {
      if (err) {
        res.send({ "error": `${COLLECTION}: An error creating has occurred. ${err}` });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  app.delete('/api/comment/:id', (req, res) => {
    const id = req.params.id;
    const comment = { '_id': new ObjectID(id) };
    db.collection(COLLECTION).remove(comment, (err, item) => {
      if (err) {
        res.send({ "error": `${COLLECTION}: An error deleting has occurred. ${err}` });
      } else {
        res.send('Comment ' + id + ' deleted!');
      }
    });
  });
};
