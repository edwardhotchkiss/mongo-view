
/**
 * @list module dependencies
 **/

var path = require('path')
  , Schema = require('mongoose').Schema
  , querystring = require('querystring')
  , mongodb = require(path.normalize(__dirname + '/../lib/mongodb'))
  , MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test'
  , ObjectId = Schema.ObjectId;

/**
 * @description middleware
 */

var checkConnected = require(__dirname + '/../middleware/checkConnected');

/**
 * @description export controllers
 * Preserve `mongoose` & `mongoose.connection` context
 **/

module.exports = function(app, mongoose) {

  // PUT
  app.put('/database/:database/collections/:collection/create', checkConnected, function(request, response) {
    mongodb.create(mongoose, request.params['collection'], request.body, function(error, doc) {
      if (error) {
        response.send(error, 500);
      } else {
        response.send(doc);
      }
    });
  });

  // GET
  app.get('/database/:database/collections/:collection/all', checkConnected, function(request, response) {
    mongodb.find(mongoose, request.params.collection, {}, function(error, collection) {
      if (error) {
        response.send(error, 500);
      } else {
        response.send(collection);
      };
    });
  });

  app.get('/database/:database/collections/:collection/find/:params', checkConnected, function(request, response) {
    var params = querystring.parse(request.params['params']);
    mongodb.find(mongoose, request.params.collection, params, function(error, collection) {
      if (error) {
        response.send(error, 500);
      } else {
        response.send(collection);
      };
    });
  });

  // POST
  app.post('/database/:database/collections/:collection/update', checkConnected, function(request, response) {
    var params = querystring.parse(request.params['params']);
    if ('_id' in params) {
      params['_id'] = mongoose.mongo.BSONPure.ObjectID.fromString(params['_id']);
    };
    mongodb.update(mongoose, request.params['collection'], params, function(error, doc) {
      if (error) {
        response.send(error, 500);
      } else {
        response.send(doc);
      }
    });
  });

  // DELETE
  app['delete']('/database/:database/collections/:collection/delete', checkConnected, function(request, response) {
    var params = querystring.parse(request.params['params']);
    if ('_id' in params) {
      params['_id'] = mongoose.mongo.BSONPure.ObjectID.fromString(params['_id']);
    };
    mongodb.remove(mongoose, request.params['collection'], params, function(error, result) {
      if (error) {
        response.send(error, 500);
      } else {
        response.send(result);
      }
    });
  });

};

/* EOF */