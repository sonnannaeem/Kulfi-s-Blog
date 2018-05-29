const logins = require('./logins');

module.exports = {
  url : `mongodb://${logins.db.username}:${logins.db.password}@ds237610.mlab.com:37610/blog`,
};