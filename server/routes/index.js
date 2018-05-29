const blogRoutes = require('./blog_routes');
const commentRoutes = require('./comment_routes');
const userRoutes = require('./user_routes');

module.exports = function(app, db) {
  blogRoutes(app, db);
  commentRoutes(app, db);
  userRoutes(app, db);
  // Other route groups could go here, in the future
};
