#!/usr/bin/env node

/*!

http://github/edwardhotchkiss/mongodb-viewer/
Node.JS MongoDB web-based admin/viewer tool

*/

/*!
  Module Dependencies
 */

require('../app/helpers/colors');

var program = require('commander')
  , mongodb_viewer = require('../app/lib/mongodb-viewer');

/*!
  Setup CLI w/ Commander.js
 */

program
  .version('0.1.2')

program
  .command('run [port]')
  .description('run mongodb-viewer on <port>')
  .option("-p, --port [port]", 'Which port to run mongodb-viewer on')
  .action(function(port){
    port = port || 8000;
    console.log(['\n','> running mongodb-viewer on port ',port,'\n'].join('').cyan);
    mongodb_viewer.app.listen(port);
  });

program.parse(process.argv);

/* EOF */