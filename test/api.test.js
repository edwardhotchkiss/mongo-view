
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
  'when connecting to mongodb://localhost/test':{
    topic:function(){
      var self = this;
      mongo_view.app.listen(8000);
      request('http://localhost:8000/api/connect/?connection-string=mongodb%3A%2F%2Flocalhost%2Ftest', self.callback);
    },
    'request should return no errors':function(error, response, body){
      assert.isNull(error);
    },
    'there should be a 200 response code, and html within the body':function(error, response, body){
      assert.equal(response.statusCode, 200);
    },
    'db_name should be defined':function(error, response, body){
      mongo_view.app.close();
      assert.isNotNull(body['db_name']);
    }
  }
}).export(module);

/* EOF */