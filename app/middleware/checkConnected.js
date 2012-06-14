
/**
 * @middleware checkConnected
 * @description Check for an Active Mongoose connection!
 **/

module.exports = function checkConnected(_request, _response, _next) {
  if (_request.url === '/') {
    _next();
  } else if (_request.session && _request.session.connected) {
    _next();
  } else {
    _request.flash('Not Connected!');
    _response.send(new Error('not_connected'), 599);
  };
};

/* EOF */