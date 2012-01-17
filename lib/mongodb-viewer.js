
/*!
  @class mongodb-viewer
 */

require('./colors');

/*!
  setup
 */

var express = require('express')
  , mongoose = require('mongoose')
  , app = exports.httpServer = express.createServer()
  , MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test'
  , SECRET = process.env.SECRET || 'CHANGE_ME!'
  , utils = require('./utils')

/*!
  configure express
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
  app.set('views', __dirname + '/../views');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret:SECRET
  }));
  app.set('view engine', 'ejs');
});

app.get('/', function(request, response) {
  response.render('index',  {
    MONGO_DB : MONGO_DB
  });
});

app.post('/', function(request, response) {
  mongoose.connect(request.body['connection-string']);
  mongoose.connection.on('open', function(){
    request.session.connected = true;
    db_name = request.body['connection-string'].split('/');
    db_name = db_name[db_name.length - 1];
    response.redirect('/database/' + db_name);
  });
  mongoose.connection.on('error', function(error){
    throw new Error(error);
  });
});

app.get('/database/:database', checkConnected, function(request, response) {
  if (request.session && request.session.connected === true) {
    utils.getCollectionsWithCount(mongoose, function(error, collections) {
      response.render('collections', {
        locals : { 
          collections : collections,
          db_name     : request.params.database
        }
      });
    });
  } else {
    response.redirect('/');
  }
});

/*!
  route:
    /database/:database/collections/:collection'
 */

app.get('/database/:database/collections/:collection', checkConnected, function(request, response) {
  utils.find(mongoose, request.params.collection, {}, function(error, collection) {
    if (error) {
      throw new Error(error);
    } else {
      response.render('collection', {
        locals : {
          collectionName : request.params.collection,
          collection     : collection
        }
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
        logger('v0.1.2');
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

var logger = exports.logger = function(str, isError){
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
  @method run
  run mongodb-viewer
 */

var run = exports.run = function(port) {
  port = port || 8000;
  app.listen(port, function() {
    logger('running on port: '+port);
  });
};

/*!
  @method connect
  @param {String} mongodb MongoDB Connection String
 */

var connect = exports.connect = function(mongodb){
  mongoose.connect(mongodb);
}

/* EOF */