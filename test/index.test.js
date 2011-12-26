
/*!
  Core Modules
 */

var vows = require('vows'),
    assert = require('assert'),
    mongodb_viewer = require('../lib/mongodb-viewer');

/*!
  vows / `npm test`
 */

vows.describe('general module tests').addBatch({
  'when instantiating mongodb_viewer':{
    topic:function(){
      return mongodb_viewer;
    },
    'mongodb_viewer should be an object':function(topic) {
      assert.isObject(topic);
    },
  }
}).export(module);

/* EOF */