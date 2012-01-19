
/*!
  Express Middleware
 */

/*!
  checkConnected
  Check for an Active Mongoose connection!
 */

module.exports = function checkConnected(request, response, next) {
  if (request.session.connected === undefined) {
    response.redirect('/', 403);
  } else {
    next();
  };
};

/* EOF */