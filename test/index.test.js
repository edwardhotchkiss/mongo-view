
/**
 * @list module dependencies
 **/

var vows = require('vows')
  , assert = require('assert')
  , request = require('request')
  , mongo_view = require('../app/lib/mongo-view')
  , httpServer = mongo_view.httpServer;

/**
 * @vows
 **/

vows.describe('general module tests').addBatch({
  'when instantiating mongo_view':{
    topic:function(){
      return mongo_view;
    },
    'mongodb_viewer should be an object':function(topic) {
      assert.isObject(topic);
    },
  },
  'when starting then requesting the application':{
    topic:function(){
      var self = this;
      mongo_view.app.listen(8000);
      request('http://localhost:8000/', self.callback);
    },
    'request should return no errors, a 200 response code, and html within the body':function(error, response, body){
      mongo_view.app.close();
      assert.isNull(error);
      assert.equal(response.statusCode, 200);
      assert.equal(/html/.test(body), true);
    }
  }
}).export(module);

/* EOF */