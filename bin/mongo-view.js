#!/usr/bin/env node

/**
 * @list dependencies
 **/

require('../app/helpers/colors');

var mongo_view = require('../app/lib/mongo-view')
  , args = process.argv
  , port = 9000;

switch(args[2]) {
  case 'run':
  case '-r':
  case '--run':
    if (args[3] && args[3] === '--port' && args[4]) {
      var port = args[4];
    };
    console.log('> mongo-view running on port %s'.magenta, port);
    mongo_view.app.listen(port);
    break;
  default:
    console.log('> mongo-view running on port %s'.magenta, port);
    mongo_view.app.listen(port);
    break;
};

/* EOF */