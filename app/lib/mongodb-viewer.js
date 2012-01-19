
/*!
  @class mongodb-viewer
 */

require('../helpers/colors');

/*!
  setup
 */

var path = require('path')
  , express = require('express')
  , mongoose = require('mongoose')
  , app = exports.app = express.createServer()
  , SECRET = process.env.SECRET || 'DONT/TAZE/ME/BRO!';

/*!
  configure express
 */

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

/*!
  require controllers/routes
 */

require(__dirname + '/../controllers/rest')(app, mongoose);
require(__dirname + '/../controllers/index')(app, mongoose);
require(__dirname + '/../controllers/collections')(app, mongoose);

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
        console.log('v0.1.2'.green);
        break; 
      default:
        usage();
    };
  } else {
    app.listen(8000);
  }
};

/*!
  @method usage
  Display usage information
 */

function usage(){
  console.log([
    '',
    'Usage: mongodbviewer',
    '',
    'Options:',
    '  -v, --version    current `mongodb-viewer` version',
    '  -h, --help       display usage information',
    ''
  ].join('\n'));
};

/* EOF */