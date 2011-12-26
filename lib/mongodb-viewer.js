
/*!
  Core Modules
 */

var mongoose = require('mongoose');

function connect(mongodb){
  mongoose.connect(mongodb);
  // expose connection object
  exports.connection = mongoose.connection;
}

/*!
  Expose Yourself!
 */

exports.connect = connect;

/* EOF */