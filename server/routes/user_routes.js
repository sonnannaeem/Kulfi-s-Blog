var ObjectID = require("mongodb").ObjectID;

const COLLECTION = "users";

module.exports = function(app, db) {
  app.post("/api/user", (req, res) => {
    const user = {
      username: req.body.username,
      password: req.body.password,
    };
    db.collection(COLLECTION).insert(user, (err, result) => {
      if (err) {
        res.send({ "error": `${COLLECTION}: An error creating has occurred. ${err}` });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  app.get('/api/user/:username', (req, res) => {
    const username = req.params.username;

    db.collection(COLLECTION).findOne({username}, (err, item) => {
      if (err) {
        res.send({ "error": `${COLLECTION}: An error creating has occurred. ${err}` });
      } else {
        if(!item) {
          item = {
            username: null,
            password: null,
          };
        }
        res.send(item);
      }
    });
  });
};
