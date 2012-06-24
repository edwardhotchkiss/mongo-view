
/**
 * @list dependencies
 **/

var db
  , client
  , fs = require('fs')
  , path = require('path')
  , mongodb = require('mongodb')
  , querystring = require('querystring')

/**
 * @middleware checkConnected
 **/

var checkConnected = require(__dirname + '/../middleware/checkConnected');

/**
 * @lib mongodb
 **/

var mongo_util = require('../lib/mongo-util');

/**
 * @controller /api
 **/

module.exports = function(app) {
  
  // connect to mongodb
  app.get('/api/connect', function(_request, _response) {
    var MONGO_DB = _request.query['connection-string'];
    var db_name = MONGO_DB.split('/')[3];
    var _client = mongodb.connect(MONGO_DB, function(_error, _db) {
      if (_error) {
        _response.send(_error);
      } else {
        db = _db;
        client = _client;
        _request.session.connected = true;
        _request.session.MONGO_DB = MONGO_DB;
        _response.send({
          db_name : db_name
        });
      };
    });
  });

  // disconnect from mongodb
  app.get('/api/disconnect', function(_request, _response) {
    mongo_util.disconnect(db, function(_error) {
      if (_error) {
        _response.send(_error, 500);
      } else {
        _request.session.destroy(function(){
          _response.send({ message : 'disconnected' });
        });
      }
    });
  });

  // get database collections with collection counts
  app.get('/api/database/:database', checkConnected, function(_request, _response) {
    mongo_util.getCollectionsWithCount(db, function(_error, _collections) {
      if (_error) {
        _response.send(_error, 500);
      } else {
        _response.send(_collections);
      };
    });
  });

  // display collection item
  app.get('/api/database/:database/collection/:collection', checkConnected, function(_request, _response) {
    mongo_util.find(db, _request.params.collection, {}, function(error, collection) {
      if (error) {
        _response.send(error, 500);
      } else {
        _response.send(collection);
      }
    });
  });

  // display individual collection item
  app.get('/api/database/:database/collection/:collection/:id', checkConnected, function(_request, _response) {
    mongo_util.findItem(db, _request.params.collection, _request.params.id, {}, function(error, item) {
      if (error) {
        _response.send(error, 500);
      } else {
        _response.send(item);
      }
    });
  });

  /**
   * REST
   **/

  // PUT
  app.put('/api/database/:database/collections/:collection/create', checkConnected, function(_request, _response) {
    mongo_util.create(db, _request.params['collection'], _request.body, function(error, doc) {
      if (error) {
        response.send(error, 500);
      } else {
        response.send(doc);
      }
    });
  });

  // POST
  app.post('/api/database/:database/collections/:collection/update', checkConnected, function(_request, _response) {
    var params = querystring.parse(_request.params['params']);
    mongo_util.update(db, _request.params['collection'], params, function(error, doc) {
      if (error) {
        _response.send(error, 500);
      } else {
        _response.send(doc);
      }
    });
  });

  // DELETE
  app['delete']('/database/:database/collections/:collection/delete', checkConnected, function(_request, _response) {
    var params = querystring.parse(_request.params['params']);
    mongo_util.remove(db, _request.params['collection'], params, function(error, result) {
      if (error) {
        _response.send(error, 500);
      } else {
        _response.send(result);
      }
    });
  });

};

/* EOF */