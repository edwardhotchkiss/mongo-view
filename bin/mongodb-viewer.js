#!/usr/bin/env node

/**
 * @list dependencies
 **/

require('../app/helpers/colors');

var mongodb_viewer = require('../app/lib/mongodb-viewer')
  , args = process.argv
  , port = 8000;

switch(args[2]) {
  case 'run':
  case '-r':
  case '--run':
    if (args[3] && args[3] === '--port' && args[4]) {
      var port = args[4];
    };
    console.log('> running mongodb-viewer on port %s'.magenta, port);
    mongodb_viewer.app.listen(port);
    break;
  default:
    console.log('> running mongodb-viewer on port %s'.magenta, port);
    mongodb_viewer.app.listen(port);
    break;
};

/* EOF */