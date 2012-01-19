
/*!
  module dependencies
 */

var path = require('path')
  , Schema = require('mongoose').Schema
  , mongodb = require(path.normalize(__dirname + '/../lib/mongodb'))
  , querystring = require('querystring')
  , ObjectId = Schema.ObjectId
  , MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test';

/*!
  middleware
 */

var checkConnected = require(__dirname + '/../middleware/checkConnected');

/*!
  export controllers
  Preserve `mongoose` & `mongoose.connection` context
 */

module.exports = function(app, mongoose) {
  
  // index page
  app.get('/', function(request, response) {
    response.render('index',  {
      MONGO_DB : MONGO_DB
    });
  });

  // connect to mongoose
  app.post('/', function(request, response) {
    mongoose.connect(request.body['connection-string']);
    mongoose.connection.on('open', function(){
      request.session.connected = true;
      var db_name = request.body['connection-string'].split('/');
      db_name = db_name[db_name.length - 1];
      var db_route = '/database/' + db_name;
      response.redirect(db_route);
    });
    mongoose.connection.on('error', function(error){
      throw new Error(error);
    });
  });

  // get database collections with collection counts
  app.get('/database/:database', checkConnected, function(request, response) {
    mongodb.getCollectionsWithCount(mongoose, function(error, collections) {
      response.render('collections', {
        locals : { 
          collections : collections,
          db_name     : request.params.database
        }
      });
    });
  });

  // display collection item
  app.get('/database/:database/collections/:collection', checkConnected, function(request, response) {
    mongodb.find(mongoose, request.params.collection, {}, function(error, collection) {
      if (error) {
        throw new Error(error);
      } else {
        response.render('collection', {
          locals : {
            collectionName : request.params.collection,
            collection     : collection
          }
        });
      }
    });
  });

  // REST Methods
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