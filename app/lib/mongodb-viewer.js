
/**
 * @list module dependencies
 **/

var path = require('path')
  , express = require('express')
  , mongoose = require('mongoose')
  , app = exports.app = express.createServer()
  , SECRET = process.env.SECRET || 'DONT/TAZE/ME/BRO!';

/**
 * configure express
 **/

app.configure(function() {
  app.use(express.static(path.normalize(__dirname+'/../../public')));
  app.set('views', path.normalize(__dirname + '/../views'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret:SECRET
  }));
  app.set('view engine', 'ejs');
});

/**
 * require controllers/routes
 **/

require(__dirname + '/../controllers/rest')(app, mongoose);
require(__dirname + '/../controllers/index')(app, mongoose);
require(__dirname + '/../controllers/collections')(app, mongoose);

/* EOF */