#!/usr/bin/env node

/*!

http://github/edwardhotchkiss/mongodb-viewer/
Node.JS MongoDB web-based admin/viewer tool

*/

var mongodb_viewer = require(__dirname + '/../app/lib/mongodb-viewer');

mongodb_viewer.parse(process.argv);

/* EOF */