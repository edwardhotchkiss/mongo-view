
/**
 * @middleware Express Middleware
 **/

module.exports = function checkConnected(request, response, next) {
  if (request.session.connected === undefined) {
    response.redirect('/', 403);
  } else {
    next();
  };
};

/* EOF */