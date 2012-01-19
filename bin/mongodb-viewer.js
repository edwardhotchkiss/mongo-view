#!/usr/bin/env node

/*!

http://github/edwardhotchkiss/mongodb-viewer/
Node.JS MongoDB web-based admin/viewer tool

*/

var mongodb_viewer = require('./app/lib/mongodb-viewer');

mongodb_viewer.app.parse(process.argv);

/* EOF */