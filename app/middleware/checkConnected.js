
/**
 * @middleware checkConnected
 * @description Check for an Active Mongoose connection!
 **/

module.exports = function checkConnected(request, response, next) {
  if (request.session && request.session.MONGO_DB) {
  	next();
  } else {
    response.redirect('/');
  };
};

/* EOF */