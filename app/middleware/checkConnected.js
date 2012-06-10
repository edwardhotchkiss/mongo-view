
/**
 * @middleware checkConnected
 * @description Check for an Active Mongoose connection!
 **/

module.exports = function checkConnected(request, response, next) {
  if (request.session.connected === undefined) {
    response.redirect('/');
  } else {
    next();
  };
};

/* EOF */