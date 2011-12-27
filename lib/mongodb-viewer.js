
/*!
  @class mongodb-viewer
 */

require('./colors');

/*!
  Setup
 */

var version = 'v0.0.0',
    util = require('util'),
    express = require('express'),
    mongoose = require('mongoose'),
    app = express.createServer();

/*!
  @method find
  .find within a collection
 */

function find(collection, query, callback) {
  mongoose.connection.db.collection(collection, function(error, collection) {
    collection.find(query).toArray(callback);
  });
};

/*!
  Configure ExpressJS
 */

function checkConnected(request, response, next) {
  if (request.session.connected === undefined) {
    response.redirect('/');
  } else {
    next();
  }
};

app.configure(function() {
  app.use(express.static(__dirname+'/../public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret:"@_@"
  }));
  app.set('view engine', 'ejs');
});

app.get('/', function(request, response) {
  if (request.session && request.session.connected === true) {
    mongoose.connection.db.collectionNames(function(error, collections) {
      if (error) {
        throw new Error(error);
      } else {
        // split, pop
        collections.map(function(item, i){
          item.name = item.name.split('.').pop();
        });
        // render 
        response.render('collections', {
          locals : { collections:collections }
        });
      };
    });
  } else {
    response.render('index');
  };
});

app.post('/', function(request, response) {
  mongoose.connect(request.body['connection-string']);
  mongoose.connection.on('open', function(){
    request.session.connected = true;
    response.redirect('/');
  });
  mongoose.connection.on('error', function(error){
    throw new Error(error);
  });
});

app.get('/collections/:collection', checkConnected, function(request, response) {
  find(request.params.collection, {}, function(error, collection) {
    if (error) {
      throw new Error(error);
    } else {
      console.log(collection);
      response.render('collection', {
        locals : { collectionName:request.params.collection, collection:collection }
      });
    }
  });
});

/*!
  @method parse
  @param {Object} argv CLI argv
 */

exports.parse = function parse(argv){
  if (argv[2]){
    switch(argv[2]){
      case 'help':
      case '-h':
      case '--help':
        usage();
        break;
      case 'version':
      case '-v':
      case '--version':
        displayVersion();
        break; 
      default:
        usage();
    };
  } else {
    run();
  }
};

/*!
  @method logger
  console.log with style
 */

function logger(str, isError){
  isError = isError || false;
  if (isError) {
    console.log('[mongodb-viewer]'.magenta+' '+str.red);
  } else {
    console.log('[mongodb-viewer]'.magenta+' '+str);
  }
};

/*!
  @method usage
  Display usage information
 */

function usage(){
  console.log([
    '',
    'Usage: mongodbviewer'.cyan,
    '',
    'Options:',
    '  -v, --version    current `mongodb-viewer` version',
    '  -h, --help       display usage information',
    ''
  ].join('\n'));
};

/*!
  @method displayVersion
  Display current `mongodb-viewer` version #
 */

function displayVersion(){
  logger(version);
};

/*!
  @method run
  Run mongodb-viewer
 */

function run(port) {
  port = port || 8000;
  app.listen(port, function() {
    logger('running on port: '+port);
  });
};

/*!
  @method connect
  @param {String} mongodb MongoDB Connection String
 */

function connect(mongodb){
  mongoose.connect(mongodb);
  // expose connection object
  exports.connection = mongoose.connection;
}

/*!
  Expose Yourself!
 */
exports.run = run;
exports.logger = logger;
exports.connect = connect;

/* EOF */