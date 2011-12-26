#!/usr/bin/env node

/*!
  @class mongodb_viewer

 */

var argv = process.argv,
    mongodb_viewer = require('../lib/mongodb-viewer');

mongodb_viewer.parse(argv);

/* EOF */