
/*!
  @class mongodb-viewer
 */

require('./colors');

/*!
  Setup
 */

var version = 'v0.0.0',
    express = require('express'),
    mongoose = require('mongoose'),
    app = express.createServer();

/*!
  Configure ExpressJS
 */

app.configure(function() {
  app.use(express.static(__dirname+'/../public'));
  app.use(express.bodyParser());
});

app.post('/', function(request, response) {
  var MONGO_DB = request.body['connection-string'];
  mongoose.connect(MONGO_DB);
  mongoose.connection.on('open', function(){
    console.log('mongodb:connected');
  });
  mongoose.connection.on('error', function(error){
    throw new Error(error);
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