#!/usr/bin/env node

/**
 * Module Dependencies
 */

require('../app/helpers/colors');

var mongodb_viewer = require('../app/lib/mongodb-viewer')
  , port = port || 8000;
    
console.log(['\n','> running mongodb-viewer on port ',port,'\n'].join('').cyan);
mongodb_viewer.app.listen(port);

/* EOF */