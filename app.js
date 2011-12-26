
/*!

  http://github/edwardhotchkiss/mongodb-viewer/
  NodeJS MongoDB web-based admin/viewer tool

*/

var url = require('url'),
    express = require('express'),
    mongodb_viewer = require('./lib/mongodb-viewer'),
    app = express.createServer(),
    port = process.env.PORT || 8000;

/*!
  Setup ExpressJS
 */

app.configure(function() {
  app.use(express.static(__dirname+'/public'));
  app.use(express.bodyParser());
});

/*!
  API Calls to Generate Short URLs
 */

app.listen(port, function() {
  mongodb_viewer.run(port);
});

/* EOF */
