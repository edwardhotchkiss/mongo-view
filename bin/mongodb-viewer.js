#!/usr/bin/env node

/**
 * @list dependencies
 **/

require('../app/helpers/colors');

var mongodb_viewer = require('../app/lib/mongodb-viewer')
  , args = process.argv
  , port = port || 8000;

console.log(args);

switch(args[2]) {
  case 'run':
  case '-r':
  case '--run':
    console.log(['\n','> running mongodb-viewer on port ',port,'\n'].join('').cyan);
    mongodb_viewer.app.listen(port);
    break;
  default:
    logger('No command specified!'.yellow);
    process.exit(0);
    break;
};

/* EOF */